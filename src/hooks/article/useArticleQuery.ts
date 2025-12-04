import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { ArticleAPI } from "@/lib/api/article";
import { ARTICLE_CONSTANTS } from "@/lib/constants";
import type {
  Article,
  CreateArticleDto,
  UpdateArticleRequest,
} from "@/lib/interface/article.interface";
import type { AdvancedQueryParams } from "@/lib/types";
import { formatArticle } from "@/lib/utils/article-utils";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for fetching a single article by ID
 * Replaces the complex manual implementation with React Query
 */
export function useArticle(articleId: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(articleId),
    queryFn: () => ArticleAPI.getArticle(articleId),
    enabled: !!articleId && articleId !== "undefined" && articleId !== "null",
    // staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching articles list with pagination
 */
export function useArticles(params?: AdvancedQueryParams) {
  return useQuery({
    queryKey: queryKeys.articles.list(params),
    queryFn: () => ArticleAPI.getArticlesOffset(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });
}

/**
 * Hook for fetching my articles list with pagination and layout support
 * Supports multiple layout types: grid, list, card
 */
export function useMyArticles(userId: string, params?: AdvancedQueryParams) {
  return useQuery({
    queryKey: queryKeys.articles.myList(userId, params),
    queryFn: () => ArticleAPI.myArticlesOffset(params),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });
}

/**
 * Hook for managing user articles with different layout types
 * Simplified version using reusable utilities
 */
export function useUserArticlesLayout(
  userId: string,
  layout: "grid" | "list" | "card" = "grid",
  params?: AdvancedQueryParams,
) {
  const { data, isLoading, error, refetch } = useMyArticles(userId, params);

  // Format articles using reusable utility
  const formattedArticles =
    data?.data?.result?.map((article: Article) => formatArticle(article)) || [];

  // Layout configuration based on layout type
  const layoutConfig = {
    grid: {
      containerClass:
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
      itemClass: "",
    },
    list: {
      containerClass: "space-y-4 sm:space-y-6",
      itemClass: "",
    },
    card: {
      containerClass: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6",
      itemClass: "",
    },
  };

  return {
    articles: formattedArticles,
    isLoading,
    error,
    refetch,
    layoutConfig: layoutConfig[layout] || layoutConfig.grid,
    totalCount: data?.data?.metaData?.totalRecords || 0,
    hasMore: data?.data?.metaData?.hasNextPage || false,
    currentPage: data?.data?.metaData?.currentPage || 1,
    totalPages: data?.data?.metaData?.totalPages || 1,
    pageSize: data?.data?.metaData?.pageSize || 10,
    hasNextPage: data?.data?.metaData?.hasNextPage || false,
    hasPreviousPage: (data?.data?.metaData?.currentPage || 1) > 1,
  };
}

/**
 * Hook for creating articles
 * Replaces the manual useCreateArticle implementation
 * Handles toast notifications internally for better separation of concerns
 */
export function useCreateArticle() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateArticleDto) => {
      // Auto-set visibility to PRIVATE for drafts only
      const finalData = {
        ...data,
        visibility:
          data.status === ARTICLE_CONSTANTS.STATUS.DRAFT
            ? ARTICLE_CONSTANTS.VISIBILITY.PRIVATE
            : data.visibility,
        // Ensure scheduledAt is properly set for scheduled articles
        scheduledAt:
          data.status === ARTICLE_CONSTANTS.STATUS.SCHEDULED
            ? data.scheduledAt
            : undefined,
      };

      // Create promise for toast.promise with additional delay
      const promise = async () => {
        const result = await ArticleAPI.createArticle(finalData);
        // Add 1-2 seconds delay after promise completes
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return result;
      };

      // Show promise toast
      toast.promise(promise(), {
        loading: t("schedule.creating", "article") || "Creating article...",
        success: (article) => {
          // Invalidate and refetch articles list
          queryClient.invalidateQueries({ queryKey: queryKeys.articles.all() });

          // Add the new article to cache
          queryClient.setQueryData(
            queryKeys.articles.detail(article.id),
            article,
          );

          // Handle different success scenarios with appropriate messages
          switch (article.status) {
            case ARTICLE_CONSTANTS.STATUS.DRAFT:
              return (
                t("status.draft", "article") +
                " " +
                t("schedule.success", "article")
              );
            case ARTICLE_CONSTANTS.STATUS.SCHEDULED:
              return (
                t("schedule.success", "article") +
                " - " +
                t("schedule.scheduledFor", "article", {
                  date: article.scheduledAt?.toLocaleString(),
                })
              );
            default:
              return (
                t("status.published", "article") +
                " " +
                t("schedule.success", "article")
              );
          }
        },
        error: (error) => {
          console.error("Article creation error:", error);
          return error instanceof Error
            ? error.message
            : t("schedule.error", "article") || "Failed to create article";
        },
      });

      return promise();
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
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleRequest }) => {
      // Create promise for toast.promise with additional delay
      const promise = async () => {
        const result = await ArticleAPI.updateArticle(id, data);
        // Add 1-2 seconds delay after promise completes
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return result;
      };

      // Show promise toast
      toast.promise(promise(), {
        loading: t("schedule.updating", "article") || "Updating article...",
        success: (article) => {
          // Update the article in cache
          queryClient.setQueryData(
            queryKeys.articles.detail(article.id),
            article,
          );

          // Invalidate articles list to refetch
          queryClient.invalidateQueries({ queryKey: queryKeys.articles.all() });

          return (
            t("status.published", "article") +
            " " +
            t("schedule.success", "article")
          );
        },
        error: (error) => {
          console.error("Article update error:", error);
          return t("schedule.error", "article") || "Failed to update article";
        },
      });

      return promise();
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
    mutationFn: (id: string) => {
      // Create promise for toast.promise with additional delay
      const promise = async () => {
        const result = await ArticleAPI.deleteArticle(id);
        // Add 1-2 seconds delay after promise completes
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return result;
      };

      // Show promise toast
      toast.promise(promise(), {
        loading: t("schedule.deleting", "article") || "Deleting article...",
        success: () => {
          // Remove article from cache
          queryClient.removeQueries({
            queryKey: queryKeys.articles.detail(id),
          });

          // Invalidate articles list
          queryClient.invalidateQueries({ queryKey: queryKeys.articles.all() });

          return (
            t("status.archived", "article") +
            " " +
            t("schedule.success", "article")
          );
        },
        error: (error) => {
          console.error("Article deletion error:", error);
          return t("schedule.error", "article") || "Failed to delete article";
        },
      });

      return promise();
    },
  });
}

