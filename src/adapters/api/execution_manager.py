from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from datetime import datetime, timezone

from src.adapters.database_listener import DatabaseListener
from src.config import ExecutionConfig, Settings
from src.domain.test_case import TestCase, TestStep
from src.infrastructure.database import Database, Repository
from src.infrastructure.database import models as orm
from src.services.event_bus import EventBus
from src.services.execution import ExecutionResult, ExecutionService

logger = logging.getLogger(__name__)


@dataclass
class ExecutionHandle:
    """Returned to callers so they can subscribe to events and await the result independently."""

    event_bus: EventBus
    task: asyncio.Task[ExecutionResult]
    test_case_id: str


@dataclass
class _ActiveExecution:
    """Internal bookkeeping for a running execution."""

    handle: ExecutionHandle
    listener: DatabaseListener


def _orm_to_domain(orm_test_case: orm.TestCase) -> TestCase:
    """Convert an ORM TestCase to a domain TestCase."""
    steps = [
        TestStep(
            action=step.get("action", ""),
            assertion=step.get("assertion", "") or step.get("expectedResult", ""),
        )
        for step in (orm_test_case.steps_json or [])
    ]
    return TestCase(
        id=orm_test_case.id,
        name=orm_test_case.name,
        type=orm_test_case.type,
        url=orm_test_case.target_url,
        steps=steps,
    )


class ExecutionManager:
    """Manage test execution lifecycle for the API layer.

    Responsibilities:
        - Prevent concurrent execution — only one run at a time (HTTP 409).
        - Create a per-execution EventBus with a DatabaseListener attached.
        - Track active task for graceful shutdown.
        - Sweep orphaned "running" rows on shutdown.

    Usage:
        manager = ExecutionManager(database, settings)

        handle = await manager.start(test_case_id, config)

        # REST: wait for result
        result = await handle.task

        # WebSocket: subscribe then wait
        unsub = handle.event_bus.subscribe(forward, EventType.LOG)
        result = await handle.task
        unsub()
    """

    def __init__(self, database: Database, settings: Settings) -> None:
        self._db = database
        self._settings = settings
        self._repo = Repository()
        self._active: _ActiveExecution | None = None
        self._lock = asyncio.Lock()

    # public API

    async def start(
        self,
        test_case_id: str,
        config: ExecutionConfig,
    ) -> ExecutionHandle:
        """Start execution of test_case_id.

        Returns an class `ExecutionHandle` with the event bus and background task.

        Raises:
            ValueError: If test case not found.
            RuntimeError: If another execution is already in progress (409).
        """
        async with self._lock:
            if self._active is not None:
                raise RuntimeError(
                    "An execution is already in progress"
                )

            # Load and convert test case
            with self._db.session() as session:
                orm_tc = self._repo.get_test_case(session, test_case_id)
                if orm_tc is None:
                    raise ValueError(
                        f"Test case not found: {test_case_id}"
                    )
                domain_tc = _orm_to_domain(orm_tc)

            # Wire up event bus + listener
            bus = EventBus()
            listener = DatabaseListener(bus, self._db)
            listener.attach()

            service = ExecutionService(bus, self._settings)

            task = asyncio.create_task(
                self._run(test_case_id, service, domain_tc, config, listener),
                name=f"execution-{test_case_id[:8]}",
            )

            handle = ExecutionHandle(
                event_bus=bus,
                task=task,
                test_case_id=test_case_id,
            )

            self._active = _ActiveExecution(
                handle=handle,
                listener=listener,
            )

            return handle

    async def cancel(self, test_case_id: str) -> bool:
        """Cancel execution for a specific test case.

        Returns True if cancelled, False if not running or ID doesn't match.
        """
        async with self._lock:
            if self._active is None or self._active.handle.test_case_id != test_case_id:
                return False

            self._active.handle.task.cancel()

            # Update the database to mark the run as aborted
            self._update_run_status(test_case_id, "aborted")

            logger.info("Cancelled execution for test case %s", test_case_id)
            return True

    async def cancel_all(self) -> None:
        """Cancel the active execution and sweep orphaned DB rows.

        Called during application shutdown.
        """
        task = None
        async with self._lock:
            if self._active is not None:
                task = self._active.handle.task
                task.cancel()
                logger.info(
                    "Cancelled execution for test case %s",
                    self._active.handle.test_case_id,
                )

        if task is not None:
            await asyncio.gather(task, return_exceptions=True)

        self._sweep_abandoned_runs()

    # internals

    async def _run(
        self,
        test_case_id: str,
        service: ExecutionService,
        test_case: TestCase,
        config: ExecutionConfig,
        listener: DatabaseListener,
    ) -> ExecutionResult:
        """Wrapper that guarantees cleanup regardless of outcome."""
        try:
            return await service.execute(test_case, config)
        except asyncio.CancelledError:
            self._update_run_status(test_case_id, "aborted")
            raise
        finally:
            listener.detach()
            async with self._lock:
                self._active = None

    def _update_run_status(self, test_case_id: str, status: str) -> None:
        """Update the status of the most recent running test run for a test case."""
        try:
            with self._db.session() as session:
                run = (
                    session.query(orm.TestRun)
                    .filter_by(test_case_id=test_case_id, status="running")
                    .order_by(orm.TestRun.started_at.desc())
                    .first()
                )
                if run:
                    run.status = status
                    run.completed_at = datetime.now(timezone.utc)
                    logger.info("Updated test run %s status to %s", run.id, status)
        except Exception:
            logger.error("Failed to update run status", exc_info=True)

    def _sweep_abandoned_runs(self) -> None:
        """Mark any lingering 'running' rows as 'aborted'."""
        try:
            with self._db.session() as session:
                running = (
                    session.query(orm.TestRun)
                    .filter_by(status="running")
                    .all()
                )
                for run in running:
                    run.status = "aborted"
                    run.completed_at = datetime.now(timezone.utc)

                if running:
                    logger.info(
                        "Swept %d abandoned test run(s)", len(running)
                    )
        except Exception:
            logger.error(
                "Failed to sweep abandoned runs", exc_info=True
            )