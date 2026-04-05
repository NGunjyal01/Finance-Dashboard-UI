"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { applyFilters, computeSummary, formatCurrency } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { FiltersBar } from "@/components/ui/FiltersBar";
import { TransactionTable } from "@/components/ui/TransactionTable";
import { TransactionModal } from "@/components/ui/TransactionModal";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
  const { transactions, filters, role } = useFinanceStore();
  const [modalOpen, setModalOpen] = useState(false);
  const isAdmin = role === "admin";

  const filtered = useMemo(() => applyFilters(transactions, filters), [transactions, filters]);
  const summary = useMemo(() => computeSummary(filtered), [filtered]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Transactions" subtitle={`${filtered.length} transactions`} />
      <div className="flex-1 p-6 space-y-4">

        {/* Quick stats bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Filtered Income", value: summary.income, color: "text-emerald-500" },
            { label: "Filtered Expenses", value: summary.expenses, color: "text-rose-500" },
            { label: "Net", value: summary.balance, color: summary.balance >= 0 ? "text-emerald-500" : "text-rose-500" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3 animate-in">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className={cn("text-lg font-bold", s.color)}>{formatCurrency(s.value)}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <FiltersBar />

        {/* Add button (admin only) */}
        {isAdmin && (
          <div className="flex justify-end">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Transaction
            </button>
          </div>
        )}

        {/* Table */}
        <TransactionTable transactions={filtered} />
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
