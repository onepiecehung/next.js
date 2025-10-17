import type { Article } from "@/lib/interface";

/**
 * Article Type Definitions
 * Contains article-related request and response types
 */

/**
 * Create article request payload
 * Extends Article interface but makes certain fields optional for creation
 */
export interface CreateArticleRequest extends Partial<Article> {
  title: string;
  content: string;
  contentFormat: "html" | "markdown";
  visibility: "public" | "unlisted" | "private";
  status: "draft" | "published" | "scheduled";
  userId?: string;
  scheduledAt?: string; // ISO string for scheduled articles
}

/**
 * Update article request payload
 * All fields optional for partial updates
 */
export type UpdateArticleRequest = Partial<Article>;
