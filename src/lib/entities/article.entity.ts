import { BaseEntityCustom } from "./base.entity";
import { MediaEntity } from "./media.entity";
import { UserEntity } from "./user.entity";

export interface ArticleEntity extends BaseEntityCustom {
  userId: string;

  user: UserEntity;

  title: string;

  slug: string;

  summary?: string;

  visibility: string;

  status: string;

  tags?: string[];

  tagsArray?: string[];

  coverImageId?: string;

  coverImage: MediaEntity;

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
