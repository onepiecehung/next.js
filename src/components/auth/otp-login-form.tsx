"use client";

import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
  currentUserAtom,
  accessTokenAtom,
  requestOTPAction,
  verifyOTPAction,
} from "@/lib/auth-store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import {
  Button,
  Input,
  Label,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui";
import { useI18n } from "@/components/providers/i18n-provider";

// Form validation schemas
const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" }),
});

const otpSchema = z.object({
  code: z
    .string()
    .min(6, "OTP code must be 6 digits")
    .max(6, "OTP code must be 6 digits")
    .regex(/^\d{6}$/, "OTP code must contain only digits"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

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

interface OTPLoginFormProps {
  readonly onBack: () => void;
  readonly onSuccess: () => void;
}

/**
 * OTP Login Form Component
 * Handles two-step OTP authentication: email → OTP verification
 */
export default function OTPLoginForm({ onBack, onSuccess }: OTPLoginFormProps) {
  const { t } = useI18n();
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);

  // State management
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [requestId, setRequestId] = useState("");
  const [, setExpiresIn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  // OTP form
  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
  });

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle OTP verification (Step 2) - moved up to avoid temporal dead zone
  const handleOTPSubmit = React.useCallback(
    async (values: OTPFormValues) => {
      setIsLoading(true);
      try {
        const user = await verifyOTPAction(email, values.code, requestId);

        setUser(user);
        setAccessToken(null); // Token is stored in http layer

        toast.success(t("otpVerifySuccess", "auth") || "Login successful!");

        onSuccess();
      } catch (error: unknown) {
        const errorMessage = extractErrorMessage(
          error,
          t("otpVerifyError", "auth") || "Invalid OTP code. Please try again.",
        );
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [email, requestId, onSuccess, t],
  );

  // Auto-submit when OTP is complete
  const otpCode = otpForm.watch("code");
  useEffect(() => {
    if (otpCode && otpCode.length === 6 && !isLoading) {
      // Small delay to ensure the UI updates
      const timer = setTimeout(() => {
        otpForm.handleSubmit(handleOTPSubmit)();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [otpCode, isLoading, otpForm, handleOTPSubmit]);

  // Handle email submission (Step 1)
  const handleEmailSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    try {
      const result = await requestOTPAction(values.email);

      setEmail(values.email);
      setRequestId(result.requestId);
      setExpiresIn(result.expiresIn);
      setCountdown(result.expiresIn);
      setStep("otp");

      toast.success(
        t("otpSentSuccess", "auth") ||
          `OTP code has been sent to ${values.email}`,
      );
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(
        error,
        t("otpRequestError", "auth") || "Failed to send OTP. Please try again.",
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  // Handle resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await requestOTPAction(email);

      setRequestId(result.requestId);
      setExpiresIn(result.expiresIn);
      setCountdown(result.expiresIn);

      toast.success(
        t("otpResentSuccess", "auth") || "OTP code has been resent",
      );
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(
        error,
        t("otpResendError", "auth") ||
          "Failed to resend OTP. Please try again.",
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back to email step
  const handleBackToEmail = () => {
    setStep("email");
    setEmail("");
    setRequestId("");
    setExpiresIn(0);
    setCountdown(0);
    emailForm.reset();
    otpForm.reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">
          {step === "email"
            ? t("otpLoginTitle", "auth") || "Login with OTP"
            : t("otpVerifyTitle", "auth") || "Verify OTP Code"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === "email"
            ? t("otpLoginDescription", "auth") ||
              "Enter your email to receive a verification code"
            : t("otpVerifyDescription", "auth") ||
              `Enter the 6-digit code sent to ${email}`}
        </p>
      </div>

      {/* Email Step */}
      {step === "email" && (
        <form
          onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">{t("email", "auth") || "Email"}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder", "auth") || "you@example.com"}
              {...emailForm.register("email")}
              disabled={isLoading}
            />
            {emailForm.formState.errors.email && (
              <p className="text-sm text-red-500">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back", "common") || "Back"}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading
                ? t("sending", "auth") || "Sending..."
                : t("sendOTP", "auth") || "Send OTP"}
            </Button>
          </div>
        </form>
      )}

      {/* OTP Step */}
      {step === "otp" && (
        <form
          onSubmit={otpForm.handleSubmit(handleOTPSubmit)}
          className="space-y-4"
        >
          <div className="space-y-4">
            <Label htmlFor="code" className="text-center block">
              {t("otpCode", "auth") || "OTP Code"}
            </Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpForm.watch("code") || ""}
                onChange={(value) => otpForm.setValue("code", value)}
                disabled={isLoading}
                className="gap-2"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {otpForm.formState.errors.code && (
              <p className="text-sm text-red-500 text-center">
                {otpForm.formState.errors.code.message}
              </p>
            )}
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("otpResendIn", "auth") || "Resend code in"} {countdown}s
              </p>
            ) : (
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("resendOTP", "auth") || "Resend OTP"}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToEmail}
              className="flex-1"
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back", "common") || "Back"}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading
                ? t("verifying", "auth") || "Verifying..."
                : t("verifyOTP", "auth") || "Verify OTP"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
