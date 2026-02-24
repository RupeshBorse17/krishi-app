import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "@/services/dataService";
import type { Expense } from "@/types";

const QUERY_KEY = ["expenses"] as const;

export function useExpenses() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => expenseService.getAll(),
    staleTime: 1000 * 60,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    refetchOnMount: "always",
  });
}

export function useExpenseMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (expense: Omit<Expense, "id" | "createdAt">) => expenseService.create(expense),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Expense> }) => expenseService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { createMutation, updateMutation, deleteMutation };
}
