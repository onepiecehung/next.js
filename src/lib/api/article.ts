import { http } from '../http';
import type { CreateArticleDto, Article } from '../types/article';

/**
 * Article API wrapper
 * Handles all article-related API calls
 */
export class ArticleAPI {
  private static readonly BASE_URL = '/articles';

  /**
   * Create a new article
   */
  static async createArticle(data: CreateArticleDto): Promise<Article> {
    const response = await http.post<Article>(this.BASE_URL, data);
    return response.data;
  }

  /**
   * Get article by ID
   */
  static async getArticle(id: string): Promise<Article> {
    const response = await http.get<Article>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Update article by ID
   */
  static async updateArticle(id: string, data: Partial<CreateArticleDto>): Promise<Article> {
    const response = await http.patch<Article>(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  /**
   * Delete article by ID
   */
  static async deleteArticle(id: string): Promise<void> {
    await http.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Get articles list
   */
  static async getArticles(params?: {
    page?: number;
    limit?: number;
    status?: string;
    visibility?: string;
    userId?: string;
  }): Promise<{ articles: Article[]; total: number; page: number; limit: number }> {
    const response = await http.get<{ articles: Article[]; total: number; page: number; limit: number }>(
      this.BASE_URL,
      { params }
    );
    return response.data;
  }
}
