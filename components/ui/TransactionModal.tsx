"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Transaction, TransactionCategory, TransactionType } from "@/types";
import { useFinanceStore } from "@/store/useFinanceStore";
import { cn } from "@/lib/utils";

const CATEGORIES: TransactionCategory[] = [
  "Salary", "Freelance", "Investment",
  "Food & Dining", "Transport", "Shopping", "Entertainment",
  "Healthcare", "Housing", "Utilities", "Education", "Travel", "Other",
];

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  editingTransaction?: Transaction;
}

export function TransactionModal({ open, onClose, editingTransaction }: TransactionModalProps) {
  const { addTransaction, editTransaction } = useFinanceStore();
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    category: "Food & Dining" as TransactionCategory,
    type: "expense" as TransactionType,
    description: "",
    merchant: "",
  });

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        date: editingTransaction.date,
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        type: editingTransaction.type,
        description: editingTransaction.description,
        merchant: editingTransaction.merchant,
      });
    } else {
      setForm({ date: new Date().toISOString().split("T")[0], amount: "", category: "Food & Dining", type: "expense", description: "", merchant: "" });
    }
  }, [editingTransaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.merchant) return;
    const data = {
      date: form.date,
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      description: form.description,
      merchant: form.merchant,
    };
    if (editingTransaction) {
      editTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl animate-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type */}
          <div className="flex gap-2">
            {(["expense", "income"] as TransactionType[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-all border",
                  form.type === t
                    ? t === "income"
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-rose-500 text-white border-rose-500"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Amount (₹)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="0"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          {/* Description & Merchant */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
              <input
                type="text"
                required
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Grocery run"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Merchant</label>
              <input
                type="text"
                required
                value={form.merchant}
                onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))}
                placeholder="e.g. BigBasket"
                className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as TransactionCategory }))}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {editingTransaction ? "Save Changes" : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}
