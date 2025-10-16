import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { ReactionsAPI } from "@/lib/api/reactions";

/**
 * Hook for fetching reactions for an article
 */
export function useReactions(articleId: string) {
  return useQuery({
    queryKey: ["reactions", articleId],
    queryFn: () => ReactionsAPI.getReactions(articleId),
    enabled: !!articleId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

/**
 * Hook for toggling a reaction (like/unlike)
 */
export function useToggleReaction() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, type }: { articleId: string; type: string }) =>
      ReactionsAPI.toggleReaction(articleId, type),
    onSuccess: (_, { articleId }) => {
      // Invalidate reactions for this article
      queryClient.invalidateQueries({ queryKey: ["reactions", articleId] });

      // Also invalidate article data to update reaction counts
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });

      toast.success(
        t("reactionToggleSuccess", "reactions") || "Reaction updated!",
      );
    },
    onError: (error) => {
      console.error("Reaction toggle error:", error);
      toast.error(
        t("reactionToggleError", "reactions") || "Failed to update reaction",
      );
    },
  });
}

/**
 * Hook for adding a reaction
 */
export function useAddReaction() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, type }: { articleId: string; type: string }) =>
      ReactionsAPI.addReaction(articleId, type),
    onSuccess: (_, { articleId }) => {
      queryClient.invalidateQueries({ queryKey: ["reactions", articleId] });
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });

      toast.success(t("reactionAddSuccess", "reactions") || "Reaction added!");
    },
    onError: (error) => {
      console.error("Add reaction error:", error);
      toast.error(
        t("reactionAddError", "reactions") || "Failed to add reaction",
      );
    },
  });
}

/**
 * Hook for removing a reaction
 */
export function useRemoveReaction() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, type }: { articleId: string; type: string }) =>
      ReactionsAPI.removeReaction(articleId, type),
    onSuccess: (_, { articleId }) => {
      queryClient.invalidateQueries({ queryKey: ["reactions", articleId] });
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });

      toast.success(
        t("reactionRemoveSuccess", "reactions") || "Reaction removed!",
      );
    },
    onError: (error) => {
      console.error("Remove reaction error:", error);
      toast.error(
        t("reactionRemoveError", "reactions") || "Failed to remove reaction",
      );
    },
  });
}

/**
 * Hook for reaction management
 */
export function useReactionManagement() {
  const toggleMutation = useToggleReaction();
  const addMutation = useAddReaction();
  const removeMutation = useRemoveReaction();

  return {
    toggleReaction: toggleMutation.mutateAsync,
    addReaction: addMutation.mutateAsync,
    removeReaction: removeMutation.mutateAsync,
    isToggling: toggleMutation.isPending,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isLoading:
      toggleMutation.isPending ||
      addMutation.isPending ||
      removeMutation.isPending,
  };
}
