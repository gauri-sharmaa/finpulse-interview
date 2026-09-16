/** Thin fetch wrapper. Vite proxies /api to the FastAPI server (vite.config.js). */

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function readError(res) {
  let detail = res.statusText;
  try {
    const body = await res.json();
    detail = body.detail ?? detail;
    if (Array.isArray(detail)) {
      detail = detail.map((d) => d.msg || JSON.stringify(d)).join("; ");
    }
  } catch {
    /* non-JSON error body; keep the status text */
  }
  return detail;
}

export async function apiGet(path, params) {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  const res = await fetch(`/api${path}${qs}`);

  if (!res.ok) {
    throw new ApiError(await readError(res), res.status);
  }
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new ApiError(await readError(res), res.status);
  }
  return res.json();
}

export const formatCurrency = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
