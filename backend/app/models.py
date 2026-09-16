from typing import Literal, Optional

from pydantic import BaseModel, Field


class Transaction(BaseModel):
    id: str
    date: str  # ISO date, YYYY-MM-DD
    description: str
    category: str
    amount: float  # negative = expense, positive = income
    account_id: str
    type: Literal["expense", "income"]


class Account(BaseModel):
    id: str
    name: str
    type: Literal["checking", "savings", "credit", "investment"]
    balance: float


class Budget(BaseModel):
    category: str
    monthly_limit: float


class MonthlySummary(BaseModel):
    month: str = Field(description="YYYY-MM")
    income: float
    expenses: float = Field(description="Positive magnitude of money spent")
    net: float


class CategorySpend(BaseModel):
    """One row of the spending-by-category breakdown."""

    category: str
    amount: float = Field(description="Positive magnitude spent in this category")
    percentage: float = Field(description="Share of the month's total spend, 0-100")
    transaction_count: int
    budget_limit: Optional[float] = Field(
        default=None, description="Monthly budget for this category, if one is set"
    )


class SpendingByCategoryResponse(BaseModel):
    month: str
    total_spend: float
    categories: list[CategorySpend]