/**
 * Hook for publishing an article
 */
export function usePublishArticle() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const promise = async () => {
        const result = await ArticleAPI.updateArticle(id, {
          status: ARTICLE_CONSTANTS.STATUS.PUBLISHED,
        });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return result;
      };

      toast.promise(promise(), {
        loading: t("schedule.publishing", "article") || "Publishing article...",
        success: (article) => {
          queryClient.setQueryData(
            queryKeys.articles.detail(article.id),
            article,
          );
          queryClient.invalidateQueries({
            queryKey: queryKeys.articles.all(),
          });
          return (
            t("status.published", "article") +
            " " +
            t("schedule.success", "article")
          );
        },
        error: (error) => {
          console.error("Publish article error:", error);
          return t("schedule.error", "article") || "Failed to publish article";
        },
      });

      return promise();
    },
  });
}

/**
 * Hook for unpublishing an article
 */
export function useUnpublishArticle() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const promise = async () => {
        const result = await ArticleAPI.updateArticle(id, {
          status: ARTICLE_CONSTANTS.STATUS.DRAFT,
        });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return result;
      };

      toast.promise(promise(), {
        loading:
          t("schedule.unpublishing", "article") || "Unpublishing article...",
        success: (article) => {
          queryClient.setQueryData(
            queryKeys.articles.detail(article.id),
            article,
          );
          queryClient.invalidateQueries({
            queryKey: queryKeys.articles.all(),
          });
          return (
            t("status.draft", "article") +
            " " +
            t("schedule.success", "article")
          );
        },
        error: (error) => {
          console.error("Unpublish article error:", error);
          return (
            t("schedule.error", "article") || "Failed to unpublish article"
          );
        },
      });

      return promise();
    },
  });
}

/**
 * Hook for managing article form state
 * Simplified version using reusable form hooks
 */
export function useArticleFormState() {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<string>(
    ARTICLE_CONSTANTS.VISIBILITY.PUBLIC,
  );
  const [scheduledPublish, setScheduledPublish] = useState<Date | null>(null);

  // Calculate word count and read time
  const wordCount = content
    ? content.split(/\s+/).filter((word) => word.length > 0).length
    : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const validateForm = () => {
    if (!title.trim()) return false;
    if (!content.trim() || content.trim() === "<p></p>") return false;
    return true;
  };

  const resetForm = () => {
    setCoverImage(null);
    setTitle("");
    setContent("");
    setTags([]);
    setVisibility(ARTICLE_CONSTANTS.VISIBILITY.PUBLIC);
    setScheduledPublish(null);
  };

  return {
    coverImage,
    setCoverImage,
    title,
    setTitle,
    content,
    setContent,
    tags,
    setTags,
    visibility,
    setVisibility,
    scheduledPublish,
    setScheduledPublish,
    validateForm,
    resetForm,
    wordCount,
    readTimeMinutes,
  };
}
