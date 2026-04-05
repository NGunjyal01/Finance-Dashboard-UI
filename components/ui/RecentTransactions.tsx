"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/data";
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 7);

  return (
    <div className="bg-card rounded-xl border border-border animate-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{transactions.length} total transactions</p>
        </div>
        <Link
          href="/transactions"
          className="text-xs text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      {recent.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          No transactions found
        </div>
      ) : (
        <div className="divide-y divide-border">
          {recent.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors animate-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${CATEGORY_COLORS[t.category]}22` }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: CATEGORY_COLORS[t.category] }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                <p className="text-xs text-muted-foreground">{t.merchant} · {format(parseISO(t.date), "dd MMM")}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={cn(
                  "text-sm font-semibold",
                  t.type === "income" ? "text-emerald-500" : "text-rose-500"
                )}>
                  {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{t.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
