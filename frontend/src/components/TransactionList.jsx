import { formatCurrency } from "../api/client";

export function TransactionList({ transactions }) {
  if (!transactions.length) return <div className="state">No transactions.</div>;

  return (
    <table>
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
            <td style={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{t.date}</td>
            <td>{t.description}</td>
            <td style={{ color: "var(--text-secondary)" }}>{t.category}</td>
            <td className="num" style={{ color: t.amount > 0 ? "var(--good)" : undefined }}>
              {formatCurrency(t.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
