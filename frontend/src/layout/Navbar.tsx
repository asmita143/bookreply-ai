import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", to: "/" },
    { label: "Reservations", to: "/reservations" },
    { label: "Emails", to: "/email-dashboard" },
    { label: "Analytics", to: "/analytics" },
    { label: "Settings", to: "/settings" },
  ];

  return (
    <nav className="flex flex-col gap-1.5 lg:flex-row lg:flex-wrap">
      {navItems.map((item) => (
        <Link
          key={item.to}
          className={cn(
            "text-[#d5dfef] no-underline py-2.5 px-2.5 rounded-[10px] font-semibold text-[13px]",
            location.pathname === item.to ? "bg-white/10" : "hover:bg-white/6"
          )}
          to={item.to}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
