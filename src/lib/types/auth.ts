import type { User } from "./user";

/**
 * Authentication Type Definitions
 * Contains authentication, OTP, token management, and password-related types
 */

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

