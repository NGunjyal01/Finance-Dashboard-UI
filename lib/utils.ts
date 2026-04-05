import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Transaction, FilterState } from "@/types";
import { MOCK_TRANSACTIONS } from "./data";
import { subDays, subYears, parseISO, isAfter, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export function getDateThreshold(range: FilterState["dateRange"]): Date | null {
  const now = new Date();
  switch (range) {
    case "7d": return subDays(now, 7);
    case "30d": return subDays(now, 30);
    case "90d": return subDays(now, 90);
    case "1y": return subYears(now, 1);
    default: return null;
  }
}

export function applyFilters(transactions: Transaction[], filters: FilterState): Transaction[] {
  let filtered = [...transactions];
  const threshold = getDateThreshold(filters.dateRange);
  if (threshold) filtered = filtered.filter(t => isAfter(parseISO(t.date), threshold));
  if (filters.category !== "All") filtered = filtered.filter(t => t.category === filters.category);
  if (filters.type !== "All") filtered = filtered.filter(t => t.type === filters.type);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.merchant.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }
  filtered.sort((a, b) => {
    let cmp = 0;
    if (filters.sortBy === "date") cmp = a.date.localeCompare(b.date);
    else if (filters.sortBy === "amount") cmp = a.amount - b.amount;
    else if (filters.sortBy === "category") cmp = a.category.localeCompare(b.category);
    return filters.sortOrder === "asc" ? cmp : -cmp;
  });
  return filtered;
}

export function computeSummary(transactions: Transaction[]) {
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function getMonthlyData(transactions: Transaction[]) {
  const months: Record<string, { income: number; expenses: number; month: string }> = {};
  transactions.forEach(t => {
    const key = format(parseISO(t.date), "MMM yy");
    if (!months[key]) months[key] = { income: 0, expenses: 0, month: key };
    if (t.type === "income") months[key].income += t.amount;
    else months[key].expenses += t.amount;
  });
  return Object.values(months);
}

export function getCategoryBreakdown(transactions: Transaction[]) {
  const cats: Record<string, number> = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    cats[t.category] = (cats[t.category] || 0) + t.amount;
  });
  return Object.entries(cats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getInsights(transactions: Transaction[]) {
  const byCategory = getCategoryBreakdown(transactions);
  const highest = byCategory[0];
  const totalExpenses = byCategory.reduce((s, c) => s + c.value, 0);
  const monthly = getMonthlyData(transactions);
  const lastTwo = monthly.slice(-2);
  const monthlyChange = lastTwo.length === 2
    ? ((lastTwo[1].expenses - lastTwo[0].expenses) / lastTwo[0].expenses) * 100
    : 0;
  const savingsRate = transactions.length
    ? (computeSummary(transactions).balance / computeSummary(transactions).income) * 100
    : 0;
  return { highest, totalExpenses, monthlyChange, savingsRate, byCategory };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const ALL_TRANSACTIONS = MOCK_TRANSACTIONS;
