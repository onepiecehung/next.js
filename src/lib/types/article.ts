import type { Article } from "@/lib/interface";
import type { ArticleContentFormat } from "@/lib/constants/article.constants";

/**
 * Article Type Definitions
 * Contains article-related request and response types
 */

/**
 * Create article request payload
 * Extends Article interface but makes certain fields optional for creation
 */
export interface CreateArticleDto extends Partial<Article> {
  title: string;
  content: string;
  contentFormat: ArticleContentFormat;
  visibility: "public" | "unlisted" | "private";
  status: "draft" | "published" | "scheduled";
  userId?: string;
  scheduledAt?: Date; // ISO string for scheduled articles
}

/**
 * Update article request payload
 * All fields optional for partial updates
 */
export type UpdateArticleRequest = Partial<Article>;
