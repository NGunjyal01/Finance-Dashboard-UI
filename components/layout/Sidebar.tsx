"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb, TrendingUp,
  ChevronLeft, ChevronRight, Settings, Shield, Eye,
} from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/insights", label: "Insights", icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, role, setRole } = useFinanceStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-40 flex flex-col",
        "bg-card border-r border-border transition-all duration-300",
        sidebarOpen ? "w-[260px]" : "w-[68px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 h-16 border-b border-border", !sidebarOpen && "justify-center px-0")}>
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-bold text-lg tracking-tight text-foreground">
            Fin<span className="text-emerald-500">Flow</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                active
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                !sidebarOpen && "justify-center px-0"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-emerald-500" : "text-muted-foreground group-hover:text-foreground")} />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Role switcher */}
      {sidebarOpen && (
        <div className="px-3 pb-4">
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Role</p>
            <div className="flex gap-2">
              <button
                onClick={() => setRole("admin")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                  role === "admin"
                    ? "bg-emerald-500 text-white"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border"
                )}
              >
                <Shield className="w-3 h-3" /> Admin
              </button>
              <button
                onClick={() => setRole("viewer")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                  role === "viewer"
                    ? "bg-blue-500 text-white"
                    : "bg-background text-muted-foreground hover:text-foreground border border-border"
                )}
              >
                <Eye className="w-3 h-3" /> Viewer
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {role === "admin" ? "Can add, edit & delete transactions" : "Read-only access"}
            </p>
          </div>
        </div>
      )}

      {!sidebarOpen && (
        <div className="px-2 pb-4">
          <button
            onClick={() => setRole(role === "admin" ? "viewer" : "admin")}
            className="w-full flex justify-center p-2 rounded-lg hover:bg-accent transition-colors"
            title={`Switch to ${role === "admin" ? "viewer" : "admin"}`}
          >
            {role === "admin" ? <Shield className="w-5 h-5 text-emerald-500" /> : <Eye className="w-5 h-5 text-blue-500" />}
          </button>
        </div>
      )}

      {/* Collapse button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors shadow-sm"
      >
        {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
