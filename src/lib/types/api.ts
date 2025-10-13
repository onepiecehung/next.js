/**
 * API Response Types
 * Core API response structures and authentication-related types
 * Note: Article types have been moved to @/lib/types/article for better organization
 */

// ============================================================================
// Base API Response Structure
// ============================================================================

/**
 * Base API Response structure used across all endpoints
 * All API responses follow this consistent format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}

// ============================================================================
// User Types
// ============================================================================

/**
 * User entity structure
 * Core user information returned by the API
 */
export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string | null;
  username: string;
  status: string;
  role: string;
  email: string;
  dob: string | null;
  phoneNumber: string | null;
  oauthProvider: string | null;
  oauthId: string | null;
  authMethod: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  avatar: {
    url: string;
    key: string;
  };
}

/**
 * Public User interface for profile pages
 * Extends User with additional public profile fields
 */
export interface PublicUser extends User {
  bio?: string;
  website?: string;
  location?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

// ============================================================================
// Authentication Types
// ============================================================================

/**
 * Login request payload
 * Used for email/password authentication
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Firebase login request payload
 * Used for Firebase authentication with ID token
 */
export interface FirebaseLoginRequest {
  idToken: string;
}

/**
 * Login response structure
 * Contains user data and authentication tokens
 */
export interface LoginResponse {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

// ============================================================================
// OTP (One-Time Password) Types
// ============================================================================

/**
 * OTP request payload
 * Used for requesting OTP via email
 */
export interface OTPRequestRequest {
  email: string;
}

/**
 * OTP request response structure
 * Contains request ID and expiration time
 */
export interface OTPRequestResponse {
  success: boolean;
  message: string;
  data: {
    requestId: string;
    expiresInSec: number; // seconds
  };
}

/**
 * OTP verification request payload
 * Used for verifying OTP code
 */
export interface OTPVerifyRequest {
  email: string;
  code: string;
  requestId: string;
}

/**
 * OTP verification response structure
 * Contains user data and authentication tokens upon successful verification
 */
export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

// ============================================================================
// Token Management Types
// ============================================================================

/**
 * Refresh token request payload
 * Used for obtaining new access token
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Refresh token response structure
 * Contains new access token
 */
export interface RefreshTokenResponse {
  accessToken: string;
}

/**
 * Logout response structure
 * Confirms successful logout
 */
export interface LogoutResponse {
  message: string;
}

// ============================================================================
// User Profile Management Types
// ============================================================================

/**
 * Update profile request payload
 * Used for updating user profile information
 */
export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  dob?: string;
  phoneNumber?: string;
}

/**
 * Update profile response structure
 * Contains updated user data
 */
export interface UpdateProfileResponse {
  user: User;
}

// ============================================================================
// Password Management Types
// ============================================================================

/**
 * Change password request payload
 * Used for changing user password
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Change password response structure
 * Confirms successful password change
 */
export interface ChangePasswordResponse {
  message: string;
}

/**
 * Forgot password request payload
 * Used for requesting password reset
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Forgot password response structure
 * Confirms password reset email sent
 */
export interface ForgotPasswordResponse {
  message: string;
}

/**
 * Reset password request payload
 * Used for resetting password with token
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Reset password response structure
 * Confirms successful password reset
 */
export interface ResetPasswordResponse {
  message: string;
}

// ============================================================================
// Email Verification Types
// ============================================================================

/**
 * Verify email request payload
 * Used for verifying email with token
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * Verify email response structure
 * Confirms successful email verification
 */
export interface VerifyEmailResponse {
  message: string;
}

/**
 * Resend verification email request payload
 * Used for requesting new verification email
 */
export interface ResendVerificationEmailRequest {
  email: string;
}

/**
 * Resend verification email response structure
 * Confirms verification email sent
 */
export interface ResendVerificationEmailResponse {
  message: string;
}

// ============================================================================
// Error Response Types
// ============================================================================

/**
 * Generic error response structure
 * Used for all API error responses
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: Record<string, unknown>;
  };
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Pagination metadata structure
 * Used in list responses for pagination information
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response structure
 * Generic wrapper for paginated list responses
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// ============================================================================
// Common Response Types
// ============================================================================

/**
 * Common success response structure
 * Used for simple success responses without data payload
 */
export interface SuccessResponse {
  success: true;
  message: string;
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}
