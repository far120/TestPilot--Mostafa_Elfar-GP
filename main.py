import sys
import asyncio

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    try:
        import uvicorn.loops.asyncio
        import uvicorn.loops.auto
        uvicorn.loops.asyncio.asyncio_loop_factory = lambda use_subprocess=False: asyncio.ProactorEventLoop
        uvicorn.loops.auto.auto_loop_factory = lambda use_subprocess=False: asyncio.ProactorEventLoop
    except Exception:
        pass

import uvicorn

if __name__ == "__main__":
    print("Starting TestPilot FastAPI Server on http://127.0.0.1:8000 ...")
    uvicorn.run(
        "src.adapters.api.app:create_app",
        factory=True,
        host="127.0.0.1",
        port=8000,
        reload=True,
        loop="asyncio",
    )

