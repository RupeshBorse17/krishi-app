import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reminderService } from "@/services/dataService";
import type { Reminder } from "@/types";

const QUERY_KEY = ["reminders"] as const;

export function useReminders() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => reminderService.getAll(),
    staleTime: 1000 * 60,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    refetchOnMount: "always",
  });
}

export function useReminderMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (reminder: Omit<Reminder, "id" | "createdAt">) => reminderService.create(reminder),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Reminder> }) => reminderService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reminderService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const toggleDoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const r = await reminderService.toggleDone(id);
      if (!r) throw new Error("Reminder not found");
      return r;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { createMutation, updateMutation, deleteMutation, toggleDoneMutation };
}
