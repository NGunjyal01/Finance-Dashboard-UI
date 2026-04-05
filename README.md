# FinFlow — Finance Dashboard

A clean, modern personal finance dashboard built with **Next.js 14**, **Tailwind CSS**, **shadcn/ui primitives**, and **Zustand** for state management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+ and npm 9+

### Installation

```bash
# 1. Clone / unzip the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

The app redirects `/` → `/dashboard` automatically.

---

## 🏗️ Project Structure

```
finance-dashboard/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── globals.css         # CSS variables, animations, utilities
│   ├── dashboard/          # Overview page
│   ├── transactions/       # Transactions list page
│   └── insights/           # Analytics & insights page
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx    # Sidebar + main content wrapper
│   │   ├── Sidebar.tsx     # Navigation + role switcher
│   │   ├── Header.tsx      # Top bar with export + theme toggle
│   │   └── ThemeProvider.tsx
│   ├── charts/
│   │   ├── MonthlyTrendChart.tsx  # Area chart (income vs expenses)
│   │   └── CategoryBreakdownChart.tsx  # Donut chart
│   └── ui/
│       ├── SummaryCards.tsx       # KPI stat cards
│       ├── RecentTransactions.tsx # Dashboard transaction list
│       ├── TransactionTable.tsx   # Full sortable table
│       ├── FiltersBar.tsx         # Search + filter controls
│       └── TransactionModal.tsx   # Add/edit transaction form
├── lib/
│   ├── data.ts             # 59 mock transactions + category colors
│   └── utils.ts            # Formatting, filtering, analytics helpers
├── store/
│   └── useFinanceStore.ts  # Zustand store (persisted to localStorage)
└── types/
    └── index.ts            # TypeScript interfaces
```

---

## ✨ Features

### Dashboard Overview
- **4 KPI Cards**: Total Balance, Income, Expenses, Savings Rate (with % change vs previous period)
- **Area Chart**: Monthly income vs expenses trend (Recharts)
- **Donut Chart**: Top spending categories with % breakdown
- **Recent Transactions**: Latest 7 transactions with quick-glance formatting

### Transactions Page
- **Full table** with date, description, merchant, category, type, amount
- **Search**: Filter by description, merchant, or category name
- **Category filter**: Pills for all 13 categories
- **Type filter**: All / Income / Expense toggle
- **Date range**: 7D / 30D / 90D / 1Y / All
- **Sort**: Date ↑↓, Amount ↑↓, Category A–Z
- **Summary bar**: Filtered totals update in real time
- **Mobile responsive**: Collapses to card layout on small screens

### Insights Page
- 6 insight cards: highest spending category, savings rate, MoM change, avg monthly expense, transaction count, net balance
- **Monthly comparison bar chart**: Grouped income vs expenses by month
- **Horizontal bar chart**: Top 8 spending categories
- **Progress bars**: Visual category breakdown with percentages

### Role-Based UI
- **Admin**: Can add, edit, and delete transactions via modal
- **Viewer**: Read-only; add/edit/delete controls are hidden
- **Role switcher**: Available in the sidebar (persists to localStorage)

### Dark / Light Mode
- Toggle in the header — defaults to dark mode
- Powered by `next-themes`, fully CSS-variable based

### Data Persistence
- Transactions and role are saved to **localStorage** via Zustand `persist` middleware
- Changes survive page refresh

### CSV Export
- One-click export from the header — exports all current transactions

---

## 🎨 Design Decisions

**Typography**: Outfit (display/body) + JetBrains Mono (numbers/code) — avoids the generic Inter default

**Color System**: Emerald green as primary accent (income), rose red for expenses, with a muted dark-first palette using CSS variables throughout

**Aesthetic**: Refined minimal dark dashboard — generous spacing, subtle borders, no heavy shadows, smooth entrance animations (staggered `animation-delay`)

**Layout**: Fixed sidebar with collapsible state, sticky header, fluid content area adapts from mobile → desktop

---

## 🔧 Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework, routing, layouts |
| TypeScript | Type safety throughout |
| Tailwind CSS | Utility-first styling |
| Zustand + persist | Global state + localStorage sync |
| Recharts | Charts (area, bar, pie/donut) |
| next-themes | Dark/light mode |
| date-fns | Date formatting and arithmetic |
| lucide-react | Icon library |

---

## 📱 Responsive Breakpoints

- **Mobile (<768px)**: Transaction table collapses to card view; sidebar collapses to icon-only
- **Tablet (768–1280px)**: Single-column charts; 2-col KPI cards
- **Desktop (>1280px)**: Full sidebar, 2-col chart layout, 4-col KPI row

---

## 🔄 State Management (Zustand)

```typescript
// store/useFinanceStore.ts
{
  transactions: Transaction[],  // source of truth
  role: "admin" | "viewer",     // RBAC
  filters: FilterState,          // all filter controls
  sidebarOpen: boolean,          // UI state
  // actions: setRole, addTransaction, editTransaction,
  //          deleteTransaction, setSearch, setCategory,
  //          setType, setDateRange, setSortBy, setSortOrder,
  //          resetFilters, toggleSidebar
}
```

Persisted keys: `transactions`, `role` (via `partialize`).
Filter and UI state is session-only (intentional — filters reset on refresh for better UX).

---

## 🧩 Assumptions Made

1. Currency is INR (Indian Rupees) — easily changed in `lib/utils.ts`
2. Mock data covers Jan–Jun 2024 (59 transactions) — realistic mix of income/expense
3. RBAC is frontend-only simulation — no auth or API involved
4. "Previous period" comparison is against the prior calendar month

---

## 🚧 Possible Enhancements

- [ ] Pagination or infinite scroll for transactions
- [ ] Budget goals / limits per category
- [ ] Recurring transaction detection
- [ ] PDF export with charts
- [ ] Multi-currency support
- [ ] Notification system for overspending
