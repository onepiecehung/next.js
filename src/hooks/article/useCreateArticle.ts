import { useState } from "react";

import { ArticleAPI } from "@/lib/api/article";
import { ARTICLE_CONSTANTS } from "@/lib/constants/article";

import type { Article, CreateArticleDto } from "@/lib/types/article";
interface UseCreateArticleOptions {
  onSuccess?: (article: Article) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for creating articles with simplified API
 * Uses a single saveArticle function that accepts status directly from constants
 */
export function useCreateArticle(options?: UseCreateArticleOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Save an article with specified status
   * @param data - Article data including status constant
   * - DRAFT: automatically sets visibility to PRIVATE
   * - SCHEDULED: requires scheduledAt
   * - PUBLISHED: default published article
   */
  const saveArticle = async (data: CreateArticleDto) => {
    setIsLoading(true);
    setError(null);

    // Auto-set visibility to PRIVATE for drafts
    const finalData = {
      ...data,
      visibility:
        data.status === ARTICLE_CONSTANTS.STATUS.DRAFT
          ? ARTICLE_CONSTANTS.VISIBILITY.PRIVATE
          : data.visibility,
    };

    try {
      const article = await ArticleAPI.createArticle(finalData);
      options?.onSuccess?.(article);
      return article;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create article";
      setError(errorMessage);
      options?.onError?.(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveArticle,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
