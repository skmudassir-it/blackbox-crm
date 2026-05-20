"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faUsers,
  faEnvelope,
  faCalendarAlt,
  faCheckSquare,
  faBook,
  faBars,
  faXmark,
  faBox,
  faCog,
  faColumns,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: faThLarge },
  { label: "Clients", href: "/dashboard/clients", icon: faUsers },
  { label: "Messages", href: "/dashboard/messages", icon: faEnvelope },
  { label: "Calendar", href: "/dashboard/calendar", icon: faCalendarAlt },
  { label: "To-Do", href: "/dashboard/todos", icon: faCheckSquare },
  { label: "Kanban", href: "/dashboard/kanban", icon: faColumns },
  { label: "Dictionary", href: "/dashboard/dictionary", icon: faBook },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border/50 shadow-sm"
      >
        <FontAwesomeIcon
          icon={collapsed ? faBars : faXmark}
          className="h-5 w-5 text-foreground"
        />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-card border-r border-border/50 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-border/50 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <FontAwesomeIcon icon={faBox} className="text-primary text-lg" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-primary">
            Blackbox<span className="text-secondary">CRM</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(true)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border/50 space-y-2">
          <Link
            href="/dashboard/settings"
            onClick={() => setCollapsed(true)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/dashboard/settings"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <FontAwesomeIcon icon={faCog} className="h-4 w-4 shrink-0" />
            Settings
          </Link>
          <p className="text-xs text-muted-foreground px-3">
            Blackbox CRM v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
