"""JSON-backed store for the mock dataset.

Transactions are re-read from disk so writes are visible without a restart.
Accounts and budgets stay cached — they are not mutated at runtime.

In a real deployment this module would be a database session; keeping the same
shape here means the routers look like production code.
"""

import json
from functools import lru_cache
from pathlib import Path

from .models import Account, Budget, Transaction, TransactionCreate

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load(name: str):
    return json.loads((DATA_DIR / name).read_text())


def get_transactions() -> list[Transaction]:
    return [Transaction(**row) for row in _load("transactions.json")]


def _next_txn_id(rows: list[Transaction]) -> str:
    max_n = 0
    for t in rows:
        if t.id.startswith("txn_"):
            try:
                max_n = max(max_n, int(t.id[4:]))
            except ValueError:
                continue
    return f"txn_{max_n + 1:04d}"


def add_transaction(payload: TransactionCreate) -> Transaction:
    account_ids = {a.id for a in get_accounts()}
    if payload.account_id not in account_ids:
        raise ValueError("Unknown account_id")

    rows = get_transactions()
    signed = -abs(payload.amount) if payload.type == "expense" else abs(payload.amount)
    txn = Transaction(
        id=_next_txn_id(rows),
        date=payload.date,
        description=payload.description.strip(),
        category=payload.category,
        amount=round(signed, 2),
        account_id=payload.account_id,
        type=payload.type,
    )
    rows.append(txn)
    (DATA_DIR / "transactions.json").write_text(
        json.dumps([t.model_dump() for t in rows], indent=2) + "\n"
    )
    return txn


@lru_cache(maxsize=1)
def get_accounts() -> list[Account]:
    return [Account(**row) for row in _load("accounts.json")]


@lru_cache(maxsize=1)
def get_budgets() -> list[Budget]:
    return [Budget(**row) for row in _load("budgets.json")]


def month_of(transaction: Transaction) -> str:
    """'2026-08-14' -> '2026-08'"""
    return transaction.date[:7]
