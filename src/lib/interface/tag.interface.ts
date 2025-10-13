import { Article } from "./article.interface";
import { BaseEntityCustom } from "./base.interface";

/**
 * Tag Entity
 *
 * Represents content tags for categorization and discovery
 * Features:
 * - Unique name and slug for SEO
 * - Usage tracking for popularity
 * - Color coding for visual organization
 * - Soft delete support
 * - Search optimization with indexes
 *
 * Use Cases:
 * - Article categorization
 * - Content discovery and filtering
 * - SEO optimization
 * - Visual organization with colors and icons
 * - Popularity tracking and trending
 */
export interface Tag extends BaseEntityCustom {
  /**
   * Tag name - human readable name
   * Examples: "JavaScript", "React", "Tutorial", "News"
   * Maximum length: 64 characters
   */
  name: string;

  /**
   * URL-friendly slug for SEO and routing
   * Generated from name, must be unique
   * Examples: "javascript", "react", "tutorial", "news"
   */
  slug: string;

  /**
   * Optional tag description for context
   * Can be used in tag pages and tooltips
   */
  description?: string;

  /**
   * Tag color for visual organization
   * Stored as hex color code
   * Examples: "#3B82F6", "#10B981", "#F59E0B"
   */
  color?: string;

  /**
   * Tag icon for visual representation
   * Can be emoji, icon name, or icon URL
   * Examples: "🚀", "code", "https://example.com/icon.svg"
   */
  icon?: string;

  /**
   * Number of times this tag has been used
   * Used for popularity ranking and statistics
   * Automatically updated when articles use this tag
   */
  usageCount: number;

  /**
   * Whether this tag is active and visible
   * Inactive tags are hidden from public views
   * but can still be used for existing articles
   */
  isActive: boolean;

  /**
   * Whether this tag is featured/promoted
   * Featured tags appear in trending/popular sections
   */
  isFeatured: boolean;

  /**
   * SEO meta title for tag pages
   * If not provided, uses tag name
   */
  metaTitle?: string;

  /**
   * SEO meta description for tag pages
   * Used in search engine results
   */
  metaDescription?: string;

  /**
   * Additional metadata as JSON
   * Can store custom properties like:
   * - category: "technology", "lifestyle", "business"
   * - language: "en", "vi"
   * - parentTag: "programming" (for hierarchical tags)
   */
  metadata?: Record<string, unknown>;

  /**
   * Articles that use this tag
   * Many-to-Many relationship through article_tags junction table
   */
  articles?: Article[];
}
