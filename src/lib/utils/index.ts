import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export error utilities
export {
  extractAndTranslateErrorMessage,
  extractErrorMessage
} from "./error-extractor";

// Re-export query utilities
export { createQueryClient, queryClient } from "./query-client";
export { queryKeys } from "./query-keys";
export {
  createInfiniteQueryConfig, createMutationErrorHandler,
  createMutationSuccessHandler,
  createOptimisticUpdate, queryInvalidation
} from "./query-utils";

