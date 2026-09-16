from collections import defaultdict

from fastapi import APIRouter, HTTPException, Query

from ..models import MonthlySummary, SpendingByCategoryResponse
from ..store import (
    available_months,
    get_budget_map,
    get_transactions,
    month_of,
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/months", response_model=list[str])
def list_months():
    """Every month present in the dataset, oldest first. Powers the month picker."""
    return available_months()


@router.get("/cash-flow", response_model=list[MonthlySummary])
def cash_flow():
    """Income vs. expenses for every month in the dataset, oldest first.

    This endpoint is complete and is a useful reference for the aggregation
    style used in this codebase.
    """
    income: dict[str, float] = defaultdict(float)
    expenses: dict[str, float] = defaultdict(float)

    for txn in get_transactions():
        bucket = income if txn.amount > 0 else expenses
        bucket[month_of(txn)] += abs(txn.amount)

    return [
        MonthlySummary(
            month=m,
            income=round(income[m], 2),
            expenses=round(expenses[m], 2),
            net=round(income[m] - expenses[m], 2),
        )
        for m in available_months()
    ]


@router.get("/summary", response_model=MonthlySummary)
def summary(month: str = Query(description="YYYY-MM")):
    """Headline numbers for a single month. Powers the KPI tiles."""
    if month not in available_months():
        raise HTTPException(status_code=404, detail=f"No data for month {month}")

    rows = [t for t in get_transactions() if month_of(t) == month]
    income = sum(t.amount for t in rows if t.amount > 0)
    expenses = sum(-t.amount for t in rows if t.amount < 0)

    return MonthlySummary(
        month=month,
        income=round(income, 2),
        expenses=round(expenses, 2),
        net=round(income - expenses, 2),
    )


# ---------------------------------------------------------------------------
# TODO(candidate): implement this endpoint.
#
# Return the spending breakdown by category for a single month so the Analytics
# page can chart it. The response model (SpendingByCategoryResponse /
# CategorySpend in app/models.py) is already defined — you should not need to
# change it.
#
# Requirements:
#   1. Only EXPENSES count. Income transactions must not appear.
#   2. `amount` is a positive magnitude, rounded to 2 decimals.
#   3. `percentage` is that category's share of the month's total spend (0-100),
#      rounded to 2 decimals.
#   4. Categories are sorted by `amount`, largest first.
#   5. `budget_limit` comes from get_budget_map(); None if the category has none.
#   6. An unknown month is a 404 (see `summary` above for the pattern).
#
# `pytest` in this directory pins all six. Run it.
# ---------------------------------------------------------------------------
@router.get("/spending-by-category", response_model=SpendingByCategoryResponse)
def spending_by_category(month: str = Query(description="YYYY-MM")):
    raise HTTPException(status_code=501, detail="Not implemented")
