"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import {
  currentUserAtom,
  accessTokenAtom,
  loginAction,
  fetchMeAction,
  loginWithGoogleAction,
  loginWithGithubAction,
  loginWithXAction,
} from "@/lib/auth-store";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";

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
 * Custom hook for handling login logic
 * Provides common login functionality for both dialog and page components
 */
export function useLogin() {
  const { t } = useI18n();
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [isLoading, setIsLoading] = useState(false);

  // Handle email/password login
  const handleEmailPasswordLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Attempt to login with provided credentials
      const user = await loginAction(email, password);

      // Update access token in Jotai state (optional, for UI sync)
      setAccessToken(null); // We keep the actual token in http layer memory

      // Fetch complete user data if not provided by login response
      const completeUser = user ?? (await fetchMeAction());
      setUser(completeUser);

      // Show success message
      toast.success(t("toastLoginSuccess", "toast") || "Login successful!");

      return { success: true, user: completeUser };
    } catch (error: unknown) {
      // Handle login errors and show appropriate error message
      const errorMessage = extractErrorMessage(
        error,
        t("loginErrorDefault", "auth") ||
          "Login failed. Please check your credentials.",
      );
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Attempt to login with Google using Firebase
      const user = await loginWithGoogleAction();

      // Update access token in Jotai state (optional, for UI sync)
      setAccessToken(null); // We keep the actual token in http layer memory

      // Set the user in state
      setUser(user);

      // Show success message
      toast.success(t("toastLoginSuccess", "toast") || "Login successful!");

      return { success: true, user };
    } catch (error: unknown) {
      // Handle specific Firebase auth errors
      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string; message: string };

        switch (firebaseError.code) {
          case "auth/cancelled-popup-request": {
            // User cancelled the popup - don't show error message
            return { success: false, error: null };
          }
          case "auth/popup-closed-by-user": {
            // User closed the popup - don't show error message
            return { success: false, error: null };
          }
          case "auth/popup-blocked": {
            const errorMessage =
              t("popupBlocked", "auth") ||
              "Popup was blocked. Please allow popups and try again.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
          case "auth/unauthorized-domain": {
            const errorMessage =
              t("unauthorizedDomain", "auth") ||
              "This domain is not authorized for Google login.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
          case "auth/account-exists-with-different-credential": {
            const errorMessage =
              t("accountExistsDifferentCredential", "auth") ||
              "An account already exists with this email using a different login method.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
          default: {
            // Show generic error for other cases
            const errorMessage = extractErrorMessage(
              error,
              t("googleLoginError", "auth") ||
                "Google login failed. Please try again.",
            );
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
        }
      } else {
        // Handle non-Firebase errors
        const errorMessage = extractErrorMessage(
          error,
          t("googleLoginError", "auth") ||
            "Google login failed. Please try again.",
        );
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle GitHub login
  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      // Attempt to login with GitHub using Firebase
      const user = await loginWithGithubAction();

      // Update access token in Jotai state (optional, for UI sync)
      setAccessToken(null); // We keep the actual token in http layer memory

      // Set the user in state
      setUser(user);

      // Show success message
      toast.success(t("toastLoginSuccess", "toast") || "Login successful!");

      return { success: true, user };
    } catch (error: unknown) {
      // Handle specific Firebase auth errors
      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string; message: string };

        switch (firebaseError.code) {
          case "auth/cancelled-popup-request": {
            // User cancelled the popup - don't show error message
            return { success: false, error: null };
          }
          case "auth/popup-closed-by-user": {
            // User closed the popup - don't show error message
            return { success: false, error: null };
          }
          case "auth/popup-blocked": {
            const errorMessage =
              t("popupBlocked", "auth") ||
              "Popup was blocked. Please allow popups and try again.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
          case "auth/unauthorized-domain": {
            const errorMessage =
              t("unauthorizedDomain", "auth") ||
              "This domain is not authorized for GitHub login.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
          case "auth/account-exists-with-different-credential": {
            const errorMessage =
              t("accountExistsDifferentCredential", "auth") ||
              "An account already exists with this email using a different login method.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
          default: {
            // Show generic error for other cases
            const errorMessage = extractErrorMessage(
              error,
              t("githubLoginError", "auth") ||
                "GitHub login failed. Please try again.",
            );
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
        }
      } else {
        // Handle non-Firebase errors
        const errorMessage = extractErrorMessage(
          error,
          t("githubLoginError", "auth") ||
            "GitHub login failed. Please try again.",
        );
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle X (Twitter) login
  const handleXLogin = async () => {
    setIsLoading(true);
    try {
      // Attempt to login with X using Firebase
      const user = await loginWithXAction();

      // Update access token in Jotai state (optional, for UI sync)
      setAccessToken(null); // We keep the actual token in http layer memory

      // Set the user in state
      setUser(user);

      // Show success message
      toast.success(t("toastLoginSuccess", "toast") || "Login successful!");

      return { success: true, user };
    } catch (error: unknown) {
      // Handle specific Firebase auth errors
      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string; message: string };

        switch (firebaseError.code) {
          case "auth/cancelled-popup-request": {
            // User cancelled the popup - don't show error message
            return { success: false, error: null };
          }
          case "auth/popup-closed-by-user": {
            // User closed the popup - don't show error message
            return { success: false, error: null };
          }
          case "auth/popup-blocked": {
            const errorMessage =
              t("popupBlocked", "auth") ||
              "Popup was blocked. Please allow popups and try again.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
          case "auth/unauthorized-domain": {
            const errorMessage =
              t("unauthorizedDomain", "auth") ||
              "This domain is not authorized for X login.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
          case "auth/account-exists-with-different-credential": {
            const errorMessage =
              t("accountExistsDifferentCredential", "auth") ||
              "An account already exists with this email using a different login method.";
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
          default: {
            // Show generic error for other cases
            const errorMessage = extractErrorMessage(
              error,
              t("xLoginError", "auth") || "X login failed. Please try again.",
            );
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
          }
        }
      } else {
        // Handle non-Firebase errors
        const errorMessage = extractErrorMessage(
          error,
          t("xLoginError", "auth") || "X login failed. Please try again.",
        );
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleEmailPasswordLogin,
    handleGoogleLogin,
    handleGithubLogin,
    handleXLogin,
  };
}
