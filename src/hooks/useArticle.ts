import { useState, useEffect, useCallback, useRef } from 'react';
import { ArticleAPI } from '@/lib/api/article';
import type { Article } from '@/lib/types/article';

interface UseArticleOptions {
  onSuccess?: (article: Article) => void;
  onError?: (error: Error) => void;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Check if error should trigger retry
 * Uses enhanced ApiError from http.ts for better error detection
 */
function shouldRetry(error: Error): boolean {
  // Check if error carries retryable metadata
  const maybe = error as unknown as { isRetryable?: boolean; status?: number; message?: string };
  if (typeof maybe.isRetryable === 'boolean') {
    if (!maybe.isRetryable) {
      console.warn(`Non-retryable error (${maybe.status}):`, maybe.message ?? error.message);
      return false;
    }
    return true;
  }
  
  // For non-HTTP errors, retry by default
  return true;
}

/**
 * Calculate retry delay with exponential backoff
 */
function calculateRetryDelay(attempt: number, baseDelay: number): number {
  // Exponential backoff: baseDelay * 2^attempt
  return Math.min(baseDelay * Math.pow(2, attempt - 1), 30000); // Max 30 seconds
}

/**
 * Hook for fetching a single article by ID with smart retry mechanism
 */
export function useArticle(articleId: string, options?: UseArticleOptions) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const maxRetries = options?.maxRetries ?? 3;
  const baseRetryDelay = options?.retryDelay ?? 1000; // 1 second base delay
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const onSuccessRef = useRef<UseArticleOptions["onSuccess"]>(options?.onSuccess);
  const onErrorRef = useRef<UseArticleOptions["onError"]>(options?.onError);

  // Keep latest callbacks without retriggering effects
  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
  }, [options?.onSuccess]);
  useEffect(() => {
    onErrorRef.current = options?.onError;
  }, [options?.onError]);

  const fetchArticle = useCallback(async (isRetry = false) => {
    // Validate articleId to prevent unnecessary API calls
    if (!articleId || articleId === 'undefined' || articleId === 'null') {
      const error = new Error('Invalid article ID');
      setError(error);
      setIsLoading(false);
      onErrorRef.current?.(error);
      return;
    }

    try {
      if (!isRetry) {
        setIsLoading(true);
        setError(null);
        retryCountRef.current = 0;
        setRetryCount(0);
      }
      
      const fetchedArticle = await ArticleAPI.getArticle(articleId);
      setArticle(fetchedArticle);
      retryCountRef.current = 0;
      setRetryCount(0);
      setIsLoading(false);
      onSuccessRef.current?.(fetchedArticle);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch article');
      
      // Check if this error should be retried
      if (!shouldRetry(error)) {
        console.error('Non-retryable error encountered:', error.message);
        setError(error);
        setIsLoading(false);
        onErrorRef.current?.(error);
        return;
      }
      
      // Check if we should retry using ref to avoid dependency issues
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        setRetryCount(retryCountRef.current);
        
        // Calculate delay with exponential backoff
        const delay = calculateRetryDelay(retryCountRef.current, baseRetryDelay);
        
        console.warn(`Article fetch failed (attempt ${retryCountRef.current}/${maxRetries}), retrying in ${delay}ms...`);
        
        // Schedule retry with exponential backoff
        retryTimeoutRef.current = setTimeout(() => {
          fetchArticle(true);
        }, delay);
      } else {
        // Max retries reached, show error
        console.error(`Article fetch failed after ${maxRetries} attempts:`, error);
        setError(error);
        setIsLoading(false);
        onErrorRef.current?.(error);
      }
    }
  }, [articleId, maxRetries, baseRetryDelay]);

  useEffect(() => {
    if (!articleId) {
      setIsLoading(false);
      return;
    }

    fetchArticle();
  }, [articleId, fetchArticle]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const refetch = useCallback(() => {
    if (articleId) {
      retryCountRef.current = 0; // Reset retry count for manual refetch
      setRetryCount(0);
      fetchArticle();
    }
  }, [articleId, fetchArticle]);

  return {
    article,
    isLoading,
    error,
    retryCount,
    maxRetries,
    refetch,
  };
}