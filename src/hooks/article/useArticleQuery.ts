import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  });
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

      // Handle different success scenarios with appropriate toast messages
      switch (article.status) {
        case ARTICLE_CONSTANTS.STATUS.DRAFT:
          toast.info(
            t("writeFormDraftSuccess", "write") || "Article saved as draft!",
            {
              description:
                t("writeFormDraftSuccessDescription", "write") ||
                "Your article has been saved and can be edited later.",
            },
          );
          break;
        case ARTICLE_CONSTANTS.STATUS.SCHEDULED:
          toast.success(
            t("writeFormScheduledPublishSuccess", "write") ||
              "Article scheduled for publication!",
            {
              description:
                t("writeFormScheduledPublishSuccessDescription", "write", {
                  date: article.scheduledAt?.toLocaleString(),
                }) || `Scheduled for ${article.scheduledAt?.toLocaleString()}`,
            },
          );
          break;
        default:
          toast.success(
            t("writeFormSuccess", "write") || "Article published successfully!",
            {
              description:
                t("writeFormSuccessDescription", "write") ||
                "Your article is now live and visible to readers.",
            },
          );
          break;
      }
    },
    onError: (error) => {
      console.error("Article creation error:", error);

      // Extract meaningful error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("writeFormError", "write") || "Failed to create article";

      toast.error(errorMessage, {
        description:
          t("writeFormErrorDescription", "write") ||
          "Please check your input and try again.",
      });
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
 * Hook for managing article form state
 * Provides form state management for creating/editing articles
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
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Calculate word count and read time
  const wordCount = content
    ? content.split(/\s+/).filter((word) => word.length > 0).length
    : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute

  const validateForm = () => {
    if (!title.trim()) {
      setShowValidationErrors(true);
      return false;
    }
    if (!content.trim()) {
      setShowValidationErrors(true);
      return false;
    }
    setShowValidationErrors(false);
    return true;
  };

  const resetForm = () => {
    setCoverImage(null);
    setTitle("");
    setContent("");
    setTags([]);
    setVisibility(ARTICLE_CONSTANTS.VISIBILITY.PUBLIC);
    setScheduledPublish(null);
    setShowValidationErrors(false);
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
    showValidationErrors,
    wordCount,
    readTimeMinutes,
  };
}
