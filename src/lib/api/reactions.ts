import { http } from "@/lib/http";

/**
 * Reaction types and interfaces
 */
export type ReactionAction = "toggle" | "set" | "unset";

export interface ReactionDto {
  subjectType: string;
  subjectId: string;
  kind: string;
  action?: ReactionAction;
  value?: boolean;
}

export interface ReactionResponse {
  success: boolean;
  data?: {
    id: string;
    userId: string;
    subjectType: string;
    subjectId: string;
    kind: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

export interface ReactionCount {
  kind: string;
  count: number;
}

export interface ReactionCountsResponse {
  success: boolean;
  data: ReactionCount[];
}

export interface HasReactedResponse {
  success: boolean;
  data: boolean;
}

export interface BatchCountsDto {
  requests: Array<{
    subjectType: string;
    subjectId: string;
    kinds?: string[];
  }>;
}

/**
 * Reactions API wrapper
 * Handles all reaction-related API calls including likes, bookmarks, etc.
 */
export class ReactionsApi {
  /**
   * Create or set a reaction (like, bookmark, etc.)
   * @param reactionData - Reaction data including subject info and kind
   * @returns Promise<ReactionResponse>
   */
  static async createOrSetReaction(
    reactionData: ReactionDto,
  ): Promise<ReactionResponse> {
    return http.post<ReactionResponse>("/reactions", reactionData);
  }

  /**
   * Remove a reaction
   * @param reactionData - Reaction data to remove
   * @returns Promise<ReactionResponse>
   */
  static async removeReaction(
    reactionData: ReactionDto,
  ): Promise<ReactionResponse> {
    return http.delete<ReactionResponse>("/reactions", { data: reactionData });
  }

  /**
   * Check if user has reacted to a subject
   * @param subjectType - Type of subject (e.g., 'article')
   * @param subjectId - ID of the subject
   * @param kind - Kind of reaction (e.g., 'like')
   * @returns Promise<HasReactedResponse>
   */
  static async hasReacted(
    subjectType: string,
    subjectId: string,
    kind: string,
  ): Promise<HasReactedResponse> {
    return http.get<HasReactedResponse>("/reactions/has", {
      params: { subjectType, subjectId, kind },
    });
  }

  /**
   * Get reaction counts for a subject
   * @param subjectType - Type of subject (e.g., 'article')
   * @param subjectId - ID of the subject
   * @param kinds - Optional array of reaction kinds to filter
   * @returns Promise<ReactionCountsResponse>
   */
  static async getCounts(
    subjectType: string,
    subjectId: string,
    kinds?: string[],
  ): Promise<ReactionCountsResponse> {
    const params: any = { subjectType, subjectId };
    if (kinds && kinds.length > 0) {
      params.kinds = kinds.join(",");
    }

    return http.get<ReactionCountsResponse>("/reactions/counts", { params });
  }

  /**
   * Get reaction counts for multiple subjects in batch
   * @param batchData - Array of requests for batch counting
   * @returns Promise<ReactionCountsResponse>
   */
  static async getCountsBatch(
    batchData: BatchCountsDto,
  ): Promise<ReactionCountsResponse> {
    return http.post<ReactionCountsResponse>("/reactions/counts", batchData);
  }

  /**
   * Like an article (convenience method)
   * @param articleId - ID of the article to like
   * @param action - Action to perform (default: 'toggle')
   * @returns Promise<ReactionResponse>
   */
  static async likeArticle(
    articleId: string,
    action: ReactionAction = "toggle",
  ): Promise<ReactionResponse> {
    return this.createOrSetReaction({
      subjectType: "article",
      subjectId: articleId,
      kind: "like",
      action,
    });
  }

  /**
   * Bookmark an article (convenience method)
   * @param articleId - ID of the article to bookmark
   * @param action - Action to perform (default: 'toggle')
   * @returns Promise<ReactionResponse>
   */
  static async bookmarkArticle(
    articleId: string,
    action: ReactionAction = "toggle",
  ): Promise<ReactionResponse> {
    return this.createOrSetReaction({
      subjectType: "article",
      subjectId: articleId,
      kind: "bookmark",
      action,
    });
  }

  /**
   * Check if user has liked an article
   * @param articleId - ID of the article
   * @returns Promise<HasReactedResponse>
   */
  static async hasLikedArticle(articleId: string): Promise<HasReactedResponse> {
    return this.hasReacted("article", articleId, "like");
  }

  /**
   * Check if user has bookmarked an article
   * @param articleId - ID of the article
   * @returns Promise<HasReactedResponse>
   */
  static async hasBookmarkedArticle(
    articleId: string,
  ): Promise<HasReactedResponse> {
    return this.hasReacted("article", articleId, "bookmark");
  }

  /**
   * Get like and bookmark counts for an article
   * @param articleId - ID of the article
   * @returns Promise<ReactionCountsResponse>
   */
  static async getArticleReactionCounts(
    articleId: string,
  ): Promise<ReactionCountsResponse> {
    return this.getCounts("article", articleId, ["like", "bookmark"]);
  }
}
