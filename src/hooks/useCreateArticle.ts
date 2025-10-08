import { useState } from "react";

import { ArticleAPI } from "@/lib/api/article";
import { ARTICLE_CONSTANTS } from "@/lib/types/article";

import type { Article, CreateArticleDto } from "@/lib/types/article";
interface UseCreateArticleOptions {
  onSuccess?: (article: Article) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for creating articles
 */
export function useCreateArticle(options?: UseCreateArticleOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArticle = async (data: CreateArticleDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const article = await ArticleAPI.createArticle(data);
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

  const createDraft = async (data: Omit<CreateArticleDto, "status">) => {
    return createArticle({
      ...data,
      status: ARTICLE_CONSTANTS.STATUS.DRAFT,
      visibility: ARTICLE_CONSTANTS.VISIBILITY.PRIVATE,
      scheduledAt: undefined,
    });
  };

  const publishArticle = async (
    data: Omit<CreateArticleDto, "status" | "scheduledAt">,
  ) => {
    return createArticle({
      ...data,
      status: ARTICLE_CONSTANTS.STATUS.PUBLISHED,
      scheduledAt: undefined,
    });
  };

  return {
    createArticle,
    createDraft,
    publishArticle,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
