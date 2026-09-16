"""Loads the mock dataset once at import time.

In a real deployment this module would be a database session; keeping the same
shape here means the routers look like production code.
"""

import json
from functools import lru_cache
from pathlib import Path

from .models import Account, Budget, Transaction

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load(name: str):
    return json.loads((DATA_DIR / name).read_text())


@lru_cache(maxsize=1)
def get_transactions() -> list[Transaction]:
    return [Transaction(**row) for row in _load("transactions.json")]


@lru_cache(maxsize=1)
def get_accounts() -> list[Account]:
    return [Account(**row) for row in _load("accounts.json")]


@lru_cache(maxsize=1)
def get_budgets() -> list[Budget]:
    return [Budget(**row) for row in _load("budgets.json")]


def get_budget_map() -> dict[str, float]:
    return {b.category: b.monthly_limit for b in get_budgets()}


def month_of(transaction: Transaction) -> str:
    """'2026-08-14' -> '2026-08'"""
    return transaction.date[:7]


def available_months() -> list[str]:
    return sorted({month_of(t) for t in get_transactions()})
