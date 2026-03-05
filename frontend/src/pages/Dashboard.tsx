import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

type NavItem = { key: string; label: string; path: string };

type DashboardLayoutProps = {
  navItems: NavItem[];
  children: React.ReactNode;
  topRight?: React.ReactNode;
};

export function DashboardLayout({ navItems, children, topRight }: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <div className="grid grid-cols-1 min-h-screen bg-[#f4f6f9] text-[#1b2430] font-sans lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside
        className="bg-linear-to-b from-[#243144] to-[#1e2a3a] text-[#e8eef7] py-3.5 px-3 flex flex-row flex-wrap items-center justify-between gap-2 lg:flex-col lg:flex-nowrap lg:items-stretch lg:justify-start lg:gap-3.5"
        aria-label="Primary navigation"
      >
        <div className="flex items-center gap-2.5 font-extrabold tracking-wide">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10">🍴</span>
          <span>RestaurantX</span>
        </div>

        <nav className="flex flex-row flex-wrap gap-1.5 lg:flex-col lg:flex-nowrap">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={cn(
                "text-[#d5dfef] no-underline py-2.5 px-2.5 rounded-[10px] font-semibold text-[13px]",
                location.pathname === item.path ? "bg-white/10" : "hover:bg-white/6"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="shrink-0 pt-2 border-t border-white/10 lg:mt-auto">
          <button className="bg-transparent text-[#d5dfef] border-0 py-2 px-2 font-bold cursor-pointer">
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-col">
        <header className="bg-white border-b border-[#e6ebf2] px-[18px] py-3 flex items-center justify-between">
          <div>
            <div className="font-bold">Good Afternoon, Anna!</div>
          </div>
          <div className="flex items-center gap-3 text-[#536173] font-semibold text-[13px]">{topRight}</div>
        </header>

        <section className="p-4.5">{children}</section>
      </div>
    </div>
  );
}
