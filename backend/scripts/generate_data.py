"""Regenerates the mock dataset in backend/data/.

Deterministic (fixed seed) so every candidate sees identical numbers and the
tests in backend/tests/ stay stable. Run from the backend/ directory:

    python scripts/generate_data.py
"""

import json
import random
from datetime import date, timedelta
from pathlib import Path

SEED = 1332
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Six full months of history, ending 2026-08-31.
START = date(2026, 3, 1)
END = date(2026, 8, 31)

ACCOUNTS = [
    {"id": "acc_checking", "name": "Everyday Checking", "type": "checking", "balance": 4812.55},
    {"id": "acc_savings", "name": "High-Yield Savings", "type": "savings", "balance": 18240.10},
    {"id": "acc_credit", "name": "Rewards Credit Card", "type": "credit", "balance": -1183.22},
    {"id": "acc_brokerage", "name": "Brokerage", "type": "investment", "balance": 26905.78},
]

# category -> (merchants, monthly txn count range, per-txn amount range)
EXPENSE_PROFILE = {
    "Housing": (["Sunrise Property Mgmt"], (1, 1), (1850.00, 1850.00)),
    "Groceries": (["Trader Joe's", "Kroger", "Whole Foods", "Aldi"], (7, 11), (22.40, 132.75)),
    "Dining": (["Chipotle", "Blue Bottle", "Thai Basil", "Shake Shack", "Local Diner"], (6, 12), (9.25, 74.00)),
    "Transport": (["Shell", "Uber", "MARTA", "Lyft"], (4, 8), (12.00, 68.50)),
    "Utilities": (["Georgia Power", "City Water", "Xfinity"], (2, 3), (45.00, 185.00)),
    "Shopping": (["Amazon", "Target", "Nike", "IKEA"], (3, 7), (18.99, 245.00)),
    "Entertainment": (["AMC Theatres", "Ticketmaster", "Steam"], (1, 4), (14.00, 96.00)),
    "Health": (["CVS Pharmacy", "Peachtree Dental", "ClassPass"], (1, 3), (15.00, 210.00)),
    "Subscriptions": (["Netflix", "Spotify", "iCloud", "NYT"], (3, 4), (4.99, 22.99)),
}

INCOME_PROFILE = {
    "Salary": (["Simplilearn Payroll"], (2, 2), (3150.00, 3150.00)),
    "Freelance": (["Upwork", "Direct Client"], (0, 2), (280.00, 1400.00)),
}


def month_range(start: date, end: date):
    cur = date(start.year, start.month, 1)
    while cur <= end:
        yield cur
        cur = date(cur.year + (cur.month == 12), (cur.month % 12) + 1, 1)


def days_in_month(anchor: date) -> int:
    nxt = date(anchor.year + (anchor.month == 12), (anchor.month % 12) + 1, 1)
    return (nxt - timedelta(days=1)).day


def build_transactions(rng: random.Random):
    rows = []
    n = 0
    for anchor in month_range(START, END):
        dim = days_in_month(anchor)

        for category, (merchants, count_rng, amt_rng) in EXPENSE_PROFILE.items():
            for _ in range(rng.randint(*count_rng)):
                n += 1
                day = 1 if category == "Housing" else rng.randint(1, dim)
                rows.append({
                    "id": f"txn_{n:04d}",
                    "date": anchor.replace(day=day).isoformat(),
                    "description": rng.choice(merchants),
                    "category": category,
                    # Expenses are stored as negative numbers.
                    "amount": -round(rng.uniform(*amt_rng), 2),
                    "account_id": "acc_credit" if category in ("Dining", "Shopping") else "acc_checking",
                    "type": "expense",
                })

        for category, (merchants, count_rng, amt_rng) in INCOME_PROFILE.items():
            for i in range(rng.randint(*count_rng)):
                n += 1
                day = [15, min(28, dim)][i % 2] if category == "Salary" else rng.randint(1, dim)
                rows.append({
                    "id": f"txn_{n:04d}",
                    "date": anchor.replace(day=day).isoformat(),
                    "description": rng.choice(merchants),
                    "category": category,
                    "amount": round(rng.uniform(*amt_rng), 2),
                    "account_id": "acc_checking",
                    "type": "income",
                })

    rows.sort(key=lambda r: (r["date"], r["id"]))
    return rows


def build_budgets():
    return [
        {"category": "Housing", "monthly_limit": 1900.00},
        {"category": "Groceries", "monthly_limit": 650.00},
        {"category": "Dining", "monthly_limit": 400.00},
        {"category": "Transport", "monthly_limit": 300.00},
        {"category": "Utilities", "monthly_limit": 350.00},
        {"category": "Shopping", "monthly_limit": 500.00},
        {"category": "Entertainment", "monthly_limit": 200.00},
        {"category": "Health", "monthly_limit": 250.00},
        {"category": "Subscriptions", "monthly_limit": 75.00},
    ]


def main():
    rng = random.Random(SEED)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    txns = build_transactions(rng)
    (DATA_DIR / "transactions.json").write_text(json.dumps(txns, indent=2) + "\n")
    (DATA_DIR / "accounts.json").write_text(json.dumps(ACCOUNTS, indent=2) + "\n")
    (DATA_DIR / "budgets.json").write_text(json.dumps(build_budgets(), indent=2) + "\n")
    print(f"wrote {len(txns)} transactions, {len(ACCOUNTS)} accounts to {DATA_DIR}")


if __name__ == "__main__":
    main()
