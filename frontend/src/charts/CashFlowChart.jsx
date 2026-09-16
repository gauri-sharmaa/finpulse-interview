import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency, formatMonth } from "../api/client";
import { ChartTooltip } from "./ChartTooltip";
import { chrome, series } from "./palette";

/**
 * Income vs. expenses per month.
 *
 * REFERENCE IMPLEMENTATION — this chart is finished. It shows the conventions
 * the other charts in this app follow:
 *   - colors come from palette.js (never a hard-coded hex)
 *   - two distinct series => categorical slots 1 and 2, plus a legend
 *   - 4px rounded data-ends, recessive grid, horizontal rules only
 *   - a hover tooltip is standard, not optional
 */
export function CashFlowChart({ data }) {
  const c = series();
  const { grid, axis } = chrome();

  const legend = [
    { name: "Income", color: c[1] },
    { name: "Expenses", color: c[2] },
  ];

  return (
    <>
      <div className="legend">
        {legend.map((item) => (
          <span className="legend-item" key={item.name}>
            <span className="swatch" style={{ background: item.color }} />
            {item.name}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} barGap={2}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={(m) => formatMonth(m, { short: true })}
            tick={{ fill: axis, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: grid }}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v, { compact: true })}
            tick={{ fill: axis, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip
            cursor={{ fill: grid, fillOpacity: 0.45 }}
            content={<ChartTooltip formatLabel={formatMonth} />}
          />
          <Bar dataKey="income" name="Income" fill={c[1]} radius={[4, 4, 0, 0]} maxBarSize={26} />
          <Bar dataKey="expenses" name="Expenses" fill={c[2]} radius={[4, 4, 0, 0]} maxBarSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
