"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { useFinanceStore } from "@/store/useFinanceStore";
import {
  getInsights, getMonthlyData, getCategoryBreakdown,
  formatCurrency, formatCurrencyShort, computeSummary, cn,
} from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/data";
import { Header } from "@/components/layout/Header";
import {
  TrendingDown, TrendingUp, Zap, Target, PiggyBank, AlertCircle,
} from "lucide-react";

function InsightCard({ icon: Icon, title, value, subtitle, color }: {
  icon: React.ElementType; title: string; value: string; subtitle: string; color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 card-hover animate-in">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground mt-0.5 truncate">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-medium">{formatCurrencyShort(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function InsightsPage() {
  const { transactions } = useFinanceStore();

  const monthly = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(transactions), [transactions]);
  const { income, expenses, balance } = useMemo(() => computeSummary(transactions), [transactions]);
  const insights = useMemo(() => getInsights(transactions), [transactions]);

  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const avgMonthlyExpense = monthly.length > 0 ? expenses / monthly.length : 0;

  // Month-over-month comparison
  const lastTwo = monthly.slice(-2);
  const momChange = lastTwo.length === 2
    ? ((lastTwo[1].expenses - lastTwo[0].expenses) / lastTwo[0].expenses) * 100
    : 0;

  // Spending velocity: radar data
  const radarData = categoryBreakdown.slice(0, 7).map(c => ({
    category: c.name.length > 10 ? c.name.slice(0, 10) + "…" : c.name,
    amount: c.value,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Insights" subtitle="Spending patterns & financial health" />
      <div className="flex-1 p-6 space-y-6">

        {/* Insight cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <InsightCard
            icon={TrendingDown}
            title="Highest Spending Category"
            value={insights.highest?.name || "N/A"}
            subtitle={insights.highest ? `${formatCurrency(insights.highest.value)} total spent` : "No data"}
            color="#f43f5e"
          />
          <InsightCard
            icon={PiggyBank}
            title="Savings Rate"
            value={`${savingsRate.toFixed(1)}%`}
            subtitle={savingsRate >= 20 ? "Great! Above 20% target" : "Aim for 20%+ savings"}
            color={savingsRate >= 20 ? "#10b981" : "#f59e0b"}
          />
          <InsightCard
            icon={insights.monthlyChange > 0 ? TrendingUp : TrendingDown}
            title="Month-over-Month Spending"
            value={`${momChange > 0 ? "+" : ""}${momChange.toFixed(1)}%`}
            subtitle={momChange > 0 ? "Expenses increased vs last month" : "Expenses decreased vs last month"}
            color={momChange > 0 ? "#f43f5e" : "#10b981"}
          />
          <InsightCard
            icon={Target}
            title="Avg Monthly Expenses"
            value={formatCurrencyShort(avgMonthlyExpense)}
            subtitle={`Over ${monthly.length} months tracked`}
            color="#8b5cf6"
          />
          <InsightCard
            icon={Zap}
            title="Total Transactions"
            value={`${transactions.length}`}
            subtitle={`${transactions.filter(t => t.type === "income").length} income · ${transactions.filter(t => t.type === "expense").length} expenses`}
            color="#06b6d4"
          />
          <InsightCard
            icon={AlertCircle}
            title="Net Balance"
            value={formatCurrencyShort(balance)}
            subtitle={balance >= 0 ? "You're saving money 🎉" : "Spending exceeds income"}
            color={balance >= 0 ? "#10b981" : "#f43f5e"}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Monthly bar chart */}
          <div className="bg-card border border-border rounded-xl p-5 animate-in">
            <h3 className="font-semibold text-foreground mb-1">Monthly Comparison</h3>
            <p className="text-xs text-muted-foreground mb-5">Side-by-side income vs expenses by month</p>
            {monthly.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthly} barSize={14} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={52} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="income" />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="expenses" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Category bar chart */}
          <div className="bg-card border border-border rounded-xl p-5 animate-in">
            <h3 className="font-semibold text-foreground mb-1">Top Spending Categories</h3>
            <p className="text-xs text-muted-foreground mb-5">Where your money goes</p>
            {categoryBreakdown.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">No expense data</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryBreakdown.slice(0, 8)} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tickFormatter={formatCurrencyShort} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={90} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} name="spent">
                    {categoryBreakdown.slice(0, 8).map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Spending table */}
        <div className="bg-card border border-border rounded-xl p-5 animate-in">
          <h3 className="font-semibold text-foreground mb-1">Category Summary</h3>
          <p className="text-xs text-muted-foreground mb-4">Breakdown of all spending categories</p>
          {categoryBreakdown.length === 0 ? (
            <p className="text-muted-foreground text-sm">No expense data available.</p>
          ) : (
            <div className="space-y-2.5">
              {categoryBreakdown.map((cat, i) => {
                const pct = (cat.value / insights.totalExpenses) * 100;
                return (
                  <div key={cat.name} className="animate-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[cat.name] || "#6b7280" }} />
                        <span className="text-sm font-medium text-foreground">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">{pct.toFixed(1)}%</span>
                        <span className="text-sm font-semibold text-foreground w-24 text-right">{formatCurrency(cat.value)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat.name] || "#6b7280", animationDelay: `${i * 50}ms` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
