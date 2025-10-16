import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { ArticleAPI } from "@/lib/api/article";
import { ARTICLE_CONSTANTS } from "@/lib/constants";
import type { CreateArticleRequest, UpdateArticleRequest } from "@/lib/types";

/**
 * Hook for fetching a single article by ID
 * Replaces the complex manual implementation with React Query
 */
export function useArticle(articleId: string) {
  const { t } = useI18n();

  return useQuery({
    queryKey: ["article", articleId],
    queryFn: () => ArticleAPI.getArticle(articleId),
    enabled: !!articleId && articleId !== "undefined" && articleId !== "null",
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching articles list with pagination
 */
export function useArticles(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: () => ArticleAPI.getArticlesOffset(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // Keep previous data while fetching new
  });
}

/**
 * Hook for creating articles
 * Replaces the manual useCreateArticle implementation
 */
export function useCreateArticle() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateArticleRequest) => {
      // Auto-set visibility to PRIVATE for drafts
      const finalData = {
        ...data,
        visibility:
          data.status === ARTICLE_CONSTANTS.STATUS.DRAFT
            ? ARTICLE_CONSTANTS.VISIBILITY.PRIVATE
            : data.visibility,
      };

      return ArticleAPI.createArticle(finalData);
    },
    onSuccess: (article) => {
      // Invalidate and refetch articles list
      queryClient.invalidateQueries({ queryKey: ["articles"] });

      // Add the new article to cache
      queryClient.setQueryData(["article", article.id], article);

      toast.success(
        t("articleCreateSuccess", "article") || "Article created successfully!",
      );
    },
    onError: (error) => {
      console.error("Article creation error:", error);
      toast.error(
        t("articleCreateError", "article") || "Failed to create article",
      );
    },
  });
}

/**
 * Hook for updating articles
 */
export function useUpdateArticle() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleRequest }) =>
      ArticleAPI.updateArticle(id, data),
    onSuccess: (article) => {
      // Update the article in cache
      queryClient.setQueryData(["article", article.id], article);

      // Invalidate articles list to refetch
      queryClient.invalidateQueries({ queryKey: ["articles"] });

      toast.success(
        t("articleUpdateSuccess", "article") || "Article updated successfully!",
      );
    },
    onError: (error) => {
      console.error("Article update error:", error);
      toast.error(
        t("articleUpdateError", "article") || "Failed to update article",
      );
    },
  });
}

/**
 * Hook for deleting articles
 */
export function useDeleteArticle() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ArticleAPI.deleteArticle(id),
    onSuccess: (_, articleId) => {
      // Remove article from cache
      queryClient.removeQueries({ queryKey: ["article", articleId] });

      // Invalidate articles list
      queryClient.invalidateQueries({ queryKey: ["articles"] });

      toast.success(
        t("articleDeleteSuccess", "article") || "Article deleted successfully!",
      );
    },
    onError: (error) => {
      console.error("Article deletion error:", error);
      toast.error(
        t("articleDeleteError", "article") || "Failed to delete article",
      );
    },
  });
}

/**
 * Hook for article form management
 * Combines create and update operations
 */
export function useArticleForm(articleId?: string) {
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const isCreating = createMutation.isPending;
  const isUpdating = updateMutation.isPending;
  const isLoading = isCreating || isUpdating;

  const saveArticle = async (
    data: CreateArticleRequest | UpdateArticleRequest,
  ) => {
    if (articleId) {
      // Update existing article
      return updateMutation.mutateAsync({
        id: articleId,
        data: data as UpdateArticleRequest,
      });
    } else {
      // Create new article
      return createMutation.mutateAsync(data as CreateArticleRequest);
    }
  };

  return {
    saveArticle,
    isLoading,
    isCreating,
    isUpdating,
    error: createMutation.error || updateMutation.error,
  };
}
