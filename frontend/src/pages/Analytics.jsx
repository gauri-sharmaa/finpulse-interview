import { useEffect, useState } from "react";

import { formatCurrency } from "../api/client";
import { Card, EmptyState, ErrorState, Loading } from "../components/Card";
import { MonthPicker } from "../components/MonthPicker";
import { StatTile } from "../components/StatTile";
import { CashFlowChart } from "../charts/CashFlowChart";
import { SpendingByCategoryChart } from "../charts/SpendingByCategoryChart";
import { useFetch } from "../hooks/useFetch";

export function Analytics() {
  const months = useFetch("/analytics/months");
  const [month, setMonth] = useState(null);

  // Default to the most recent month once the list arrives.
  useEffect(() => {
    if (months.data?.length && !month) setMonth(months.data.at(-1));
  }, [months.data, month]);

  const cashFlow = useFetch("/analytics/cash-flow");
  const summary = useFetch(month ? "/analytics/summary" : null, month ? { month } : null);
  const spending = useFetch(
    month ? "/analytics/spending-by-category" : null,
    month ? { month } : null
  );

  // Month-over-month deltas for the KPI row.
  const flow = cashFlow.data ?? [];
  const idx = flow.findIndex((r) => r.month === month);
  const prev = idx > 0 ? flow[idx - 1] : null;
  const delta = (key) => (prev && summary.data ? summary.data[key] - prev[key] : null);

  const savingsRate =
    summary.data && summary.data.income > 0
      ? `${Math.round((summary.data.net / summary.data.income) * 100)}%`
      : "—";

  return (
    <div className="page">
      <div className="page-head row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1>Analytics</h1>
          <p>Where the money went, and how that is trending.</p>
        </div>
        {months.data?.length > 0 && (
          <MonthPicker months={months.data} value={month} onChange={setMonth} />
        )}
      </div>

      <div className="grid kpis" style={{ marginBottom: 16 }}>
        {summary.loading || !summary.data ? (
          <>
            <Loading height={96} />
            <Loading height={96} />
            <Loading height={96} />
            <Loading height={96} />
          </>
        ) : (
          <>
            <StatTile label="Income" value={summary.data.income} delta={delta("income")} />
            <StatTile
              label="Expenses"
              value={summary.data.expenses}
              delta={delta("expenses")}
              goodWhen="down"
            />
            <StatTile label="Net" value={summary.data.net} delta={delta("net")} />
            <StatTile label="Savings rate" value={savingsRate} currency={false} />
          </>
        )}
      </div>

      <div className="grid split">
        <Card title="Cash flow" subtitle="Income vs. expenses, last 6 months">
          {cashFlow.loading ? (
            <Loading />
          ) : cashFlow.error ? (
            <ErrorState error={cashFlow.error} onRetry={cashFlow.refetch} />
          ) : (
            <CashFlowChart data={cashFlow.data} />
          )}
        </Card>

        <Card
          title="Spending by category"
          subtitle={
            spending.data
              ? `${formatCurrency(spending.data.total_spend)} total`
              : "Where this month's spending went"
          }
        >
          {spending.loading ? (
            <Loading />
          ) : spending.error ? (
            <ErrorState error={spending.error} onRetry={spending.refetch} />
          ) : !spending.data?.categories?.length ? (
            <EmptyState />
          ) : (
            <SpendingByCategoryChart data={spending.data} />
          )}
        </Card>
      </div>
    </div>
  );
}
