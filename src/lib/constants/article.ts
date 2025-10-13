/**
 * Article Constants
 * Runtime constants for article validation and business logic
 */

/**
 * Article-related constants for validation and enums
 * Used for consistent validation across the application
 */
export const ARTICLE_CONSTANTS = {
  // Field length constraints
  TITLE_MAX_LENGTH: 256,
  SLUG_MAX_LENGTH: 256,
  COVER_IMAGE_URL_MAX_LENGTH: 512,
  SUMMARY_MAX_LENGTH: 1000,
  TAGS_MAX_COUNT: 20,
  TAG_MAX_LENGTH: 50,

  // Article status enum values
  STATUS: {
    DRAFT: "draft",
    SCHEDULED: "scheduled",
    PUBLISHED: "published",
    ARCHIVED: "archived",
  },

  // Article visibility levels
  VISIBILITY: {
    PUBLIC: "public",
    UNLISTED: "unlisted",
    PRIVATE: "private",
  },

  // Content format types
  CONTENT_FORMAT: {
    MARKDOWN: "markdown",
    HTML: "html",
  },
} as const;

