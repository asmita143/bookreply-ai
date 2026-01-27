import React from "react";
import "./dashboardLayout.css";
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
    <div className="rx">
      {/* Sidebar */}
      <SidePanel navItems={navItems} activeNavKey={activeNavKey} />

      {/* Main Content */}
      <div className="rx__content">
        {/* Top bar */}
        <header className="rx__topbar">
          <div className="rx__greeting">
            <div className="rx__greetingText">Good Afternoon, Anna!</div>
            
          </div>
          <div className="rx__topRight">{topRight}</div>
        </header>

        {/* Page content */}
        <section className="rx__page">{children}</section>
      </div>
    </div>
  );
}
