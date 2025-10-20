/**
 * Query Key Factory for TanStack Query
 * Centralizes all query keys to prevent typos and ensure consistency
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

export const queryKeys = {
  // Auth related queries
  auth: {
    currentUser: () => ["currentUser"] as const,
    userProfile: (userId: string) => ["user", userId] as const,
  },

  // Article related queries
  articles: {
    all: () => ["articles"] as const,
    lists: () => ["articles", "list"] as const,
    list: (params?: Record<string, unknown>) =>
      ["articles", "list", params] as const,
    details: () => ["articles", "detail"] as const,
    detail: (id: string) => ["articles", "detail", id] as const,
    byUser: (userId: string) => ["articles", "user", userId] as const,
    byTag: (tag: string) => ["articles", "tag", tag] as const,
    byCategory: (category: string) =>
      ["articles", "category", category] as const,
  },

  // Settings related queries
  settings: {
    all: () => ["settings"] as const,
    byUser: (userId: string) => ["settings", userId] as const,
  },

  // Reactions related queries
  reactions: {
    all: () => ["reactions"] as const,
    byArticle: (articleId: string) =>
      ["reactions", "article", articleId] as const,
    byUser: (userId: string) => ["reactions", "user", userId] as const,
  },

  // Media related queries
  media: {
    all: () => ["media"] as const,
    byUser: (userId: string) => ["media", "user", userId] as const,
    uploads: () => ["media", "uploads"] as const,
  },

  // Users related queries
  users: {
    all: () => ["users"] as const,
    profile: (userId: string) => ["users", "profile", userId] as const,
    search: (query: string) => ["users", "search", query] as const,
  },
} as const;

/**
 * Type-safe query key extractor
 * Helps with TypeScript inference for query keys
 */
export type QueryKeys = typeof queryKeys;
