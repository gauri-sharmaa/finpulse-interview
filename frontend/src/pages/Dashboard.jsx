import { formatCurrency } from "../api/client";
import { AddTransactionForm } from "../components/AddTransactionForm";
import { Card, ErrorState, Loading } from "../components/Card";
import { TransactionList } from "../components/TransactionList";
import { useFetch } from "../hooks/useFetch";

export function Dashboard() {
  const accounts = useFetch("/accounts");
  const transactions = useFetch("/transactions", { limit: 12 });

  const netWorth = (accounts.data ?? []).reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>A snapshot of your accounts and recent activity.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr", marginBottom: 24 }}>
        <div className="card">
          <div className="tile-label">Net worth</div>
          <div className="tile-value" style={{ fontSize: 42 }}>
            {accounts.loading ? "—" : formatCurrency(netWorth)}
          </div>
        </div>
      </div>

      <div className="grid kpis" style={{ marginBottom: 24 }}>
        {accounts.loading
          ? [0, 1, 2, 3].map((i) => <Loading key={i} height={96} />)
          : (accounts.data ?? []).map((a) => (
              <div className="card" key={a.id}>
                <div className="tile-label">{a.name}</div>
                <div className="tile-value">{formatCurrency(a.balance)}</div>
                <div className="tile-delta" style={{ textTransform: "capitalize" }}>{a.type}</div>
              </div>
            ))}
      </div>

      <Card title="Recent transactions" subtitle="Your 12 most recent">
        <AddTransactionForm
          accounts={accounts.data ?? []}
          onCreated={transactions.refetch}
        />
        {transactions.loading ? (
          <Loading height={300} />
        ) : transactions.error ? (
          <ErrorState error={transactions.error} onRetry={transactions.refetch} />
        ) : (
          <TransactionList transactions={transactions.data} />
        )}
      </Card>
    </div>
  );
}
