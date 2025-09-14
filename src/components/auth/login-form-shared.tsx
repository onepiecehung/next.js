"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { GoogleIcon, GitHubIcon, XIcon } from "@/components/ui/icons";
import { useLogin } from "@/hooks/useLogin";

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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
  const { isLoading, handleEmailPasswordLogin, handleGoogleLogin, handleGithubLogin, handleXLogin } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await handleEmailPasswordLogin(values.email, values.password);
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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Back to home button */}
      {showBackButton && (
        <button
          type="button"
          onClick={handleBackClick}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </button>
      )}

      {/* Welcome message */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email field with icon */}
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              className="pl-10"
              required
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password field with icon */}
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10"
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
          {/* Forgot password link */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Forgot your password"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Login button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 text-gray-500 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social login buttons */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={isLoading || isSubmitting}
          className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          title="Login with Google"
        >
          <GoogleIcon className="h-6 w-6" />
        </button>
        
        <button
          type="button"
          onClick={handleGithubClick}
          disabled={isLoading || isSubmitting}
          className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          title="Login with GitHub"
        >
          <GitHubIcon className="h-6 w-6" />
        </button>
        
        <button
          type="button"
          onClick={handleXClick}
          disabled={isLoading || isSubmitting}
          className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          title="Login with X"
        >
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Footer links */}
      <div className="space-y-4 text-center">
        {/* OTP Login Link */}
        <div className="py-2">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
            onClick={handleOTPClick}
          >
            Login with OTP instead
          </button>
        </div>
        
        {/* Register Link */}
        <div className="text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
