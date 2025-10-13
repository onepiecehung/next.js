import type { UploadedMedia } from "../api/media";
import { ARTICLE_CONSTANTS } from "../constants/article";

/**
 * Article Type Definitions
 * Pure TypeScript types for article entities and DTOs
 * Note: Runtime constants have been moved to @/lib/constants/article
 */

// ============================================================================
// Article Type Aliases (derived from constants)
// ============================================================================

/**
 * Article status type
 * Represents the publication status of an article
 */
export type ArticleStatus =
  (typeof ARTICLE_CONSTANTS.STATUS)[keyof typeof ARTICLE_CONSTANTS.STATUS];

/**
 * Article visibility type
 * Represents the visibility level of an article
 */
export type ArticleVisibility =
  (typeof ARTICLE_CONSTANTS.VISIBILITY)[keyof typeof ARTICLE_CONSTANTS.VISIBILITY];

/**
 * Article content format type
 * Represents the format of article content
 */
export type ArticleContentFormat =
  (typeof ARTICLE_CONSTANTS.CONTENT_FORMAT)[keyof typeof ARTICLE_CONSTANTS.CONTENT_FORMAT];

// ============================================================================
// Base Article Fields (shared across DTOs)
// ============================================================================

/**
 * Base article fields shared across all article-related interfaces
 * Contains common fields that appear in Create, Update, and Entity
 */
export interface BaseArticleFields {
  title: string;
  content: string;
  summary?: string;
  contentFormat: ArticleContentFormat;
  visibility: ArticleVisibility;
  status: ArticleStatus;
  tags: string[];
  coverImageId?: string;
  coverImageUrl?: string;
  wordCount?: number;
  readTimeMinutes?: number;
  slug: string;
  publishedAt?: Date;
  scheduledAt?: Date;
}

/**
 * Base article fields for creation (all optional except title/content)
 */
export interface BaseArticleCreateFields {
  title: string;
  content: string;
  summary?: string;
  contentFormat?: ArticleContentFormat;
  visibility?: ArticleVisibility;
  status?: ArticleStatus;
  tags?: string[];
  coverImageId?: string;
  coverImageUrl?: string;
  wordCount?: number;
  readTimeMinutes?: number;
  slug?: string;
  publishedAt?: Date;
  scheduledAt?: Date;
}

/**
 * Base article fields for updates (all optional)
 */
export interface BaseArticleUpdateFields {
  title?: string;
  content?: string;
  summary?: string;
  contentFormat?: ArticleContentFormat;
  visibility?: ArticleVisibility;
  status?: ArticleStatus;
  tags?: string[];
  coverImageId?: string;
  coverImageUrl?: string;
  wordCount?: number;
  readTimeMinutes?: number;
  slug?: string;
  publishedAt?: Date;
  scheduledAt?: Date;
}

// ============================================================================
// Article DTOs (Data Transfer Objects)
// ============================================================================

/**
 * Create Article DTO
 * Used for creating new articles via API
 * Extends base create fields with additional creation-specific fields
 */
export interface CreateArticleDto extends BaseArticleCreateFields {
  userId?: string;
}

/**
 * Update Article DTO
 * Used for updating existing articles via API
 * All fields are optional for partial updates
 */
export type UpdateArticleDto = BaseArticleUpdateFields;

// ============================================================================
// Article Entity
// ============================================================================

/**
 * Article entity
 * Complete article structure as returned by the API
 * Extends base fields with entity-specific fields (id, timestamps)
 */
export interface Article extends BaseArticleFields {
  id: string;
  userId: string;
  coverImage?: UploadedMedia;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Article List/Summary Types
// ============================================================================

/**
 * Article summary for lists
 * Lightweight version of Article used in list views and profile pages
 * Contains only essential fields for display in cards/lists
 */
export interface ArticleSummary {
  id: string;
  title: string;
  summary?: string;
  slug: string;
  tags: string[];
  coverImageUrl?: string;
  readTimeMinutes?: number;
  status: ArticleStatus;
  visibility: ArticleVisibility;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Author information (optional, may be populated)
  author?: {
    id: string;
    username: string;
    name?: string;
    avatar?: {
      url: string;
      key: string;
    };
  };
  // Engagement metrics (optional, may be populated)
  _count?: {
    likes?: number;
    comments?: number;
  };
}

/**
 * Article with author details
 * Full article with populated author information
 * Used in detail views where author information is needed
 */
export interface ArticleWithAuthor extends Article {
  author: {
    id: string;
    username: string;
    name?: string;
    email?: string;
    avatar?: {
      url: string;
      key: string;
    };
    bio?: string;
  };
}
