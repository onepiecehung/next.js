"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { GoogleIcon, GitHubIcon, XIcon } from "@/components/ui/icons";
import { useLogin } from "@/hooks/useLogin";
import { useI18n } from "@/components/providers/i18n-provider";

// Form validation schema - will be created inside component to access i18n
type LoginFormValues = {
  email: string;
  password: string;
};

interface LoginFormSharedProps {
  readonly onSuccess?: () => void;
  readonly onForgotPassword?: () => void;
  readonly onOTPLogin?: () => void;
  readonly onRegister?: () => void;
  readonly onBack?: () => void;
  readonly showBackButton?: boolean;
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
}

/**
 * Shared Login Form Component
 * Can be used in both dialog and page contexts
 * Handles all login functionality with consistent UI
 */
export default function LoginFormShared({
  onSuccess,
  onForgotPassword,
  onOTPLogin,
  onRegister,
  onBack,
  showBackButton = false,
  title = "Welcome back!",
  description = "Please login to continue",
  className = "",
}: LoginFormSharedProps) {
  const { t } = useI18n();
  const {
    isLoading,
    handleEmailPasswordLogin,
    handleGoogleLogin,
    handleGithubLogin,
    handleXLogin,
  } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Create validation schema with i18n messages
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, t("emailRequired", "auth"))
      .email({ message: t("emailInvalid", "auth") }),
    password: z.string().min(6, t("passwordMinLength", "auth")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await handleEmailPasswordLogin(
      values.email,
      values.password,
    );
    if (result.success) {
      reset();
      setShowPassword(false);
      onSuccess?.();
    }
  };

  const handleGoogleClick = async () => {
    const result = await handleGoogleLogin();
    if (result.success) {
      reset();
      setShowPassword(false);
      onSuccess?.();
    }
  };

  const handleGithubClick = async () => {
    const result = await handleGithubLogin();
    if (result.success) {
      reset();
      setShowPassword(false);
      onSuccess?.();
    }
  };

  const handleXClick = async () => {
    const result = await handleXLogin();
    if (result.success) {
      reset();
      setShowPassword(false);
      onSuccess?.();
    }
  };

  const handleForgotPasswordClick = () => {
    onForgotPassword?.();
  };

  const handleOTPClick = () => {
    onOTPLogin?.();
  };

  const handleRegisterClick = () => {
    onRegister?.();
  };

  const handleBackClick = () => {
    onBack?.();
  };

  const handleEmailLoginClick = () => {
    setShowEmailForm(true);
  };

  const handleBackToSocial = () => {
    setShowEmailForm(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Back button - conditional based on view */}
      {showBackButton && !showEmailForm && (
        <button
          type="button"
          onClick={handleBackClick}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToHome", "auth")}
        </button>
      )}
      
      {showEmailForm && (
        <button
          type="button"
          onClick={handleBackToSocial}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToSocial", "auth")}
        </button>
      )}

      {/* Welcome message */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          {showEmailForm ? t("emailLoginTitle", "auth") : title}
        </h2>
        <p className="text-muted-foreground">
          {showEmailForm ? description : t("welcomeMessage", "auth")}
        </p>
      </div>

      {/* Conditional rendering based on view */}
      {!showEmailForm ? (
        <>
          {/* Social login buttons - Primary view */}
          <div className="space-y-4">
            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <GoogleIcon className="h-5 w-5" />
              <span className="font-medium text-gray-700">
                {t("loginWithGoogle", "auth")}
              </span>
            </button>

            {/* GitHub Login Button */}
            <button
              type="button"
              onClick={handleGithubClick}
              disabled={isLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <GitHubIcon className="h-5 w-5" />
              <span className="font-medium text-gray-700">
                {t("loginWithGithub", "auth")}
              </span>
            </button>

            {/* X Login Button */}
            <button
              type="button"
              onClick={handleXClick}
              disabled={isLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <XIcon className="h-5 w-5" />
              <span className="font-medium text-gray-700">
                {t("loginWithX", "auth")}
              </span>
            </button>
          </div>

          {/* Alternative login option */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("dontHaveGoogleAccount", "auth")}
            </p>
            <button
              type="button"
              onClick={handleEmailLoginClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 text-gray-700 font-medium"
            >
              <Mail className="h-4 w-4" />
              {t("loginWithEmailInstead", "auth")}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Email login form - Secondary view */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email field with icon */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailAddress", "auth")}
                  className="pl-10"
                  required
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password field with icon */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password", "auth")}
                  className="pl-10 pr-10"
                  required
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? t("hidePassword", "auth") : t("showPassword", "auth")}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
              {/* Forgot password link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={t("forgotPassword", "auth")}
                >
                  {t("forgotPassword", "auth")}
                </button>
              </div>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? t("loggingIn", "auth") : t("login", "auth")}
            </Button>
          </form>
        </>
      )}

      {/* Footer links - Only show in email form view */}
      {showEmailForm && (
        <div className="space-y-4 text-center">
          {/* OTP Login Button */}
          <div className="py-2">
            <button
              type="button"
              onClick={handleOTPClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200 text-blue-700 font-medium"
            >
              <Mail className="h-4 w-4" />
              {t("loginWithOTPInstead", "auth")}
            </button>
          </div>

          {/* Register Section */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              {t("dontHaveAccount", "auth")}
            </p>
            <button
              type="button"
              onClick={handleRegisterClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200 text-green-700 font-medium"
            >
              <Mail className="h-4 w-4" />
              {t("register", "auth")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
