import { formatCurrency } from "../api/client";

/**
 * A single headline number. Per our viz guidelines a lone value is a stat tile,
 * never a one-bar bar chart.
 */
export function StatTile({ label, value, delta, currency = true, goodWhen = "up" }) {
  const tone =
    delta == null || delta === 0 ? "" : (delta > 0) === (goodWhen === "up") ? "good" : "bad";

  return (
    <div className="card">
      <div className="tile-label">{label}</div>
      <div className="tile-value">{currency ? formatCurrency(value) : value}</div>
      {delta != null && (
        <div className={`tile-delta ${tone}`}>
          {delta > 0 ? "▲" : delta < 0 ? "▼" : "—"} {formatCurrency(Math.abs(delta))} vs. last month
        </div>
      )}
    </div>
  );
}
