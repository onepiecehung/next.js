"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import {
  currentUserAtom,
  accessTokenAtom,
  signupAction,
  fetchMeAction,
} from "@/lib/auth-store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button, Input, Label } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core";
import { useI18n } from "@/components/providers/i18n-provider";

// Form validation schema for signup
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
  dob: z.string().optional(),
  phoneNumber: z.string().optional(),
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
 * Signup Form Component
 * Handles user registration with form validation
 * Uses custom i18n hook for multi-language support
 */
export default function SignupForm({
  onBackToLogin,
}: {
  readonly onBackToLogin: () => void;
}) {
  const { t } = useI18n();
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
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

      // Show success message and close dialog
      toast.success(
        t("toastLoginSuccess", "toast") || "Account created successfully!",
      );
      reset();
      setShowPassword(false);
      onBackToLogin(); // Go back to login view
    } catch (error: unknown) {
      // Handle signup errors and show appropriate error message
      const errorMessage = extractErrorMessage(
        error,
        t("registerErrorDefault", "auth") || "Signup failed",
      );
      toast.error(errorMessage);
    }
  };

  return (
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
          <div className="flex flex-col gap-6">
            {/* Username field */}
            <div className="grid gap-3">
              <Label htmlFor="username">
                {t("username", "auth") || "Username"}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={
                  t("usernamePlaceholder", "auth") ||
                  "Enter your username"
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
              <Label htmlFor="email">{t("email", "auth")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder", "auth")}
                required
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div className="grid gap-3">
              <Label htmlFor="password">
                {t("password", "auth")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder", "auth")}
                  required
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

            {/* Name field (optional) */}
            <div className="grid gap-3">
              <Label htmlFor="name">
                {t("fullName", "auth") || "Full Name"}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={
                  t("fullNamePlaceholder", "auth") ||
                  "Enter your full name"
                }
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Date of Birth field (optional) */}
            <div className="grid gap-3">
              <Label htmlFor="dob">
                {t("dob", "auth") || "Date of Birth"}
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

            {/* Submit button */}
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? t("creatingAccount", "auth") ||
                    "Creating Account..."
                  : t("createAccount", "auth") || "Create Account"}
              </Button>
            </div>
          </div>

          {/* Footer text */}
          <div className="mt-4 text-center text-sm">
            {t("alreadyHaveAccount", "auth") ||
              "Already have an account?"}{" "}
            <button
              type="button"
              className="underline underline-offset-4"
              onClick={onBackToLogin}
            >
              {t("signIn", "auth") || "Login"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
