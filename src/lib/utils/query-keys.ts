/**
 * Query Key Factory for TanStack Query
 * Centralizes all query keys to prevent typos and ensure consistency
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

import { AdvancedQueryParams } from "../types";

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
    list: (params?: AdvancedQueryParams) =>
      ["articles", "list", params] as const,
    details: () => ["articles", "detail"] as const,
    detail: (id: string) => ["articles", "detail", id] as const,
    byUser: (userId: string) => ["articles", "user", userId] as const,
    byTag: (tag: string) => ["articles", "tag", tag] as const,
    byCategory: (category: string) =>
      ["articles", "category", category] as const,
    myList: (userId: string, params?: AdvancedQueryParams) =>
      ["articles", "my", "list", userId, params] as const,
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

  // Series related queries
  series: {
    all: () => ["series"] as const,
    lists: () => ["series", "list"] as const,
    list: (params?: AdvancedQueryParams) => ["series", "list", params] as const,
    details: () => ["series", "detail"] as const,
    detail: (id: string) => ["series", "detail", id] as const,
    popular: () => ["series", "popular"] as const,
    latestUpdates: () => ["series", "latest-updates"] as const,
    recommended: () => ["series", "recommended"] as const,
    selfPublished: () => ["series", "self-published"] as const,
    featured: () => ["series", "featured"] as const,
    seasonal: (season?: string, year?: number) =>
      ["series", "seasonal", season, year] as const,
    recentlyAdded: () => ["series", "recently-added"] as const,
    byType: (type: string) => ["series", "type", type] as const,
    byGenre: (genre: string) => ["series", "genre", genre] as const,
  },
} as const;

/**
 * Type-safe query key extractor
 * Helps with TypeScript inference for query keys
 */
export type QueryKeys = typeof queryKeys;
