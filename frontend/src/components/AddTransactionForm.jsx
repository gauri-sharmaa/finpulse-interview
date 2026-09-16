import { useState } from "react";

import { apiPost } from "../api/client";

const CATEGORIES = [
  "Housing",
  "Groceries",
  "Dining",
  "Transport",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Health",
  "Subscriptions",
  "Salary",
  "Freelance",
];

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const emptyForm = (accountId) => ({
  date: todayISO(),
  description: "",
  category: "Dining",
  type: "expense",
  amount: "",
  account_id: accountId,
});

export function AddTransactionForm({ accounts, onCreated }) {
  const defaultAccount = accounts[0]?.id ?? "";
  const [form, setForm] = useState(() => emptyForm(defaultAccount));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiPost("/transactions", {
        date: form.date,
        description: form.description.trim(),
        category: form.category,
        type: form.type,
        amount: Number(form.amount),
        account_id: form.account_id || defaultAccount,
      });
      setForm(emptyForm(form.account_id || defaultAccount));
      onCreated?.();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const accountId = form.account_id || defaultAccount;
  const disabled = submitting || !accounts.length;

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <label className="tx-field">
        <span>Date</span>
        <input type="date" required value={form.date} onChange={setField("date")} />
      </label>
      <label className="tx-field tx-field-wide">
        <span>Description</span>
        <input
          type="text"
          required
          maxLength={80}
          placeholder="Merchant or payee"
          value={form.description}
          onChange={setField("description")}
        />
      </label>
      <label className="tx-field">
        <span>Category</span>
        <select value={form.category} onChange={setField("category")}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="tx-field">
        <span>Type</span>
        <select value={form.type} onChange={setField("type")}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>
      <label className="tx-field">
        <span>Amount</span>
        <input
          type="number"
          required
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={form.amount}
          onChange={setField("amount")}
        />
      </label>
      <label className="tx-field">
        <span>Account</span>
        <select value={accountId} onChange={setField("account_id")} disabled={!accounts.length}>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </label>
      <div className="tx-field tx-field-submit">
        <button type="submit" disabled={disabled}>
          {submitting ? "Adding…" : "Add"}
        </button>
      </div>
      {error && (
        <p className="tx-form-error" role="alert">
          {error.message || "Could not add transaction."}
        </p>
      )}
    </form>
  );
}
