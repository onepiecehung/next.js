import { useState } from "react";
import { ArticleAPI } from "@/lib/api/article";
import type {
  CreateArticleDto,
  ArticleStatus,
  Article,
} from "@/lib/types/article";

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
      status: "draft" as ArticleStatus,
    });
  };

  const publishArticle = async (
    data: Omit<CreateArticleDto, "status" | "publishedAt">,
  ) => {
    return createArticle({
      ...data,
      status: "published" as ArticleStatus,
      publishedAt: new Date(),
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
