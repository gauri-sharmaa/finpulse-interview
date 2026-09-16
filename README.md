# FinPulse

Personal-finance tracker: accounts, transactions, and budgets.

## Setup

```bash
./setup.sh
```

Then start both servers in separate terminals:

```bash
# Terminal 1 — API on :8000
cd backend && .venv/bin/python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 — web on :5173
cd frontend && npm run dev
```

Open **http://localhost:5173**.

Interactive API docs are at **http://localhost:8000/docs**.

## Repo map

```
backend/
  app/
    main.py              FastAPI app + CORS
    models.py            Pydantic models
    store.py             Loads the mock JSON
    routers/
      transactions.py    List/filter transactions
      accounts.py        Accounts + budgets
  data/                  Mock JSON: 242 transactions over 6 months
  scripts/               Regenerates the mock data (deterministic seed)

frontend/src/
  api/client.js          fetch wrapper + currency formatting
  hooks/useFetch.js      data fetching with loading/error state
  pages/Dashboard.jsx    accounts + recent transactions
  components/            Layout, Card, TransactionList
```

## Notes on the data

- Expenses are stored as **negative** amounts; income is positive.
- Six months, `2026-03` through `2026-08`.
- Data is regenerated from a fixed seed, so everyone sees identical numbers.
