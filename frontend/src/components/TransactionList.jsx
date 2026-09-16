import { formatCurrency } from "../api/client";

export function TransactionList({ transactions }) {
  if (!transactions.length) return <div className="state">No transactions.</div>;

  return (
    <table className="tx-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th className="num">Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td className="tx-date">{t.date}</td>
            <td>{t.description}</td>
            <td className="tx-cat">{t.category}</td>
            <td className={`num${t.amount < 0 ? " amount-expense" : ""}`}>
              {formatCurrency(t.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
