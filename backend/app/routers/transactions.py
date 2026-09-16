from fastapi import APIRouter, HTTPException, Query

from ..models import Transaction
from ..store import get_transactions, month_of

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("", response_model=list[Transaction])
def list_transactions(
    month: str | None = Query(default=None, description="Filter to a month, YYYY-MM"),
    category: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
):
    rows = get_transactions()
    if month:
        rows = [t for t in rows if month_of(t) == month]
    if category:
        rows = [t for t in rows if t.category == category]
    return sorted(rows, key=lambda t: t.date, reverse=True)[:limit]


@router.get("/{transaction_id}", response_model=Transaction)
def get_transaction(transaction_id: str):
    for t in get_transactions():
        if t.id == transaction_id:
            return t
    raise HTTPException(status_code=404, detail="Transaction not found")
