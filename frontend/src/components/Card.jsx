export function Card({ title, subtitle, actions, children }) {
  return (
    <section className="card">
      {(title || actions) && (
        <header className="card-head row" style={{ justifyContent: "space-between" }}>
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export const Loading = ({ height = 240 }) => (
  <div className="skeleton" style={{ height }} aria-busy="true" aria-label="Loading" />
);

export const ErrorState = ({ error, onRetry }) => (
  <div className="state error" role="alert">
    <p style={{ margin: "0 0 10px" }}>{error?.message || "Something went wrong."}</p>
    {onRetry && <button onClick={onRetry}>Retry</button>}
  </div>
);
