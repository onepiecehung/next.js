import { BaseEntityCustom } from "./base.entity";
import { UserEntity } from "./user.entity";

/**
 * Reaction Entity
 *
 * Stores user reactions/interactions with various objects like articles, comments, users, etc.
 * Examples: like article, bookmark comment, upvote user, etc.
 * 
 * Features:
 * - Universal reaction system for any content type
 * - Support for different reaction types (like, dislike, bookmark, etc.)
 * - Unique constraint to prevent duplicate reactions
 * - Efficient indexing for performance
 * - Integration with user system
 * - Flexible subject type support
 */
export interface ReactionEntity extends BaseEntityCustom {
  /**
   * ID of the user who performed the reaction
   * Links to users table
   */
  userId: string;

  /**
   * User information who performed the reaction
   * Many-to-One relationship with User entity
   */
  user: UserEntity;

  /**
   * Type of object being reacted to
   * Examples: 'article', 'comment', 'user', 'post', etc.
   * Maximum length: 32 characters
   */
  subjectType: string;

  /**
   * ID of the object being reacted to
   * Examples: article ID, comment ID, user ID, etc.
   */
  subjectId: string;

  /**
   * Type of reaction
   * Examples: 'like', 'dislike', 'bookmark', 'upvote', 'downvote', 'clap', etc.
   * Maximum length: 24 characters
   */
  kind: string;
}
