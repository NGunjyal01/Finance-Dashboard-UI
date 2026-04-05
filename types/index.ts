export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Healthcare"
  | "Housing"
  | "Utilities"
  | "Education"
  | "Travel"
  | "Other";

export interface Transaction {
  id: string;
  date: string; // ISO string
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
  merchant: string;
}

export type Role = "admin" | "viewer";

export interface FilterState {
  search: string;
  category: TransactionCategory | "All";
  type: TransactionType | "All";
  dateRange: "7d" | "30d" | "90d" | "1y" | "all";
  sortBy: "date" | "amount" | "category";
  sortOrder: "asc" | "desc";
}
