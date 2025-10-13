/**
 * Form Type Definitions
 * Pure TypeScript type definitions for form data
 * Note: Validation schemas have been moved to @/lib/validators/forms and @/lib/validators/auth
 * Note: Login form types are in @/lib/validators/auth to avoid duplication
 */

// ============================================================================
// Registration Form Types
// ============================================================================

/**
 * Registration form data structure
 * Used for user registration
 */
export interface RegisterFormData {
  name?: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dob?: string;
  phoneNumber?: string;
}

// ============================================================================
// Profile Update Form Types
// ============================================================================

/**
 * Profile update form data structure
 * Used for updating user profile information
 */
export interface ProfileFormData {
  name?: string;
  username?: string;
  dob?: string;
  phoneNumber?: string;
}

// ============================================================================
// Change Password Form Types
// ============================================================================

/**
 * Change password form data structure
 * Used for changing user password
 */
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// ============================================================================
// Forgot Password Form Types
// ============================================================================

/**
 * Forgot password form data structure
 * Used for requesting password reset
 */
export interface ForgotPasswordFormData {
  email: string;
}

// ============================================================================
// Reset Password Form Types
// ============================================================================

/**
 * Reset password form data structure
 * Used for resetting password with token
 */
export interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
