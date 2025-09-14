"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { EmailField, PasswordField, FormError, FormSuccess } from "./FormFields";
import { SocialButtons, SocialSeparator, SocialError } from "./SocialButtons";
import { loginSchema, LoginFormData, mapServerError, AUTH_ERRORS } from "@/lib/validators/auth";
import { useI18n } from "@/components/providers/i18n-provider";

interface LoginCardProps {
  onSubmitEmailPassword?: (data: { email: string; password: string }) => Promise<void> | void;
  onGoogle?: () => Promise<void> | void;
  onGithub?: () => Promise<void> | void;
  onForgotPassword?: () => void;
  onOTPLogin?: () => void;
  onRegister?: () => void;
  onBack?: () => void;
  className?: string;
  showBackButton?: boolean;
  title?: string;
  description?: string;
  successMessage?: string;
  serverError?: string;
  socialError?: string;
}

/**
 * Main login card component
 * Handles email/password authentication with social login options
 */
export const LoginCard: React.FC<LoginCardProps> = ({
  onSubmitEmailPassword,
  onGoogle,
  onGithub,
  onForgotPassword,
  onOTPLogin,
  onRegister,
  onBack,
  className = "",
  showBackButton = false,
  title = "Welcome back",
  description = "Enter your credentials to access your account",
  successMessage,
  serverError,
  socialError,
}) => {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  // Handle email/password form submission
  const onSubmit = async (data: LoginFormData) => {
    if (!onSubmitEmailPassword) return;

    setIsSubmitting(true);
    clearErrors("root");

    try {
      await onSubmitEmailPassword(data);
      toast.success(t("toastLoginSuccess", "toast") || "Login successful!");
    } catch (error) {
      const errorMessage = mapServerError(error);
      
      // Map common server errors to user-friendly messages
      if (errorMessage.includes("invalid") || errorMessage.includes("incorrect")) {
        setError("root", { 
          message: AUTH_ERRORS.INVALID_CREDENTIALS 
        });
      } else if (errorMessage.includes("locked")) {
        setError("root", { 
          message: AUTH_ERRORS.ACCOUNT_LOCKED 
        });
      } else if (errorMessage.includes("verify")) {
        setError("root", { 
          message: AUTH_ERRORS.EMAIL_NOT_VERIFIED 
        });
      } else if (errorMessage.includes("attempts")) {
        setError("root", { 
          message: AUTH_ERRORS.TOO_MANY_ATTEMPTS 
        });
      } else if (errorMessage.includes("network")) {
        setError("root", { 
          message: AUTH_ERRORS.NETWORK_ERROR 
        });
      } else {
        setError("root", { 
          message: AUTH_ERRORS.UNKNOWN_ERROR 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
    if (!onGoogle) return;

    setOauthLoading("google");
    try {
      await onGoogle();
      toast.success(t("toastLoginSuccess", "toast") || "Login successful!");
    } catch (error) {
      const errorMessage = mapServerError(error);
      toast.error(errorMessage);
    } finally {
      setOauthLoading(null);
    }
  };

  // Handle GitHub OAuth
  const handleGithubLogin = async () => {
    if (!onGithub) return;

    setOauthLoading("github");
    try {
      await onGithub();
      toast.success(t("toastLoginSuccess", "toast") || "Login successful!");
    } catch (error) {
      const errorMessage = mapServerError(error);
      toast.error(errorMessage);
    } finally {
      setOauthLoading(null);
    }
  };

  const isAnyLoading = isSubmitting || oauthLoading !== null;

  return (
    <Card className={`w-full max-w-sm border-muted-foreground/10 shadow-sm ${className}`}>
      <CardHeader className="space-y-1 pb-4">
        {showBackButton && onBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-4 top-4 p-2 h-auto w-auto"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <FormSuccess message={successMessage} />
        )}

        {/* Server Error */}
        {serverError && (
          <FormError error={serverError} />
        )}

        {/* Social Error */}
        {socialError && (
          <SocialError error={socialError} />
        )}

        {/* Form Error */}
        {errors.root && (
          <FormError error={errors.root.message} />
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <EmailField
            register={register}
            error={errors.email}
            disabled={isAnyLoading}
          />

          <PasswordField
            register={register}
            error={errors.password}
            disabled={isAnyLoading}
            onForgotPassword={onForgotPassword}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 text-base font-medium"
            disabled={isAnyLoading}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* Social Login Separator */}
        {(onGoogle || onGithub) && (
          <SocialSeparator />
        )}

        {/* Social Login Buttons */}
        {(onGoogle || onGithub) && (
          <SocialButtons
            onGoogle={handleGoogleLogin}
            onGithub={handleGithubLogin}
            disabled={isAnyLoading}
            oauthLoading={oauthLoading}
          />
        )}

        {/* Additional Links */}
        <div className="space-y-3 text-center">
          {/* OTP Login Link */}
          {onOTPLogin && (
            <button
              type="button"
              onClick={onOTPLogin}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              disabled={isAnyLoading}
            >
              Sign in with verification code
            </button>
          )}

          {/* Register Link */}
          {onRegister && (
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onRegister}
                className="text-primary hover:text-primary/80 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                disabled={isAnyLoading}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
