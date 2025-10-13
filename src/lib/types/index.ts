/**
 * Types Module - Central Type Definitions Export
 * 
 * This module serves as the main entry point for all TypeScript type definitions.
 * It contains ONLY pure type definitions and interfaces - no runtime code.
 * 
 * Important:
 * - Runtime validation schemas (Zod) are kept in @/lib/validators
 * - React components and providers are kept in @/components
 * - This separation ensures the types module doesn't bloat the bundle with runtime code
 */

// ============================================================================
// API Types
// ============================================================================

/**
 * Core API response types and authentication-related types
 * Includes: ApiResponse, User, LoginRequest/Response, OTP types, etc.
 */
export * from "./api";

// ============================================================================
// Article Types
// ============================================================================

/**
 * Article-related types and constants
 * Single source of truth for article data structures
 * Includes: Article, ArticleSummary, CreateArticleDto, ARTICLE_CONSTANTS, etc.
 */
export * from "./article";

// ============================================================================
// Form Types
// ============================================================================

/**
 * Pure TypeScript types for form data structures
 * Note: Validation schemas have been moved to @/lib/validators/forms
 * Includes: LoginFormData, RegisterFormData, ProfileFormData, etc.
 */
export * from "./forms";

// ============================================================================
// UI Component Types
// ============================================================================

/**
 * Common UI component type definitions
 * Includes: ButtonProps, InputProps, DialogProps, NavItem, TableColumn, etc.
 */
export * from "./ui";
