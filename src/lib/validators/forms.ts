import { z } from "zod";

/**
 * Form Validation Schemas
 * Runtime validation schemas using Zod for form validation
 * These schemas are separate from type definitions to keep the types module pure
 */

// ============================================================================
// Registration Form Schema
// ============================================================================
// Note: Login form schema is in @/lib/validators/auth
/**
 * Registration form validation schema (simple version without confirm password)
 * Used for signup component when confirmPassword is not needed
 */
export const registerFormSchemaSimple = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  dob: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export type RegisterFormDataSimple = z.infer<typeof registerFormSchemaSimple>;

/**
 * Registration form validation schema (with password confirmation)
 * Used for register pages where password confirmation is required
 */
export const registerFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    dob: z.string().optional(),
    phoneNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

// ============================================================================
// Profile Update Form Schema
// ============================================================================

/**
 * Profile update form validation schema
 * Validates user profile update form
 */
export const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  dob: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

// ============================================================================
// Change Password Form Schema
// ============================================================================

/**
 * Change password form validation schema
 * Validates password change form with confirmation
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ============================================================================
// Forgot Password Form Schema
// ============================================================================

/**
 * Forgot password form validation schema
 * Validates forgot password request form
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ============================================================================
// Reset Password Form Schema
// ============================================================================

/**
 * Reset password form validation schema
 * Validates password reset form with confirmation
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
