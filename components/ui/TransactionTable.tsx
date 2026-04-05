"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Transaction } from "@/types";
import { useFinanceStore } from "@/store/useFinanceStore";
import { formatCurrency, cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/data";
import { TransactionModal } from "./TransactionModal";

interface TransactionTableProps {
  transactions: Transaction[];
}

function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Delete Transaction?</p>
            <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const { role, deleteTransaction } = useFinanceStore();
  const isAdmin = role === "admin";
  const [editingTx, setEditingTx] = useState<Transaction | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl py-16 text-center animate-in">
        <p className="text-muted-foreground text-sm">No transactions match your filters.</p>
        <p className="text-muted-foreground text-xs mt-1">Try adjusting or resetting your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden animate-in">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                {isAdmin && <th className="px-5 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((t, i) => (
                <tr
                  key={t.id}
                  className="hover:bg-muted/30 transition-colors animate-in"
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap font-mono text-xs">
                    {format(parseISO(t.date), "dd MMM yyyy")}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{t.merchant}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: `${CATEGORY_COLORS[t.category] || "#6b7280"}20`,
                        color: CATEGORY_COLORS[t.category] || "#6b7280",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_COLORS[t.category] || "#6b7280" }} />
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                      t.type === "income" ? "income-bg income-text" : "expense-bg expense-text"
                    )}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  <td className={cn(
                    "px-5 py-3.5 text-right font-semibold font-mono",
                    t.type === "income" ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setEditingTx(t)}
                          className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(t.id)}
                          className="w-7 h-7 rounded-md hover:bg-rose-500/10 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${CATEGORY_COLORS[t.category]}22` }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[t.category] }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                <p className="text-xs text-muted-foreground">{t.category} · {format(parseISO(t.date), "dd MMM")}</p>
              </div>
              <div className="text-right">
                <p className={cn("text-sm font-semibold", t.type === "income" ? "text-emerald-500" : "text-rose-500")}>
                  {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                </p>
                {isAdmin && (
                  <div className="flex gap-1 justify-end mt-1">
                    <button onClick={() => setEditingTx(t)} className="text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => setDeletingId(t.id)} className="text-muted-foreground hover:text-rose-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingTx && (
        <TransactionModal
          open={!!editingTx}
          onClose={() => setEditingTx(undefined)}
          editingTransaction={editingTx}
        />
      )}

      {deletingId && (
        <DeleteConfirm
          onConfirm={() => { deleteTransaction(deletingId); setDeletingId(null); }}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </>
  );
}
