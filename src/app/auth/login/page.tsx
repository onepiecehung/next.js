"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { currentUserAtom, authLoadingAtom } from "@/lib/auth-store";
import { useI18n } from "@/components/providers/i18n-provider";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { LoginFormShared } from "@/components/features/auth";
import { OTPLoginForm } from "@/components/features/auth";

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
    // Redirect will be handled by useAuthRedirect hook
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
            title={t("loginTitle", "auth") || "Welcome back!"}
            description={
              t("loginSubtitle", "auth") || "Please login to continue"
            }
          />
        )}
      </div>
    </div>
  );
}
