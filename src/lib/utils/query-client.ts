import { QueryClient } from "@tanstack/react-query";

/**
 * Default query client configuration
 * Centralizes all TanStack Query settings for consistency
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: 5 minutes
        staleTime: 5 * 60 * 1000,
        // Cache time: 10 minutes
        gcTime: 10 * 60 * 1000,
        // Retry failed requests 3 times
        retry: 3,
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Disable refetch on window focus to prevent double queries
        refetchOnWindowFocus: false,
        // Refetch on reconnect
        refetchOnReconnect: true,
        // Refetch on mount if data is fresh
        refetchOnMount: "always",
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        // Retry delay for mutations
        retryDelay: 1000,
      },
    },
  });

/**
 * Query client instance
 * Use this singleton instance throughout the app
 */
export const queryClient = createQueryClient();
