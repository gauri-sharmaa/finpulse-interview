/** Thin fetch wrapper. Vite proxies /api to the FastAPI server (vite.config.js). */

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiGet(path, params) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  const res = await fetch(`/api${path}${qs}`);

  if (!res.ok) {
    let detail = res.statusText;
    try {
      detail = (await res.json()).detail ?? detail;
    } catch {
      /* non-JSON error body; keep the status text */
    }
    throw new ApiError(detail, res.status);
  }
  return res.json();
}

export const formatCurrency = (n, { compact = false } = {}) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
  }).format(n);

/** '2026-08' -> 'Aug 2026' */
export const formatMonth = (month, { short = false } = {}) => {
  const [y, m] = month.split("-");
  const label = new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-US", { month: "short" });
  return short ? label : `${label} ${y}`;
};
