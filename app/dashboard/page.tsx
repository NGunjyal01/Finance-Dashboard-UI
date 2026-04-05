"use client";

import { useMemo } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { applyFilters, computeSummary, getMonthlyData, getCategoryBreakdown } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { SummaryCards } from "@/components/ui/SummaryCards";
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart";
import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";
import { RecentTransactions } from "@/components/ui/RecentTransactions";
import { format, subMonths, parseISO, isAfter } from "date-fns";

export default function DashboardPage() {
  const { transactions } = useFinanceStore();

  const sorted = useMemo(() =>
    [...transactions].sort((a, b) => b.date.localeCompare(a.date)),
    [transactions]
  );

  const summary = useMemo(() => computeSummary(sorted), [sorted]);
  const monthlyData = useMemo(() => getMonthlyData(sorted), [sorted]);
  const categoryData = useMemo(() => getCategoryBreakdown(sorted), [sorted]);

  // Previous month comparison
  const prevMonthStart = subMonths(new Date(), 2);
  const thisMonthStart = subMonths(new Date(), 1);
  const prevMonthTxs = sorted.filter(t => {
    const d = parseISO(t.date);
    return isAfter(d, prevMonthStart) && !isAfter(d, thisMonthStart);
  });
  const thisMonthTxs = sorted.filter(t => isAfter(parseISO(t.date), thisMonthStart));
  const prevSummary = computeSummary(prevMonthTxs);
  const thisSummary = computeSummary(thisMonthTxs);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Overview"
        subtitle={format(new Date(), "EEEE, d MMMM yyyy")}
      />
      <div className="flex-1 p-6 space-y-6">
        <SummaryCards
          income={summary.income}
          expenses={summary.expenses}
          balance={summary.balance}
          prevIncome={prevSummary.income}
          prevExpenses={prevSummary.expenses}
        />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <MonthlyTrendChart data={monthlyData} />
          </div>
          <div>
            <CategoryBreakdownChart data={categoryData} />
          </div>
        </div>
        <RecentTransactions transactions={sorted} />
      </div>
    </div>
  );
}
