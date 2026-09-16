"""Contract for the spending-by-category endpoint.

These tests fail until app/routers/analytics.py::spending_by_category is
implemented. They are the spec — read them before you write the endpoint.
"""

from .conftest import MONTH


def test_excludes_income(breakdown):
    """Only expenses count toward a spending breakdown."""
    names = [row["category"] for row in breakdown["categories"]]
    assert "Salary" not in names
    assert "Freelance" not in names
    assert names, "expected at least one expense category"


def test_amounts_are_positive_magnitudes(breakdown):
    """Expenses are stored negative; the API reports them positive."""
    for row in breakdown["categories"]:
        assert row["amount"] > 0, f"{row['category']} should be a positive magnitude"
        assert round(row["amount"], 2) == row["amount"], "round amounts to 2dp"


def test_total_matches_sum_of_categories(breakdown):
    total = sum(row["amount"] for row in breakdown["categories"])
    assert abs(total - breakdown["total_spend"]) < 0.05
    assert breakdown["month"] == MONTH


def test_percentages_sum_to_100(breakdown):
    total_pct = sum(row["percentage"] for row in breakdown["categories"])
    assert abs(total_pct - 100.0) < 0.5, f"percentages summed to {total_pct}"


def test_sorted_by_amount_descending(breakdown):
    amounts = [row["amount"] for row in breakdown["categories"]]
    assert amounts == sorted(amounts, reverse=True), "sort largest spend first"
    # Housing is a flat $1850/mo and outspends every other category.
    assert breakdown["categories"][0]["category"] == "Housing"


def test_budget_limit_is_attached(breakdown):
    by_name = {row["category"]: row for row in breakdown["categories"]}
    assert by_name["Groceries"]["budget_limit"] == 650.00
    for row in breakdown["categories"]:
        assert "transaction_count" in row and row["transaction_count"] >= 1


def test_unknown_month_returns_404(client):
    resp = client.get("/api/analytics/spending-by-category", params={"month": "1999-01"})
    assert resp.status_code == 404


# --- These already pass; they cover the endpoints you were given. ------------

def test_cash_flow_reference_endpoint(client):
    rows = client.get("/api/analytics/cash-flow").json()
    assert len(rows) == 6
    assert rows[0]["month"] < rows[-1]["month"]
    for row in rows:
        assert row["expenses"] > 0
        assert abs(row["net"] - (row["income"] - row["expenses"])) < 0.05
