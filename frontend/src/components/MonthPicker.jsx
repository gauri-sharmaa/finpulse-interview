import { formatMonth } from "../api/client";

export function MonthPicker({ months, value, onChange }) {
  return (
    <label className="field">
      Month
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {months.map((m) => (
          <option key={m} value={m}>
            {formatMonth(m)}
          </option>
        ))}
      </select>
    </label>
  );
}
