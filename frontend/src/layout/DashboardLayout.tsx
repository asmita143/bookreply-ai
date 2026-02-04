import React from "react";
import { SidePanel } from "./SidePanel";

type NavItem = {
  key: string;
  label: string;
};

type DashboardLayoutProps = {
  navItems: NavItem[];
  activeNavKey?: string;
  topRight?: React.ReactNode;
  children: React.ReactNode;
};

export function DashboardLayout({ navItems, activeNavKey, topRight, children }: DashboardLayoutProps) {
  return (
    <div className="grid grid-cols-1 min-h-screen bg-[#f4f6f9] text-[#1b2430] font-sans lg:grid-cols-[220px_minmax(0,1fr)]">
      <SidePanel navItems={navItems} activeNavKey={activeNavKey} />

      <div className="flex flex-col">
        <header className="bg-white border-b border-[#e6ebf2] px-[18px] py-3 flex items-center justify-between">
          <div>
            <div className="font-bold">Good Afternoon, Anna!</div>
          </div>
          <div className="flex items-center gap-3 text-[#536173] font-semibold text-[13px]">{topRight}</div>
        </header>

        <section className="p-[18px]">{children}</section>
      </div>
    </div>
  );
}
