export type Plot = {
  id: string;
  name: string;
  cropKey: string;
  acres: number;
  stage: number; // 0-100
  createdAt: string;
  updatedAt: string;
};

export type Reminder = {
  id: string;
  label: string;
  category: "water" | "fertilizer" | "pesticide" | "harvest" | "other";
  time: string;
  date: string;
  done: boolean;
  createdAt: string;
};

export type ExpenseCategory = "seeds" | "fertilizer" | "labor" | "equipment" | "other";

export type Expense = {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
};

export type DashboardStats = {
  totalLand: number;
  activeCrops: number;
  expectedYield: number;
  totalIncome: number;
  totalExpense: number;
};
