import { z } from "zod";

/**
 * Authentication form validation schemas
 * Centralized validation logic for all authentication-related forms
 * Includes: login, signup, OTP, password management, and profile forms
 */

// ============================================================================
// Base Validation Schemas
// ============================================================================

// Base email validation
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

// Base password validation
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(128, "Password must be less than 128 characters");

// Strong password validation (for password changes)
const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters");

// OTP code validation
const otpCodeSchema = z
  .string()
  .min(6, "OTP code must be 6 digits")
  .max(6, "OTP code must be 6 digits")
  .regex(/^\d{6}$/, "OTP code must contain only numbers");

// Username validation
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must be less than 50 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  );

// Name validation
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .optional();

// ============================================================================
// Authentication Forms
// ============================================================================

/**
 * Login form validation schema
 * Used for email/password authentication
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * OTP request validation schema
 * Used for requesting OTP via email
 */
export const otpRequestSchema = z.object({
  email: emailSchema,
});

/**
 * OTP verification validation schema
 * Used for verifying OTP code
 */
export const otpVerifySchema = z.object({
  email: emailSchema,
  code: otpCodeSchema,
});

/**
 * Signup form validation schema
 * Used for user registration
 */
export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ============================================================================
// Registration Forms
// ============================================================================

/**
 * Registration form validation schema (simple version without confirm password)
 * Used for signup component when confirmPassword is not needed
 */
export const registerFormSchemaSimple = z.object({
  name: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  dob: z.string().optional(),
  phoneNumber: z.string().optional(),
});

/**
 * Registration form validation schema (with password confirmation)
 * Used for register pages where password confirmation is required
 */
export const registerFormSchema = z
  .object({
    name: nameSchema,
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(6, "Please confirm your password"),
    dob: z.string().optional(),
    phoneNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ============================================================================
// Profile Management Forms
// ============================================================================

/**
 * Profile update form validation schema
 * Validates user profile update form
 */
export const profileFormSchema = z.object({
  name: nameSchema,
  username: usernameSchema.optional(),
  dob: z.string().optional(),
  phoneNumber: z.string().optional(),
});

// ============================================================================
// Password Management Forms
// ============================================================================

/**
 * Change password form validation schema
 * Validates password change form with confirmation
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: strongPasswordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  });

/**
 * Forgot password form validation schema
 * Validates forgot password request form
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password form validation schema
 * Validates password reset form with confirmation
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: strongPasswordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

// ============================================================================
// Type Exports
// ============================================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type OTPRequestFormData = z.infer<typeof otpRequestSchema>;
export type OTPVerifyFormData = z.infer<typeof otpVerifySchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type RegisterFormDataSimple = z.infer<typeof registerFormSchemaSimple>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Server error mapping
 * Maps common server errors to user-friendly messages
 */
export const mapServerError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: unknown }).response;
    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = (response as { data?: unknown }).data;
      if (typeof data === "object" && data !== null && "message" in data) {
        const message = (data as { message?: unknown }).message;
        if (typeof message === "string") {
          return message;
        }
      }
    }
  }

  return "An unexpected error occurred. Please try again.";
};

/**
 * Note: Authentication error messages have been moved to i18n
 *
 * Usage in components:
 * import { useI18n } from '@/components/providers/i18n-provider';
 *
 * const { t } = useI18n();
 * const errorMessage = t('errors.invalidCredentials', 'auth');
 *
 * Available error keys in 'auth' namespace:
 * - auth.errors.invalidCredentials
 * - auth.errors.accountLocked
 * - auth.errors.emailNotVerified
 * - auth.errors.tooManyAttempts
 * - auth.errors.networkError
 * - auth.errors.serverError
 * - auth.errors.unknownError
 *
 * Available validation error keys:
 * - auth.validation.emailRequired
 * - auth.validation.emailInvalid
 * - auth.validation.passwordRequired
 * - auth.validation.passwordsMismatch
 * - ... and more in src/i18n/locales/en/auth.json
 */
