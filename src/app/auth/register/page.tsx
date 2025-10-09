"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button, Input, Label } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core";
import { useAuthRedirect } from "@/hooks/auth";
import {
  accessTokenAtom,
  currentUserAtom,
  fetchMeAction,
  signupAction,
} from "@/lib/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Form validation schema for signup
const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    name: z.string().optional(),
    dob: z.string().optional(),
    phoneNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

// Helper function to extract error message from various error types
function extractErrorMessage(error: unknown, defaultMessage: string): string {
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

  return defaultMessage;
}

/**
 * Register Page Component
 * Handles user registration with form validation and edge cases
 * Uses custom i18n hook for multi-language support
 * Includes proper error handling and loading states
 */
export default function RegisterPage() {
  const { t } = useI18n();
  const { isAuthenticated, authLoading } = useAuthRedirect();
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      // Attempt to signup with provided credentials
      const user = await signupAction(
        values.username,
        values.email,
        values.password,
        values.name,
        values.dob,
        values.phoneNumber,
      );

      // Update access token in Jotai state
      setAccessToken(null);

      // Fetch complete user data
      const completeUser = user ?? (await fetchMeAction());
      setUser(completeUser);

      // Show success message
      toast.success(
        t("toastLoginSuccess", "toast") || "Account created successfully!",
      );

      // Reset form
      reset();
      setShowPassword(false);
      setShowConfirmPassword(false);

      // Redirect will be handled by useAuthRedirect hook
    } catch (error: unknown) {
      // Handle signup errors and show appropriate error message
      const errorMessage = extractErrorMessage(
        error,
        t("registerErrorDefault", "auth") || "Signup failed. Please try again.",
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Placeholder for Google OAuth
    toast.info("Google signup functionality coming soon!");
  };

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the form if user is already authenticated
  // The useAuthRedirect hook will handle the redirect
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {t("registerCardTitle", "auth") ||
                t("registerTitle", "auth") ||
                "Create Account"}
            </CardTitle>
            <CardDescription>
              {t("registerCardDescription", "auth") ||
                t("registerSubtitle", "auth") ||
                "Enter your information below to create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Username field */}
                <div className="grid gap-3">
                  <Label htmlFor="username">
                    {t("username", "auth") || "Username"}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={
                      t("usernamePlaceholder", "auth") || "Enter your username"
                    }
                    required
                    aria-invalid={!!errors.username}
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email field */}
                <div className="grid gap-3">
                  <Label htmlFor="email">
                    {t("email", "auth") || "Email"}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      t("emailPlaceholder", "auth") || "m@example.com"
                    }
                    required
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className="grid gap-3">
                  <Label htmlFor="password">
                    {t("password", "auth") || "Password"}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        t("passwordPlaceholder", "auth") ||
                        "Enter your password"
                      }
                      required
                      aria-invalid={!!errors.password}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password field */}
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">
                    {t("confirmPassword", "auth") || "Confirm Password"}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={
                        t("confirmPasswordPlaceholder", "auth") ||
                        "Confirm your password"
                      }
                      required
                      aria-invalid={!!errors.confirmPassword}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Name field (optional) */}
                <div className="grid gap-3">
                  <Label htmlFor="name">
                    {t("fullName", "auth") || "Full Name"}
                    <span className="text-muted-foreground ml-1">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={
                      t("fullNamePlaceholder", "auth") || "Enter your full name"
                    }
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Date of Birth field (optional) */}
                <div className="grid gap-3">
                  <Label htmlFor="dob">
                    {t("dob", "auth") || "Date of Birth"}
                    <span className="text-muted-foreground ml-1">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    className="relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    aria-invalid={!!errors.dob}
                    {...register("dob")}
                  />
                  {errors.dob && (
                    <p className="text-sm text-red-500">{errors.dob.message}</p>
                  )}
                </div>

                {/* Phone Number field (optional) */}
                <div className="grid gap-3">
                  <Label htmlFor="phoneNumber">
                    {t("phoneNumber", "auth") || "Phone Number"}
                    <span className="text-muted-foreground ml-1">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder={
                      t("phoneNumberPlaceholder", "auth") ||
                      "Enter your phone number"
                    }
                    aria-invalid={!!errors.phoneNumber}
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Submit buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading
                      ? t("creatingAccount", "auth") || "Creating Account..."
                      : t("createAccount", "auth") || "Create Account"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                  >
                    {t("registerWithGoogle", "auth") || "Register with Google"}
                  </Button>
                </div>
              </div>

              {/* Footer text with link to login */}
              <div className="mt-4 text-center text-sm">
                {t("alreadyHaveAccount", "auth") || "Already have an account?"}{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  {t("login", "auth") || "Login"}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
