import { http } from "@/lib/http";
import {
  Article,
  CreateArticleDto,
  UpdateArticleRequest,
} from "@/lib/interface";
import type {
  AdvancedQueryParams,
  ApiResponse,
  ApiResponseCursor,
  ApiResponseOffset,
  QueryParamsWithCursor,
} from "@/lib/types";

/**
 * Article API wrapper
 * Handles all article-related API calls
 */
export class ArticleAPI {
  private static readonly BASE_URL = "/articles";

  /**
   * Create a new article
   */
  static async createArticle(data: CreateArticleDto): Promise<Article> {
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
    data: UpdateArticleRequest,
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
  static async getArticlesOffset(
    params?: AdvancedQueryParams,
  ): Promise<ApiResponseOffset<Article>> {
    const response = await http.get<ApiResponseOffset<Article>>(
      `${this.BASE_URL}`,
      { params },
    );
    return response.data;
  }

  /**
   * Get articles list with offset pagination
   */
  static async myArticlesOffset(
    params?: AdvancedQueryParams,
  ): Promise<ApiResponseOffset<Article>> {
    const response = await http.get<ApiResponseOffset<Article>>(
      `${this.BASE_URL}/my`,
      { params },
    );
    return response.data;
  }

  /**
   * Get articles list with cursor pagination
   */
  static async getArticlesCursor(
    params?: QueryParamsWithCursor,
  ): Promise<ApiResponseCursor<Article>> {
    const response = await http.get<ApiResponseCursor<Article>>(
      `${this.BASE_URL}/cursor`,
      { params },
    );
    return response.data;
  }
}
