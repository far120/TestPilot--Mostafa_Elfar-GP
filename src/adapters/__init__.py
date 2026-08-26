"""Adapters — consumers of domain events."""

from src.adapters.database_listener import DatabaseListener

__all__ = ["DatabaseListener"]