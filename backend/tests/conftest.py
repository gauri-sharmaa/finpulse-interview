import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app  # noqa: E402

MONTH = "2026-08"


@pytest.fixture(scope="session")
def client():
    return TestClient(app)


@pytest.fixture(scope="session")
def breakdown(client):
    resp = client.get("/api/analytics/spending-by-category", params={"month": MONTH})
    assert resp.status_code == 200, (
        f"expected 200, got {resp.status_code}. "
        "Implement spending_by_category in app/routers/analytics.py."
    )
    return resp.json()
