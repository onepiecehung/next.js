"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import {
  currentUserAtom,
  accessTokenAtom,
  authLoadingAtom,
  loginAction,
  fetchMeAction,
  loginWithGoogleAction,
  loginWithGithubAction,
} from "@/lib/auth-store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button, Input, Label } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core";
import { useI18n } from "@/components/providers/i18n-provider";
import Link from "next/link";

// Form validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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
 * Login Page Component
 * Handles user authentication with form validation and edge cases
 * Uses custom i18n hook for multi-language support
 * Includes proper error handling and loading states
 */
export default function LoginPage() {
  const { t } = useI18n();
  const [user, setUser] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const isAuthenticated = !!user;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Attempt to login with provided credentials
      const user = await loginAction(values.email, values.password);

      // Update access token in Jotai state (optional, for UI sync)
      setAccessToken(null); // We keep the actual token in http layer memory

      // Fetch complete user data if not provided by login response
      const completeUser = user ?? (await fetchMeAction());
      setUser(completeUser);

      // Show success message
      toast.success(
        t("toastLoginSuccess", "toast") || "Login successful!"
      );
      
      // Reset form
      reset();
      setShowPassword(false);
      
      // Redirect will be handled by useAuthRedirect hook
    } catch (error: unknown) {
      // Handle login errors and show appropriate error message
      const errorMessage = extractErrorMessage(
        error,
        t("loginErrorDefault", "auth") || "Login failed. Please check your credentials."
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    toast.info("Forgot password functionality coming soon!");
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Attempt to login with Google using Firebase
      const user = await loginWithGoogleAction();

      // Update access token in Jotai state (optional, for UI sync)
      setAccessToken(null); // We keep the actual token in http layer memory

      // Set the user in state
      setUser(user);

      // Show success message
      toast.success(
        t("toastLoginSuccess", "toast") || "Login successful!"
      );
      
      // Reset form
      reset();
      setShowPassword(false);
      
      // Redirect will be handled by useAuthRedirect hook
    } catch (error: unknown) {
      // Handle specific Firebase auth errors
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        
        switch (firebaseError.code) {
          case 'auth/cancelled-popup-request':
            // User cancelled the popup - don't show error message
            return;
          case 'auth/popup-closed-by-user':
            // User closed the popup - don't show error message
            return;
          case 'auth/popup-blocked':
            toast.error(t("popupBlocked", "auth") || "Popup was blocked. Please allow popups and try again.");
            return;
          case 'auth/unauthorized-domain':
            toast.error(t("unauthorizedDomain", "auth") || "This domain is not authorized for Google login.");
            return;
          case 'auth/account-exists-with-different-credential':
            toast.error(t("accountExistsDifferentCredential", "auth") || "An account already exists with this email using a different login method.");
            return;
          default:
            // Show generic error for other cases
            const errorMessage = extractErrorMessage(
              error,
              t("googleLoginError", "auth") || "Google login failed. Please try again."
            );
            toast.error(errorMessage);
        }
      } else {
        // Handle non-Firebase errors
        const errorMessage = extractErrorMessage(
          error,
          t("googleLoginError", "auth") || "Google login failed. Please try again."
        );
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      // Attempt to login with GitHub using Firebase
      const user = await loginWithGithubAction();

      // Update access token in Jotai state (optional, for UI sync)
      setAccessToken(null); // We keep the actual token in http layer memory

      // Set the user in state
      setUser(user);

      // Show success message
      toast.success(
        t("toastLoginSuccess", "toast") || "Login successful!"
      );
      
      // Reset form
      reset();
      setShowPassword(false);
      
      // Redirect will be handled by useAuthRedirect hook
    } catch (error: unknown) {
      // Handle specific Firebase auth errors
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        
        switch (firebaseError.code) {
          case 'auth/cancelled-popup-request':
            // User cancelled the popup - don't show error message
            return;
          case 'auth/popup-closed-by-user':
            // User closed the popup - don't show error message
            return;
          case 'auth/popup-blocked':
            toast.error(t("popupBlocked", "auth") || "Popup was blocked. Please allow popups and try again.");
            return;
          case 'auth/unauthorized-domain':
            toast.error(t("unauthorizedDomain", "auth") || "This domain is not authorized for GitHub login.");
            return;
          case 'auth/account-exists-with-different-credential':
            toast.error(t("accountExistsDifferentCredential", "auth") || "An account already exists with this email using a different login method.");
            return;
          default:
            // Show generic error for other cases
            const errorMessage = extractErrorMessage(
              error,
              t("githubLoginError", "auth") || "GitHub login failed. Please try again."
            );
            toast.error(errorMessage);
        }
      } else {
        // Handle non-Firebase errors
        const errorMessage = extractErrorMessage(
          error,
          t("githubLoginError", "auth") || "GitHub login failed. Please try again."
        );
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
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
      <div className="w-full max-w-sm">
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
              {t("loginCardTitle", "auth") ||
                t("loginTitle", "auth") ||
                "Login to your account"}
            </CardTitle>
            <CardDescription>
              {t("loginCardDescription", "auth") ||
                t("loginSubtitle", "auth") ||
                "Enter your email below to login to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Email field */}
                <div className="grid gap-3">
                  <Label htmlFor="email">
                    {t("email", "auth") || "Email"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      t("emailPlaceholder", "auth") ||
                      "m@example.com"
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

                {/* Password field with forgot password link */}
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">
                      {t("password", "auth") || "Password"}
                    </Label>
                    <button
                      type="button"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      onClick={handleForgotPassword}
                      aria-label="Forgot your password"
                    >
                                              {t("forgotPassword", "auth") ||
                        "Forgot your password?"}
                    </button>
                  </div>
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

                {/* Submit buttons */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading
                      ? t("loggingIn", "auth") || "Logging in..."
                      : t("login", "auth") || "Login"}
                  </Button>
                  
                  {/* Social login buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isLoading || isSubmitting}
                    >
                      {isLoading
                        ? t("loggingIn", "auth") || "Logging in..."
                        : t("loginWithGoogle", "auth") || "Google"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      type="button"
                      onClick={handleGithubLogin}
                      disabled={isLoading || isSubmitting}
                    >
                      {isLoading
                        ? t("loggingIn", "auth") || "Logging in..."
                        : t("loginWithGithub", "auth") || "GitHub"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer text with link to register */}
              <div className="mt-4 text-center text-sm">
                {t("noAccount", "auth") ||
                  "Don't have an account?"}{" "}
                <Link
                  href="/auth/register"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  {t("register", "auth") || "Register"}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
