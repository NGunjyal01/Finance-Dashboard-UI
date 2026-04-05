"use client";

import { useMemo } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { computeSummary, getMonthlyData, getCategoryBreakdown } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { SummaryCards } from "@/components/ui/SummaryCards";
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart";
import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";
import { RecentTransactions } from "@/components/ui/RecentTransactions";
import { subMonths, parseISO, isAfter } from "date-fns";
import { computeSummary as cs } from "@/lib/utils";

export default function DashboardPage() {
  const { transactions } = useFinanceStore();

  const sorted = useMemo(() =>
    [...transactions].sort((a, b) => b.date.localeCompare(a.date)),
    [transactions]
  );

  const summary = useMemo(() => computeSummary(sorted), [sorted]);
  const monthlyData = useMemo(() => getMonthlyData(sorted), [sorted]);
  const categoryData = useMemo(() => getCategoryBreakdown(sorted), [sorted]);

  const prevMonthStart = subMonths(new Date(), 2);
  const thisMonthStart = subMonths(new Date(), 1);
  const prevSummary = useMemo(() => computeSummary(
    sorted.filter(t => {
      const d = parseISO(t.date);
      return isAfter(d, prevMonthStart) && !isAfter(d, thisMonthStart);
    })
  ), [sorted]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Overview" />
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