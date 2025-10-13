import { BaseEntityCustom } from "./base.entity";
import { Media } from "./media.entity";
import { User } from "./user.entity";

/**
 * Comment Entity
 *
 * Stores user comments on various objects like articles, posts, other comments, etc.
 * Similar to Discord messages with support for content, attachments, and mentions.
 *
 * Features:
 * - Nested comment system (replies to comments)
 * - Rich content support with media attachments
 * - User mentions and notifications
 * - Moderation flags and visibility controls
 * - Comment threading and organization
 * - Metadata support for rich formatting
 */
export interface Comment extends BaseEntityCustom {
  /**
   * ID of the user who created the comment
   * Links to users table
   */
  userId: string;

  /**
   * User information who created the comment
   * Many-to-One relationship with User entity
   */
  user: User;

  /**
   * Type of object being commented on
   * Examples: 'article', 'post', 'comment', 'user', etc.
   * Maximum length: 32 characters
   */
  subjectType: string;

  /**
   * ID of the object being commented on
   * Examples: article ID, post ID, parent comment ID, etc.
   */
  subjectId: string;

  /**
   * Parent comment ID for nested comments/replies
   * Null for top-level comments
   */
  parentId?: string;

  /**
   * Parent comment information for nested comments
   * Self-referencing relationship
   */
  parent?: Comment;

  /**
   * Child comments (replies)
   * One-to-Many relationship with self
   */
  replies?: Comment[];

  /**
   * Comment content/text
   * Maximum length: 2000 characters (similar to Discord)
   */
  content: string;

  /**
   * Comment type for different content formats
   * Examples: 'text', 'rich', 'embed', 'system'
   * Default: 'text'
   */
  type: string;

  /**
   * Whether the comment is pinned
   * Default: false
   */
  pinned: boolean;

  /**
   * Whether the comment is edited
   * Default: false
   */
  edited: boolean;

  /**
   * Timestamp when the comment was last edited
   * Null if never edited
   */
  editedAt?: Date;

  /**
   * Comment media attachments (files, images, stickers, etc.)
   * One-to-Many relationship with CommentMedia entity
   * Supports different media types including stickers
   */
  media?: Media[];

  /**
   * User mentions in the comment
   * One-to-Many relationship with CommentMention
   */
  mentions?: User[];

  /**
   * Additional metadata for rich content
   * JSON field for storing structured data like embeds, formatting, etc.
   */
  metadata?: Record<string, unknown>;

  /**
   * Comment flags for moderation
   * Examples: 'spam', 'inappropriate', 'offensive'
   * JSON array of flag strings
   */
  flags?: string[];

  /**
   * Comment visibility status
   * Examples: 'public', 'private', 'hidden', 'deleted'
   * Default: 'public'
   */
  visibility: string;

  /**
   * Total number of replies to this comment
   * Automatically updated when replies are added/removed
   * Default: 0
   */
  replyCount: number;
}
