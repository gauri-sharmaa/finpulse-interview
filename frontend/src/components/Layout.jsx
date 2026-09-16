import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          Fin<span>Pulse</span>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
