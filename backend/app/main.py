from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import accounts, transactions

app = FastAPI(
    title="FinPulse API",
    description="Mock personal-finance backend for FinPulse.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(accounts.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
