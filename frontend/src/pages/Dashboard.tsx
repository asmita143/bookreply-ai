import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./dashboardLayout.css";

type NavItem = { key: string; label: string; path: string };

type DashboardLayoutProps = {
  navItems: NavItem[];
  children: React.ReactNode;
  topRight?: React.ReactNode;
};

export function DashboardLayout({ navItems, children, topRight }: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <div className="rx">
      <aside className="rx__sidebar" aria-label="Primary navigation">
        <div className="rx__brand">
          <span className="rx__brandMark">🍴</span>
          <span className="rx__brandName">RestaurantX</span>
        </div>

        <nav className="rx__nav">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`rx__navItem ${location.pathname === item.path ? "rx__navItem--active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="rx__sidebarFooter">
          <button className="rx__linkButton">Logout</button>
        </div>
      </aside>

      <div className="rx__content">
        <header className="rx__topbar">
          <div className="rx__greeting">
            <div className="rx__greetingText">Good Afternoon, Anna!</div>
          </div>
          <div className="rx__topRight">{topRight}</div>
        </header>

        <section className="rx__page">{children}</section>
      </div>
    </div>
  );
}
