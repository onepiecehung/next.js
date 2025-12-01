"use client";

import { LoginFormShared, OTPLoginForm } from "@/components/features/auth";
import { useI18n } from "@/components/providers/i18n-provider";
import { useAuthRedirect } from "@/hooks/auth/useAuthQuery";
import { authLoadingAtom, currentUserAtom } from "@/lib/auth";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Login Page Component
 * Uses shared LoginForm component for consistency
 */
export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [user] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  // Hydration protection: only access searchParams after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if already authenticated
  useAuthRedirect();

  const isAuthenticated = !!user;

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

  const handleLoginSuccess = () => {
    // Let useAuthRedirect handle the redirect to avoid race conditions
    // The hook will automatically redirect when user state is updated
    // No manual redirect needed here
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    console.log("Forgot password clicked");
  };

  const handleOTPLogin = () => {
    setLoginMode("otp");
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-md">
        {loginMode === "otp" ? (
          <OTPLoginForm
            onBack={() => setLoginMode("password")}
            onSuccess={handleLoginSuccess}
          />
        ) : (
          <LoginFormShared
            onSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
            onOTPLogin={handleOTPLogin}
            onRegister={handleRegister}
            onBack={handleBack}
            showBackButton={true}
            title={t("login.title", "auth") || "Welcome back!"}
            description={
              t("login.description", "auth") || "Please login to continue"
            }
          />
        )}
      </div>
    </div>
  );
}
