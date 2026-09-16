from fastapi import APIRouter

from ..models import Account, Budget
from ..store import get_accounts, get_budgets

router = APIRouter(prefix="/api", tags=["accounts"])


@router.get("/accounts", response_model=list[Account])
def list_accounts():
    return get_accounts()


@router.get("/budgets", response_model=list[Budget])
def list_budgets():
    return get_budgets()
