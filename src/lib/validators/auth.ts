import { z } from "zod";

/**
 * Authentication form validation schemas
 * Centralized validation logic for login, signup, and OTP forms
 */

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

// OTP code validation
const otpCodeSchema = z
  .string()
  .min(6, "OTP code must be 6 digits")
  .max(6, "OTP code must be 6 digits")
  .regex(/^\d{6}$/, "OTP code must contain only numbers");

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

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type OTPRequestFormData = z.infer<typeof otpRequestSchema>;
export type OTPVerifyFormData = z.infer<typeof otpVerifySchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

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
 * Authentication error messages
 * Centralized error messages for consistency
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Email or password is incorrect",
  ACCOUNT_LOCKED: "Account has been locked. Please contact support",
  EMAIL_NOT_VERIFIED: "Please verify your email before logging in",
  TOO_MANY_ATTEMPTS: "Too many failed attempts. Please try again later",
  NETWORK_ERROR: "Network error. Please check your connection",
  SERVER_ERROR: "Server error. Please try again later",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again",
} as const;

/**
 * Validation error messages
 * Centralized validation error messages
 */
export const VALIDATION_ERRORS = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address",
  EMAIL_TOO_LONG: "Email must be less than 255 characters",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
  PASSWORD_TOO_LONG: "Password must be less than 128 characters",
  OTP_REQUIRED: "OTP code is required",
  OTP_INVALID: "OTP code must be 6 digits",
  OTP_NUMBERS_ONLY: "OTP code must contain only numbers",
  PASSWORDS_MISMATCH: "Passwords do not match",
  CONFIRM_PASSWORD_REQUIRED: "Please confirm your password",
} as const;
