import { Link, useLocation } from "react-router-dom";
import "./dashboardLayout.css";

type NavItem = {
  key: string;
  label: string;
};

type SidePanelProps = {
  navItems: NavItem[];
  activeNavKey?: string;
};

export function SidePanel({ navItems, activeNavKey }: SidePanelProps) {
  const location = useLocation();

  const routeMap: Record<string, string> = {
    dashboard: "/",
    reservations: "/reservations",
    emails: "/email-dashboard",
    analytics: "/analytics",
    settings: "/settings",
  };

  return (
    <aside className="rx__sidebar" aria-label="Primary navigation">
      <div className="rx__brand">
        <span className="rx__brandMark">🍴</span>
        <span className="rx__brandName">RestaurantX</span>
      </div>

      <nav className="rx__nav">
        {navItems.map((item) => {
          const path = routeMap[item.key];

          return (
            <Link
              key={item.key}
              to={path}
              className={`rx__navItem ${
                activeNavKey === item.key || location.pathname === path
                  ? "rx__navItem--active"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rx__sidebarFooter">
        <button type="button" className="rx__linkButton">
          Logout
        </button>
      </div>
    </aside>
  );
}
