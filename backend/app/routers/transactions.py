from fastapi import APIRouter, HTTPException, Query, status

from ..models import Transaction, TransactionCreate
from ..store import add_transaction, get_transactions, month_of

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


@router.post("", response_model=Transaction, status_code=status.HTTP_201_CREATED)
def create_transaction(payload: TransactionCreate):
    try:
        return add_transaction(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/{transaction_id}", response_model=Transaction)
def get_transaction(transaction_id: str):
    for t in get_transactions():
        if t.id == transaction_id:
            return t
    raise HTTPException(status_code=404, detail="Transaction not found")
