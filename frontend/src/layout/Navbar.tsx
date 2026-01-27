import { Link, useLocation } from "react-router-dom";
import React from "react";

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
    <nav className="rx__nav">
      {navItems.map((item) => (
        <Link
          key={item.to}
          className={`rx__navItem ${
            location.pathname === item.to ? "rx__navItem--active" : ""
          }`}
          to={item.to}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
