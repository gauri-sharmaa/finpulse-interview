import { formatCurrency } from "../api/client";

/**
 * Shared tooltip body. Recharts passes `payload` (the hovered series) and
 * `label` (the x value). Reuse this rather than styling a tooltip per chart.
 */
export function ChartTooltip({ active, payload, label, formatLabel = (v) => v }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="tooltip">
      <div className="t-title">{formatLabel(label)}</div>
      {payload.map((entry) => (
        <div className="t-row" key={entry.dataKey}>
          <span className="t-key">
            <span className="swatch" style={{ background: entry.color || entry.fill }} />
            {entry.name}
          </span>
          <span className="t-val">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}
