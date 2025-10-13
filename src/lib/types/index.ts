/**
 * Types Module - Central Type Definitions Export
 * 
 * This module serves as the main entry point for all TypeScript type definitions.
 * It contains ONLY pure type definitions and interfaces - no runtime code.
 * 
 * Structure:
 * - user.ts          → User entities and profile management
 * - auth.ts          → Authentication, OTP, tokens, passwords, email verification
 * - article.ts       → Article entities, DTOs, and constants
 * - response.ts      → API responses, errors, pagination
 * 
 * Important:
 * - Runtime validation schemas (Zod) are kept in @/lib/validators
 * - React components and providers are kept in @/components
 * - This separation ensures the types module doesn't bloat the bundle with runtime code
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic API response structures, error handling, and pagination
 * Includes: ApiResponse, ApiErrorResponse, PaginationMeta, PaginatedResponse, SuccessResponse
 */
export * from "./response";

// ============================================================================
// User Types
// ============================================================================

/**
 * User entity and profile management types
 * Includes: User, PublicUser, UpdateProfileRequest, UpdateProfileResponse
 */
export * from "./user";

// ============================================================================
// Authentication Types
// ============================================================================

/**
 * Authentication, OTP, token management, password, and email verification types
 * Includes: LoginRequest, LoginResponse, FirebaseLoginRequest
 *           OTPRequestRequest, OTPRequestResponse, OTPVerifyRequest, OTPVerifyResponse
 *           RefreshTokenRequest, RefreshTokenResponse, LogoutResponse
 *           ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest
 *           VerifyEmailRequest, ResendVerificationEmailRequest
 */
export * from "./auth";

// ============================================================================
// Article Types
// ============================================================================

/**
 * Article-related types
 * Single source of truth for article data structures
 * Includes: Article, ArticleSummary, ArticleWithAuthor
 *           CreateArticleDto, UpdateArticleDto
 *           ArticleStatus, ArticleVisibility, ArticleContentFormat
 * 
 * Note: ARTICLE_CONSTANTS have been moved to @/lib/constants/article (runtime constants)
 */
export * from "./article";
