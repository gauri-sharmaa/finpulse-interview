from datetime import date as date_cls
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class Transaction(BaseModel):
    id: str
    date: str  # ISO date, YYYY-MM-DD
    description: str
    category: str
    amount: float  # negative = expense, positive = income
    account_id: str
    type: Literal["expense", "income"]


class TransactionCreate(BaseModel):
    date: str
    description: str = Field(min_length=1)
    category: str = Field(min_length=1)
    amount: float = Field(gt=0)
    account_id: str
    type: Literal["expense", "income"]

    @field_validator("date")
    @classmethod
    def valid_iso_date(cls, value: str) -> str:
        date_cls.fromisoformat(value)
        return value

    @field_validator("description")
    @classmethod
    def non_blank_description(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("description cannot be blank")
        return stripped


class Account(BaseModel):
    id: str
    name: str
    type: Literal["checking", "savings", "credit", "investment"]
    balance: float


class Budget(BaseModel):
    category: str
    monthly_limit: float
