import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

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
    <aside
      className="bg-linear-to-b from-[#243144] to-[#1e2a3a] text-[#e8eef7] py-3.5 px-3 flex flex-row flex-wrap items-center justify-between gap-2 lg:flex-col lg:flex-nowrap lg:items-stretch lg:justify-start lg:gap-3.5"
      aria-label="Primary navigation"
    >
      <div className="flex items-center gap-2.5 font-extrabold tracking-wide">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">🍴</span>
        <span>RestaurantX</span>
      </div>

      <nav className="flex flex-row flex-wrap gap-1.5 lg:flex-col lg:flex-nowrap">
        {navItems.map((item) => {
          const path = routeMap[item.key];
          const isActive = activeNavKey === item.key || location.pathname === path;

          return (
            <Link
              key={item.key}
              to={path}
              className={cn(
                "text-[#d5dfef] no-underline py-2.5 px-2.5 rounded-[10px] font-semibold text-[13px]",
                isActive ? "bg-white/10" : "hover:bg-white/6"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 pt-2 border-t border-white/10 lg:mt-auto">
        <button
          type="button"
          className="bg-transparent text-[#d5dfef] border-0 py-2 px-2 font-bold cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
