"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { TransactionCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: (TransactionCategory | "All")[] = [
  "All", "Salary", "Freelance", "Investment",
  "Food & Dining", "Transport", "Shopping", "Entertainment",
  "Healthcare", "Housing", "Utilities", "Education", "Travel", "Other",
];

const DATE_RANGES = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
  { value: "all", label: "All" },
] as const;

export function FiltersBar() {
  const {
    filters,
    setSearch, setCategory, setType, setDateRange,
    setSortBy, setSortOrder, resetFilters,
  } = useFinanceStore();

  const hasActiveFilters =
    filters.search ||
    filters.category !== "All" ||
    filters.type !== "All" ||
    filters.dateRange !== "all";

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-in">
      {/* Search + Reset */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={filters.search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-muted border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={e => {
            const [by, order] = e.target.value.split("-");
            setSortBy(by as any);
            setSortOrder(order as any);
          }}
          className="bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="date-desc">Date ↓</option>
          <option value="date-asc">Date ↑</option>
          <option value="amount-desc">Amount ↓</option>
          <option value="amount-asc">Amount ↑</option>
          <option value="category-asc">Category A–Z</option>
        </select>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
          >
            <X className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Type + Date Range */}
      <div className="flex flex-wrap gap-2">
        {/* Type */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["All", "income", "expense"] as const).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                filters.type === t
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          {DATE_RANGES.map(r => (
            <button
              key={r.value}
              onClick={() => setDateRange(r.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                filters.dateRange === r.value
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-full border transition-colors",
              filters.category === cat
                ? "bg-emerald-500 text-white border-emerald-500"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
