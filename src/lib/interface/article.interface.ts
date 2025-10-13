import { BaseEntityCustom } from "./base.interface";
import { Media } from "./media.interface";
import { User } from "./user.interface";

export interface Article extends BaseEntityCustom {
  userId: string;

  user: User;

  title: string;

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
