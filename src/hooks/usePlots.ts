import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { plotService } from "@/services/dataService";
import type { Plot } from "@/types";

const QUERY_KEY = ["plots"] as const;

export function usePlots() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => plotService.getAll(),
    staleTime: 1000 * 60,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    refetchOnMount: "always",
  });
}

export function usePlotMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (plot: Omit<Plot, "id" | "createdAt" | "updatedAt">) => plotService.create(plot),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Plot> }) => plotService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => plotService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { createMutation, updateMutation, deleteMutation };
}
