import { usePlots } from "./usePlots";
import { useExpenses } from "./useExpenses";

export function useDashboardStats() {
  const { data: plots = [] } = usePlots();
  const { data: expenses = [] } = useExpenses();

  const totalLand = plots.reduce((sum, p) => sum + p.acres, 0);
  const activeCrops = plots.length;
  const expectedYield = plots.length > 0 ? Math.round(plots.reduce((s, p) => s + (p.acres * 8), 0)) : 0;

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = totalExpense * 1.8;

  return {
    totalLand,
    activeCrops,
    expectedYield,
    totalExpense,
    totalIncome,
    netProfit: totalIncome - totalExpense,
  };
}
