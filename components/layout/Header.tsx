"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Download } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { role, transactions } = useFinanceStore();

  const handleExport = () => {
    const headers = ["Date", "Description", "Merchant", "Category", "Type", "Amount"];
    const rows = transactions.map(t => [
      t.date, t.description, t.merchant, t.category, t.type, t.amount,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finflow-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 rounded-lg border border-border hover:bg-accent flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <div className={cn(
          "px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
          role === "admin" ? "bg-emerald-500/15 text-emerald-500" : "bg-blue-500/15 text-blue-500"
        )}>
          {role}
        </div>
      </div>
    </header>
  );
}
