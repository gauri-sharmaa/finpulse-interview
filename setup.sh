#!/usr/bin/env bash
# One-time setup. Run from the repo root:  ./setup.sh
set -euo pipefail

echo "==> Backend"
cd backend
python3 -m venv .venv
.venv/bin/pip install --quiet --upgrade pip
.venv/bin/pip install --quiet -r requirements.txt
echo "    deps installed"

echo "==> Running tests (7 failures are expected — that is your task)"
.venv/bin/python -m pytest || true

cd ../frontend
echo "==> Frontend"
npm install --silent
echo "    deps installed"

cat <<'MSG'

Setup complete. Start the two servers in separate terminals:

  Terminal 1:  cd backend  && .venv/bin/python -m uvicorn app.main:app --reload --port 8000
  Terminal 2:  cd frontend && npm run dev

Then open http://localhost:5173/analytics
MSG
