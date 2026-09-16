/*
 * TODO(candidate): build this chart.
 *
 * Render the month's spending broken down by category, using the data from
 * GET /api/analytics/spending-by-category (which you implement first).
 *
 * Use a HORIZONTAL bar chart, ranked largest spend at the top. The categories
 * have long names and there are ~9 of them, so horizontal bars stay readable
 * where a pie or a vertical bar chart would not. This is comparing magnitude on
 * one measure, so it takes the SEQUENTIAL ramp (one hue, darker = more) rather
 * than categorical colors — `rampFor(n)` in ./palette returns exactly that,
 * darkest first.
 *
 * Expected shape of `data`:
 *   {
 *     month: "2026-08",
 *     total_spend: 3983.98,
 *     categories: [
 *       { category: "Housing", amount: 1850.0, percentage: 46.44,
 *         transaction_count: 1, budget_limit: 1900.0 },
 *       ...sorted by amount, descending
 *     ]
 *   }
 *
 * Requirements:
 *   - Horizontal bars, ranked, using rampFor() from ./palette.
 *   - A hover tooltip showing the category, its amount, and its percentage.
 *   - Handle the empty case (`categories` is []).
 *   - Match the conventions in CashFlowChart.jsx: colors from palette.js,
 *     4px rounded data-ends, recessive grid, currency via formatCurrency.
 *
 * Useful imports (CashFlowChart.jsx is a complete working example):
 *   import { Bar, BarChart, Cell, CartesianGrid, ResponsiveContainer,
 *            Tooltip, XAxis, YAxis } from "recharts";
 *   import { formatCurrency } from "../api/client";
 *   import { ChartTooltip } from "./ChartTooltip";
 *   import { chrome, rampFor } from "./palette";
 *
 * Hint: for horizontal bars in Recharts, set `layout="vertical"` on <BarChart>,
 * put the numeric scale on <XAxis type="number"> and the categories on
 * <YAxis type="category" dataKey="category">. Per-bar colors come from mapping
 * <Cell> children inside <Bar>.
 */
export function SpendingByCategoryChart({ data }) {
  return (
    <div className="todo">
      <strong>Not implemented yet</strong>
      Build this chart in <code>src/charts/SpendingByCategoryChart.jsx</code>
    </div>
  );
}
