# FinPulse — Analytics Feature Exercise

FinPulse is a personal-finance tracker: accounts, transactions, budgets, and an
Analytics page. Most of it is built. **One feature on the Analytics page is not.**

You have ~20 minutes. We will work through it together, and we are far more
interested in how you think than in whether you finish every line.

---

## Setup (do this before the interview)

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

Open **http://localhost:5173/analytics**. You should see a KPI row, a working
**Cash flow** chart, and a **Spending by category** card that says *"Not
implemented yet."* That card is the exercise.

> Please confirm setup works **before** the session so we can spend the time on
> the problem. If anything fails, email us and we'll sort it out in advance.

---

## Your task

Build the **Spending by Category** breakdown, end to end.

### Part 1 — The endpoint (`backend/app/routers/analytics.py`)

Implement `GET /api/analytics/spending-by-category?month=YYYY-MM`. The response
models are already written in `backend/app/models.py`; you shouldn't need to
change them.

```jsonc
{
  "month": "2026-08",
  "total_spend": 3983.98,
  "categories": [
    {
      "category": "Housing",
      "amount": 1850.0,        // positive magnitude, 2dp
      "percentage": 46.44,     // share of total_spend, 0-100, 2dp
      "transaction_count": 1,
      "budget_limit": 1900.0   // null if no budget is set
    }
    // ...sorted by amount, largest first
  ]
}
```

Rules: expenses only (income must not appear), amounts positive, sorted
descending, unknown month → 404.

**The tests are the spec.** Run them:

```bash
cd backend && .venv/bin/python -m pytest
```

Seven fail right now. Make them pass.

### Part 2 — The chart (`frontend/src/charts/SpendingByCategoryChart.jsx`)

Render that data as a **horizontal, ranked bar chart**. The file has a detailed
TODO comment with the data shape and hints.

`frontend/src/charts/CashFlowChart.jsx` is a complete, working chart that uses
every convention this codebase expects — read it first. It is the fastest path
through this exercise.

Conventions that matter:

- **Colors come from `src/charts/palette.js`**, never a hard-coded hex, so light
  and dark mode both work. This chart compares magnitude on one measure, so it
  uses the **sequential** ramp (`rampFor(n)` — one hue, darker = more), not the
  categorical slots.
- A **hover tooltip** is standard. Reuse `ChartTooltip`.
- Handle the **empty** case.

The page already wires up loading, error, and empty states for you — your
component only receives `data` once it has loaded successfully.

### Stretch goals (only if you have time)

1. Show each category's **budget** against actual spend — over-budget categories
   should be obvious at a glance.
2. Make a bar **clickable** to filter a transaction list to that category.
3. Handle a month with **no spending** gracefully, end to end.

---

## What we're looking for

- A correct aggregation, with the income/expense sign handled properly
- Sensible React: no needless re-renders, no chart code in the page component
- Knowing **why** a horizontal bar beats a pie chart here
- Readable code we could review

Not looking for: new dependencies, tests for the frontend, or custom styling.
Ask questions — we'd rather you ask than guess.

---

## Repo map

```
backend/
  app/
    main.py              FastAPI app + CORS
    models.py            Pydantic models (response shapes)
    store.py             Loads the mock JSON, month helpers
    routers/
      analytics.py       ← YOUR TASK (plus 3 working reference endpoints)
      transactions.py    List/filter transactions
      accounts.py        Accounts + budgets
  data/                  Mock JSON: 242 transactions over 6 months
  scripts/               Regenerates the mock data (deterministic seed)
  tests/test_analytics.py  ← the spec

frontend/src/
  api/client.js          fetch wrapper + currency/date formatting
  hooks/useFetch.js      data fetching with loading/error state
  charts/
    palette.js           color tokens — categorical + sequential ramps
    CashFlowChart.jsx    ← complete reference chart, read this
    ChartTooltip.jsx     shared tooltip
    SpendingByCategoryChart.jsx  ← YOUR TASK
  pages/Analytics.jsx    the page that composes it all
  components/            Card, StatTile, MonthPicker, TransactionList
```

The API also serves interactive docs at **http://localhost:8000/docs**.

## Notes on the data

- Expenses are stored as **negative** amounts; income is positive.
- Six months, `2026-03` through `2026-08`. Housing is a flat $1,850/mo.
- Data is regenerated from a fixed seed, so everyone sees identical numbers.
