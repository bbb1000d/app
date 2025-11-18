from __future__ import annotations

from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

from sqlmodel import Session, SQLModel, create_engine

DB_PATH = Path(__file__).resolve().parent.parent / "storage.db"

def get_engine(echo: bool = False):
    return create_engine(
        f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False}, echo=echo
    )

engine = get_engine()


def init_db() -> None:
    SQLModel.metadata.create_all(engine)


@contextmanager
def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
