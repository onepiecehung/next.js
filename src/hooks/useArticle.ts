import { useState, useEffect, useCallback } from 'react';
import { ArticleAPI } from '@/lib/api/article';
import type { Article } from '@/lib/types/article';

interface UseArticleOptions {
  onSuccess?: (article: Article) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for fetching a single article by ID
 */
export function useArticle(articleId: string, options?: UseArticleOptions) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArticle = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedArticle = await ArticleAPI.getArticle(articleId);
      setArticle(fetchedArticle);
      options?.onSuccess?.(fetchedArticle);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch article');
      setError(error);
      options?.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [articleId, options]);

  useEffect(() => {
    if (!articleId) {
      setIsLoading(false);
      return;
    }

    fetchArticle();
  }, [articleId, options, fetchArticle]);

  const refetch = () => {
    if (articleId) {
      fetchArticle();
    }
  };

  return {
    article,
    isLoading,
    error,
    refetch,
  };
}
