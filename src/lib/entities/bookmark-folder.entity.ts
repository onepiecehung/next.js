import { BaseEntityCustom } from "./base.entity";
import { User } from "./user.entity";

/**
 * Bookmark Folder Entity
 *
 * Represents a folder to organize bookmarks
 * Similar to browser bookmarks or social media collections
 *
 * Features:
 * - User-owned folder organization
 * - Multiple folder types (default, custom, favorites, etc.)
 * - Visibility controls (private, public, unlisted)
 * - Sort ordering and visual customization
 * - Metadata support for extensibility
 * - Relationship with bookmarks and users
 */
export interface BookmarkFolder extends BaseEntityCustom {
  /**
   * ID of the user who owns this folder
   * Links to users table
   */
  userId: string;

  /**
   * User who owns this folder
   * Many-to-One relationship with User entity
   */
  user: User;

  /**
   * Name of the folder
   * User-friendly display name
   */
  name: string;

  /**
   * Optional description of the folder
   * Additional context about the folder's purpose
   */
  description?: string;

  /**
   * Type of folder (default, custom, favorites, etc.)
   * Determines folder behavior and permissions
   */
  type: string;

  /**
   * Visibility of the folder
   * Controls who can see this folder
   */
  visibility: string;

  /**
   * Whether this is a default folder
   * Default folders cannot be deleted and have special behavior
   */
  isDefault: boolean;

  /**
   * Sort order for folder display
   * Lower numbers appear first
   */
  sortOrder: number;

  /**
   * Color theme for the folder
   * Optional visual customization (hex color code)
   */
  color?: string;

  /**
   * Icon for the folder
   * Optional visual identifier
   */
  icon?: string;

  /**
   * Additional metadata for the folder
   * JSON field for storing folder-specific data
   */
  metadata?: Record<string, unknown>;

  /**
   * Bookmarks in this folder
   * One-to-Many relationship with Bookmark entity
   * Note: This is a forward reference to avoid circular dependency
   */
  bookmarks?: unknown[];
}
