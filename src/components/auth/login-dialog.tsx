"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import {
  currentUserAtom,
  accessTokenAtom,
  loginAction,
  fetchMeAction,
} from "@/lib/auth-store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
} from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core";
import { useI18n } from "@/components/providers/i18n-provider";
import SignupForm from "./signup-form";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
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
 * Internationalized Login Dialog Component
 * Handles user authentication with form validation
 * Uses custom i18n hook for multi-language support
 */
export default function LoginDialog() {
  const { t } = useI18n();
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      // Attempt to login with provided credentials
      const user = await loginAction(values.email, values.password);

      // Update access token in Jotai state (optional, for UI sync)
      setAccessToken(null); // We keep the actual token in http layer memory

      // Fetch complete user data if not provided by login response
      const completeUser = user ?? (await fetchMeAction());
      setUser(completeUser);

      // Show success message and close dialog
      toast.success(t("toastLoginSuccess", "toast"));
      setOpen(false);
      reset(); // Clear form
      setShowPassword(false); // Reset password visibility
    } catch (error: unknown) {
      // Handle login errors and show appropriate error message
      const errorMessage = extractErrorMessage(
        error,
        t("loginErrorDefault", "auth"),
      );
      toast.error(errorMessage);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset(); // Clear form when dialog closes
      setShowPassword(false); // Reset password visibility when dialog closes
      setShowSignup(false); // Reset to login view when dialog closes
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {/* Use the existing trigger button but this could also be swapped to Calumma Button if desired */}
        <Button variant="outline">{t("loginButton", "auth")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        {/* Header kept minimal as the Card will contain the full title/description per login-01 */}
        <DialogHeader>
          <DialogTitle>
            {showSignup
              ? t("registerTitle", "auth") || "Register"
              : t("loginTitle", "auth") || "Login"}
          </DialogTitle>
        </DialogHeader>

        {/* login-01 layout: Card + Header + Content */}
        {showSignup ? (
          <SignupForm onBackToLogin={() => setShowSignup(false)} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {/* Title aligned with login-01, internationalized */}
                {t("loginCardTitle", "auth") ||
                  t("loginTitle", "auth")}
              </CardTitle>
              <CardDescription>
                {/* Description aligned with login-01, fallback to a generic helper */}
                {t("loginCardDescription", "auth") ||
                  t("loginSubtitle", "auth") ||
                  "Enter your email below to login to your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Form wiring preserved, visuals adapted to login-01 */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  {/* Email field */}
                  <div className="grid gap-3">
                    <Label htmlFor="email">
                      {t("email", "auth")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("emailPlaceholder", "auth")}
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

                  {/* Password field + forgot link (decorative only here) */}
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">
                        {t("password", "auth")}
                      </Label>
                      <button
                        type="button"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
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
                        placeholder={t("passwordPlaceholder", "auth")}
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

                  {/* Actions: primary submit, optional provider button as placeholder */}
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? t("loggingIn", "auth")
                        : t("login", "auth")}
                    </Button>
                    {/* This extra button mirrors login-01; wire to provider auth if desired */}
                    <Button variant="outline" className="w-full" type="button">
                      {t("loginWithGoogle", "auth") ||
                        "Login with Google"}
                    </Button>
                  </div>
                </div>
                {/* Footer text like in login-01 */}
                <div className="mt-4 text-center text-sm">
                  {t("noAccount", "auth") ||
                    "Don't have an account?"}{" "}
                  <button
                    type="button"
                    className="underline underline-offset-4"
                    onClick={() => setShowSignup(true)}
                  >
                    {t("register", "auth") || "Register"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
