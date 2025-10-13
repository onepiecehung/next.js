import { BaseEntityCustom } from "./base.entity";
import { BookmarkFolder } from "./bookmark-folder.entity";
import { User } from "./user.entity";

/**
 * Bookmark Entity
 *
 * Represents a saved bookmark for various content types
 * Similar to browser bookmarks or social media saves
 *
 * Features:
 * - Bookmark any content type (articles, comments, users, media)
 * - Organize bookmarks into folders
 * - Add personal notes and tags
 * - Track bookmark status and activity
 * - Support for different bookmarkable content types
 */
export interface Bookmark extends BaseEntityCustom {
  /**
   * ID of the user who created this bookmark
   * Links to users table
   */
  userId: string;

  /**
   * User who created this bookmark
   * Many-to-One relationship with User entity
   */
  user: User;

  /**
   * Type of content being bookmarked
   * Examples: 'article', 'comment', 'user', 'media'
   */
  bookmarkableType: string;

  /**
   * ID of the content being bookmarked
   * References the actual content in the respective table
   */
  bookmarkableId: string;

  /**
   * ID of the folder this bookmark belongs to
   * Links to bookmark_folders table
   */
  folderId?: string;

  /**
   * Folder this bookmark belongs to
   * Many-to-One relationship with BookmarkFolder entity
   */
  folder?: BookmarkFolder;

  /**
   * Status of the bookmark
   * Controls visibility and behavior
   */
  status: string;

  /**
   * Optional note about this bookmark
   * User's personal notes about the bookmarked content
   */
  note?: string;

  /**
   * Tags for organizing bookmarks
   * Comma-separated list of tags
   */
  tags?: string;

  /**
   * Whether this bookmark is marked as favorite
   * Favorites get special treatment in UI
   */
  isFavorite: boolean;

  /**
   * Whether this bookmark is marked as read later
   * Read later bookmarks are for content to be consumed later
   */
  isReadLater: boolean;

  /**
   * Sort order within the folder
   * Lower numbers appear first
   */
  sortOrder: number;

  /**
   * Additional metadata for the bookmark
   * JSON field for storing bookmark-specific data
   */
  metadata?: Record<string, unknown>;
}
