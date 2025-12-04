"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from "@/components/ui";
import { useState } from "react";
import LoginFormShared from "./login-form-shared";
import OTPLoginForm from "./otp-login-form";
import SignupForm from "./signup-form";

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
        <Button variant="outline">{t("login.button", "auth")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>
            {(() => {
              if (showSignup) return t("register.title", "auth");
              if (loginMode === "otp") return t("otp.loginTitle", "auth");
              return t("login.title", "auth");
            })()}
          </DialogTitle>
          <DialogDescription>
            {(() => {
              if (showSignup) return t("register.cardDescription", "auth");
              if (loginMode === "otp") return t("otp.loginDescription", "auth");
              return t("login.cardDescription", "auth");
            })()}
          </DialogDescription>
        </VisuallyHidden>
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
              title={t("login.cardTitle", "auth")}
              description={t("login.cardDescription", "auth")}
            />
          );
        })()}
      </DialogContent>
    </Dialog>
  );
}
