"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, Button } from "@/components/ui";
import { useI18n } from "@/components/providers/i18n-provider";
import SignupForm from "./signup-form";
import OTPLoginForm from "./otp-login-form";
import LoginFormShared from "./login-form-shared";

/**
 * Internationalized Login Dialog Component
 * Uses shared LoginForm component for consistency
 */
export default function LoginDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setShowSignup(false); // Reset to login view when dialog closes
      setLoginMode("password"); // Reset to password login mode
    }
  };

  const handleLoginSuccess = () => {
    setOpen(false);
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    console.log("Forgot password clicked");
  };

  const handleOTPLogin = () => {
    setLoginMode("otp");
  };

  const handleRegister = () => {
    setShowSignup(true);
  };

  const handleBack = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("loginButton", "auth")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {(() => {
          if (showSignup) {
            return <SignupForm onBackToLogin={() => setShowSignup(false)} />;
          }
          if (loginMode === "otp") {
            return (
              <OTPLoginForm
                onBack={() => setLoginMode("password")}
                onSuccess={handleLoginSuccess}
              />
            );
          }
          return (
            <LoginFormShared
              onSuccess={handleLoginSuccess}
              onForgotPassword={handleForgotPassword}
              onOTPLogin={handleOTPLogin}
              onRegister={handleRegister}
              onBack={handleBack}
              showBackButton={true}
              title="Welcome back!"
              description="Please login to continue"
            />
          );
        })()}
      </DialogContent>
    </Dialog>
  );
}
