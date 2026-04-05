"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, Role, FilterState, TransactionCategory } from "@/types";
import { ALL_TRANSACTIONS } from "@/lib/utils";

interface FinanceStore {
  // State
  transactions: Transaction[];
  role: Role;
  filters: FilterState;
  sidebarOpen: boolean;

  // Role actions
  setRole: (role: Role) => void;

  // Transaction actions
  addTransaction: (t: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Filter actions
  setSearch: (search: string) => void;
  setCategory: (cat: FilterState["category"]) => void;
  setType: (type: FilterState["type"]) => void;
  setDateRange: (range: FilterState["dateRange"]) => void;
  setSortBy: (sortBy: FilterState["sortBy"]) => void;
  setSortOrder: (order: FilterState["sortOrder"]) => void;
  resetFilters: () => void;

  // UI actions
  toggleSidebar: () => void;
}

const defaultFilters: FilterState = {
  search: "",
  category: "All",
  type: "All",
  dateRange: "all",
  sortBy: "date",
  sortOrder: "desc",
};

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: ALL_TRANSACTIONS,
      role: "viewer",
      filters: defaultFilters,
      sidebarOpen: true,

      setRole: (role) => set({ role }),

      addTransaction: (t) =>
        set((state) => ({
          transactions: [
            { ...t, id: Math.random().toString(36).substring(2, 9) },
            ...state.transactions,
          ],
        })),

      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setSearch: (search) =>
        set((state) => ({ filters: { ...state.filters, search } })),

      setCategory: (category) =>
        set((state) => ({ filters: { ...state.filters, category } })),

      setType: (type) =>
        set((state) => ({ filters: { ...state.filters, type } })),

      setDateRange: (dateRange) =>
        set((state) => ({ filters: { ...state.filters, dateRange } })),

      setSortBy: (sortBy) =>
        set((state) => ({ filters: { ...state.filters, sortBy } })),

      setSortOrder: (sortOrder) =>
        set((state) => ({ filters: { ...state.filters, sortOrder } })),

      resetFilters: () => set({ filters: defaultFilters }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "finance-dashboard-storage",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
      }),
    }
  )
);
