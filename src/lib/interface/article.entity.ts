import { BaseEntityCustom } from "./base.entity";
import { Media } from "./media.entity";
import { User } from "./user.entity";

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
