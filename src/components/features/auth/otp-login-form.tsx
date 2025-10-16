"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Button,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Label,
} from "@/components/ui";
import { useLogin } from "@/hooks/auth/useAuthQuery";
import { requestOTPAction } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Form validation schemas factory
const createEmailSchema = (t: (key: string, ns?: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation.emailRequired", "auth"))
      .email({ message: t("validation.emailInvalid", "auth") }),
  });

const createOtpSchema = (t: (key: string, ns?: string) => string) =>
  z.object({
    code: z
      .string()
      .min(6, t("validation.otpRequired", "auth"))
      .max(6, t("validation.otpInvalid", "auth"))
      .regex(/^\d{6}$/, t("validation.otpNumbersOnly", "auth")),
  });

type EmailFormValues = {
  email: string;
};

type OTPFormValues = {
  code: string;
};

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

  // Use React Query login hook
  const { handleOTPLogin, isOTPLoading: isLoggingIn } = useLogin();

  // State management
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [requestId, setRequestId] = useState("");
  const [, setExpiresIn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(createEmailSchema(t)),
  });

  // OTP form
  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(createOtpSchema(t)),
  });

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Format countdown display (minutes and seconds)
  const formatCountdown = (seconds: number): string => {
    if (seconds <= 0) return "0s";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return remainingSeconds > 0
        ? `${minutes}p${remainingSeconds}s`
        : `${minutes}p`;
    }

    return `${remainingSeconds}s`;
  };

  // Handle OTP verification (Step 2) - moved up to avoid temporal dead zone
  const handleOTPSubmit = React.useCallback(
    async (values: OTPFormValues) => {
      try {
        await handleOTPLogin({
          email,
          code: values.code,
          requestId,
        });
        toast.success(t("toastLoginSuccess", "toast"));
        onSuccess();
      } catch (error) {
        // Error handling is already done in the mutation
        console.error("OTP verification failed:", error);
      }
    },
    [email, requestId, onSuccess, t, handleOTPLogin],
  );

  // Auto-submit when OTP is complete
  const otpCode = otpForm.watch("code");
  useEffect(() => {
    if (otpCode && otpCode.length === 6 && !isLoggingIn) {
      // Small delay to ensure the UI updates
      const timer = setTimeout(() => {
        otpForm.handleSubmit(handleOTPSubmit)();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [otpCode, isLoggingIn, otpForm, handleOTPSubmit]);

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
        t("toastOTPSentDescription", "toast", { email: values.email }),
      );
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(
        error,
        t("toastOTPRequestError", "toast"),
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

      toast.success(t("toastOTPResentSuccess", "toast"), {
        description: t("toastOTPResentDescription", "toast", { email }),
      });
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
            ? t("otp.loginTitle", "auth")
            : t("otp.verifyTitle", "auth")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === "email"
            ? t("otp.loginDescription", "auth") ||
              "Enter your email to receive a verification code"
            : t("otp.verifyDescription", "auth", { email })}
        </p>
      </div>

      {/* Email Step */}
      {step === "email" && (
        <form
          onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">{t("fields.email", "common")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("placeholders.email", "common")}
              className="h-12"
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
              {t("actions.back", "common")}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? t("otp.sending", "auth") : t("otp.send", "auth")}
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
              {t("otp.code", "auth")}
            </Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpForm.watch("code") || ""}
                onChange={(value) => otpForm.setValue("code", value)}
                disabled={isLoggingIn}
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
                {t("otp.resendIn", "auth")} {formatCountdown(countdown)}
              </p>
            ) : (
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={isLoggingIn}
                className="text-sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("otp.resend", "auth")}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToEmail}
              className="flex-1"
              disabled={isLoggingIn}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("actions.back", "common")}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoggingIn}>
              {isLoggingIn
                ? t("otp.verifying", "auth")
                : t("otp.verify", "auth")}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
