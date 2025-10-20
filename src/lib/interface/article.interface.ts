import { BaseEntityCustom } from "./base.interface";
import { Media } from "./media.interface";
import { User } from "./user.interface";

export interface Article extends BaseEntityCustom {
  userId: string;

  user: User;

  title: string;

  /**
   * Raw article content
   */
  content: string;

  /**
   * Content format indicator (e.g., html, markdown)
   */
  contentFormat: string;

  slug: string;

  summary?: string;

  visibility: string;

  status: string;

  tags?: string[];

  tagsArray?: string[];

  coverImageId?: string;

  coverImage: Media;

  coverImageUrl?: string;

  wordCount?: number;

  readTimeMinutes?: number;

  viewsCount: number;

  likesCount: number;

  bookmarksCount: number;

  commentsCount: number;

  scheduledAt?: Date;

  publishedAt?: Date;
}

export interface CreateArticleDto extends Partial<Article> {
  title: string;
  content: string;
  contentFormat: "html" | "markdown";
  visibility: "public" | "unlisted" | "private";
  status: "draft" | "published" | "scheduled";
  userId?: string;
  scheduledAt?: Date; // ISO string for scheduled articles
}

export type UpdateArticleRequest = Partial<Article>;
