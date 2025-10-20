import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";

/**
 * Common query utilities and helpers
 * Provides reusable patterns for TanStack Query operations
 */

/**
 * Standard error handler for mutations
 * Provides consistent error handling across all mutations
 */
export const createMutationErrorHandler = (t: ReturnType<typeof useI18n>["t"]) => {
  return (error: unknown, context?: { namespace?: string }) => {
    console.error("Mutation error:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : t("error.generic", context?.namespace || "common") || "An error occurred";
    
    toast.error(errorMessage);
  };
};

/**
 * Standard success handler for mutations
 * Provides consistent success handling across all mutations
 */
export const createMutationSuccessHandler = (t: ReturnType<typeof useI18n>["t"]) => {
  return (messageKey: string, context?: { namespace?: string }) => {
    const successMessage = t(messageKey, context?.namespace || "common") || "Operation successful";
    toast.success(successMessage);
  };
};

/**
 * Optimistic update helper
 * Provides a consistent pattern for optimistic updates
 */
export const createOptimisticUpdate = <T>(
  queryClient: QueryClient,
  queryKey: unknown[],
  updater: (oldData: T | undefined) => T
) => {
  return {
    onMutate: async (variables: unknown) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<T>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, updater);

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err: unknown, variables: unknown, context: { previousData?: T }) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
  };
};

/**
 * Infinite query configuration helper
 * Provides consistent configuration for infinite queries
 */
export const createInfiniteQueryConfig = <T>(
  queryFn: (pageParam: unknown) => Promise<T>,
  options?: {
    staleTime?: number;
    gcTime?: number;
    retry?: number;
  }
) => ({
  queryFn: ({ pageParam }: { pageParam: unknown }) => queryFn(pageParam),
  getNextPageParam: (lastPage: T, allPages: T[]) => {
    // Customize this based on your API response structure
    return allPages.length + 1;
  },
  staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
  gcTime: options?.gcTime ?? 10 * 60 * 1000, // 10 minutes
  retry: options?.retry ?? 3,
});

/**
 * Query invalidation helper
 * Provides common invalidation patterns
 */
export const queryInvalidation = {
  // Invalidate all queries for a specific entity
  invalidateEntity: (queryClient: QueryClient, entity: string, id?: string) => {
    const queryKey = id ? [entity, id] : [entity];
    queryClient.invalidateQueries({ queryKey });
  },

  // Invalidate all queries for a user
  invalidateUserQueries: (queryClient: QueryClient, userId: string) => {
    queryClient.invalidateQueries({ queryKey: ["user", userId] });
    queryClient.invalidateQueries({ queryKey: ["articles", "user", userId] });
    queryClient.invalidateQueries({ queryKey: ["settings", userId] });
  },

  // Invalidate all article-related queries
  invalidateArticleQueries: (queryClient: QueryClient, articleId?: string) => {
    if (articleId) {
      queryClient.invalidateQueries({ queryKey: ["articles", "detail", articleId] });
    }
    queryClient.invalidateQueries({ queryKey: ["articles", "list"] });
  },
};
