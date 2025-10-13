import { http } from "../http";
import type {
  ApiResponse,
  ApiResponseCursor,
  ApiResponseOffset,
} from "../types";
import { Article } from "@/lib/entities";

/**
 * Article API wrapper
 * Handles all article-related API calls
 */
export class ArticleAPI {
  private static readonly BASE_URL = "/articles";

  /**
   * Create a new article
   */
  static async createArticle(data: Article): Promise<Article> {
    const response = await http.post<ApiResponse<Article>>(this.BASE_URL, data);
    return response.data.data;
  }

  /**
   * Get article by ID
   */
  static async getArticle(id: string): Promise<Article> {
    const response = await http.get<ApiResponse<Article>>(
      `${this.BASE_URL}/${id}`,
    );
    return response.data.data;
  }

  /**
   * Update article by ID
   */
  static async updateArticle(
    id: string,
    data: Partial<Article>,
  ): Promise<Article> {
    const response = await http.patch<ApiResponse<Article>>(
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
  }): Promise<ApiResponseOffset<Article>> {
    const response = await http.get<ApiResponseOffset<Article>>(
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
  }): Promise<ApiResponseCursor<Article>> {
    const response = await http.get<ApiResponseCursor<Article>>(
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
    articles: Article[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await http.get<{
      articles: Article[];
      total: number;
      page: number;
      limit: number;
    }>(this.BASE_URL, { params });
    return response.data;
  }
}
