import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ReactionsApi } from "@/lib/api/reactions";
import { useI18n } from "@/components/providers/i18n-provider";

/**
 * Hook for managing article reactions (likes)
 * Provides like/unlike functionality with optimistic updates
 */
export function useArticleLike(articleId: string) {
  const { t } = useI18n();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch current like count for the article
   */
  const fetchLikeCount = useCallback(async () => {
    try {
      const response = await ReactionsApi.getArticleReactionCounts(articleId);
      if (response.success) {
        const likeReaction = response.data.find((r) => r.kind === "like");
        setLikeCount(likeReaction?.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch like count:", error);
    }
  }, [articleId]);

  /**
   * Toggle like status for the article
   */
  const toggleLike = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const previousLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));

    try {
      const response = await ReactionsApi.likeArticle(articleId, "toggle");

      if (response.success) {
        // Update counts after successful like/unlike
        await fetchLikeCount();
      } else {
        // Revert optimistic update on failure
        setIsLiked(previousLiked);
        setLikeCount(previousCount);
        toast.error(response.message || t("reactionLikeError", "article"));
      }
    } catch (error: unknown) {
      // Revert optimistic update on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      console.error("Like error:", error);
      toast.error(t("reactionLikeError", "article"));
    } finally {
      setIsLoading(false);
    }
  }, [articleId, isLiked, likeCount, isLoading, t, fetchLikeCount]);

  /**
   * Check if user has liked the article
   */
  const checkLikeStatus = useCallback(async () => {
    try {
      const response = await ReactionsApi.hasLikedArticle(articleId);
      if (response.success) {
        setIsLiked(response.data);
      }
    } catch (error) {
      console.error("Failed to check like status:", error);
    }
  }, [articleId]);

  return {
    isLiked,
    likeCount,
    isLoading,
    toggleLike,
    fetchLikeCount,
    checkLikeStatus,
  };
}
