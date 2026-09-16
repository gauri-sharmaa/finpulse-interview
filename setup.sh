#!/usr/bin/env bash
# One-time setup. Run from the repo root:  ./setup.sh
set -euo pipefail

echo "==> Backend"
python3 -m venv backend/.venv
backend/.venv/bin/pip install --quiet --upgrade pip
backend/.venv/bin/pip install --quiet -r requirements.txt
echo "    deps installed"

echo "==> Frontend"
( cd frontend && npm install --silent )
echo "    deps installed"

cat <<'MSG'

Setup complete. Start the two servers in separate terminals:

  Terminal 1:  cd backend  && .venv/bin/python -m uvicorn app.main:app --reload --port 8000
  Terminal 2:  cd frontend && npm run dev

Then open http://localhost:5173
MSG
