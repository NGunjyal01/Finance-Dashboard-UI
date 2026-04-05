"use client";

import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency, formatCurrencyShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
  prevIncome?: number;
  prevExpenses?: number;
}

function StatCard({
  label, value, icon: Icon, color, change, changeLabel,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: "emerald" | "rose" | "blue";
  change?: number;
  changeLabel?: string;
}) {
  const colorMap = {
    emerald: {
      icon: "bg-emerald-500/10 text-emerald-500",
      text: "text-emerald-500",
      ring: "ring-emerald-500/20",
    },
    rose: {
      icon: "bg-rose-500/10 text-rose-500",
      text: "text-rose-500",
      ring: "ring-rose-500/20",
    },
    blue: {
      icon: "bg-blue-500/10 text-blue-500",
      text: "text-blue-500",
      ring: "ring-blue-500/20",
    },
  };
  const c = colorMap[color];
  const positive = change !== undefined ? change >= 0 : undefined;

  return (
    <div className={cn("bg-card rounded-xl border border-border p-5 card-hover animate-in")}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", c.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
          )}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground tracking-tight">
        {formatCurrencyShort(value)}
      </p>
      {changeLabel && <p className="text-xs text-muted-foreground mt-1">{changeLabel}</p>}
    </div>
  );
}

export function SummaryCards({ income, expenses, balance, prevIncome, prevExpenses }: SummaryCardsProps) {
  const incomeChange = prevIncome ? ((income - prevIncome) / prevIncome) * 100 : undefined;
  const expenseChange = prevExpenses ? ((expenses - prevExpenses) / prevExpenses) * 100 : undefined;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label="Total Balance"
        value={balance}
        icon={Wallet}
        color="blue"
        changeLabel={`${savingsRate.toFixed(0)}% savings rate`}
      />
      <StatCard
        label="Total Income"
        value={income}
        icon={TrendingUp}
        color="emerald"
        change={incomeChange}
        changeLabel="vs previous period"
      />
      <StatCard
        label="Total Expenses"
        value={expenses}
        icon={TrendingDown}
        color="rose"
        change={expenseChange}
        changeLabel="vs previous period"
      />
      <div className="bg-card rounded-xl border border-border p-5 card-hover animate-in">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <span className="text-violet-500 text-lg font-bold">%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Savings Rate</p>
        <p className="text-2xl font-bold text-foreground tracking-tight">{savingsRate.toFixed(1)}%</p>
        <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(savingsRate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
