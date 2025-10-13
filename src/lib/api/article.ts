import { http } from "../http";
import type {
  ApiResponse,
  ApiResponseCursor,
  ApiResponseOffset,
  ArticleEntity,
  CreateArticleEntity,
} from "../types";

/**
 * Article API wrapper
 * Handles all article-related API calls
 */
export class ArticleAPI {
  private static readonly BASE_URL = "/articles";

  /**
   * Create a new article
   */
  static async createArticle(data: CreateArticleEntity): Promise<ArticleEntity> {
    const response = await http.post<ApiResponse<ArticleEntity>>(this.BASE_URL, data);
    return response.data.data;
  }

  /**
   * Get article by ID
   */
  static async getArticle(id: string): Promise<ArticleEntity> {
    const response = await http.get<ApiResponse<ArticleEntity>>(
      `${this.BASE_URL}/${id}`,
    );
    return response.data.data;
  }

  /**
   * Update article by ID
   */
  static async updateArticle(
    id: string,
    data: Partial<CreateArticleEntity>,
  ): Promise<ArticleEntity> {
    const response = await http.patch<ApiResponse<ArticleEntity>>(
      `${this.BASE_URL}/${id}`,
      data,
    );
    return response.data.data;
  }

  /**
   * Delete article by ID
   */
  static async deleteArticle(id: string): Promise<void> {
    await http.delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Get articles list with offset pagination
   */
  static async getArticlesOffset(params?: {
    page?: number;
    limit?: number;
    status?: string;
    visibility?: string;
    userId?: string;
  }): Promise<ApiResponseOffset<ArticleEntity>> {
    const response = await http.get<ApiResponseOffset<ArticleEntity>>(
      `${this.BASE_URL}/offset`,
      { params },
    );
    return response.data;
  }

  /**
   * Get articles list with cursor pagination
   */
  static async getArticlesCursor(params?: {
    cursor?: string | null;
    limit?: number;
    sortBy?: string;
    order?: "ASC" | "DESC";
    status?: string;
    visibility?: string;
    userId?: string;
  }): Promise<ApiResponseCursor<ArticleEntity>> {
    const response = await http.get<ApiResponseCursor<ArticleEntity>>(
      `${this.BASE_URL}/cursor`,
      { params },
    );
    return response.data;
  }

  /**
   * Legacy method - Get articles list (deprecated)
   * @deprecated Use getArticlesOffset or getArticlesCursor instead
   */
  static async getArticles(params?: {
    page?: number;
    limit?: number;
    status?: string;
    visibility?: string;
    userId?: string;
  }): Promise<{
    articles: ArticleEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await http.get<{
      articles: ArticleEntity[];
      total: number;
      page: number;
      limit: number;
    }>(this.BASE_URL, { params });
    return response.data;
  }
}
