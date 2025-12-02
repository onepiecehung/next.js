"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  loginWithGoogleOneTapAction,
  storeTokens,
} from "@/lib/auth/auth-store";
import { currentUserAtom } from "@/lib/auth/auth-store";
import { auth } from "@/lib/auth/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

// Extend Window interface to include google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleOneTapConfig) => void;
          prompt: (
            callback?: (notification: PromptMomentNotification) => void,
          ) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

// Google One Tap configuration interface
interface GoogleOneTapConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: "signin" | "signup" | "use";
  ux_mode?: "popup" | "redirect";
  login_uri?: string;
  native_callback?: (response: GoogleCredentialResponse) => void;
  itp_support?: boolean;
}

// Google credential response
interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

// Prompt moment notification
interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
  getMomentType: () => string;
}

/**
 * Hook for Google One Tap authentication
 * Integrates Google Identity Services with Firebase Auth
 *
 * Features:
 * - Auto-display One Tap prompt when ready
 * - Silent credential exchange with Firebase
 * - Automatic token storage and user state update
 * - Error handling with user-friendly messages
 *
 * @param options Configuration options
 * @param options.enabled Whether to enable One Tap (default: true)
 * @param options.onSuccess Callback when login succeeds
 * @param options.onError Callback when login fails
 */
export function useGoogleOneTap({
  enabled = true,
  onSuccess,
  onError,
}: {
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const { t } = useI18n();
  const setCurrentUser = useSetAtom(currentUserAtom);
  const isInitialized = useRef(false);
  const isProcessing = useRef(false);

  /**
   * Handle the Google One Tap credential response
   * Exchanges Google credential for Firebase token, then backend token
   */
  const handleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      // Prevent multiple simultaneous processing
      if (isProcessing.current) {
        console.log("Google One Tap: Already processing a credential");
        return;
      }

      isProcessing.current = true;

      try {
        console.log("Google One Tap: Received credential");

        // Step 1: Create Firebase credential from Google ID token
        const credential = GoogleAuthProvider.credential(response.credential);

        // Step 2: Sign in to Firebase with the credential
        const userCredential = await signInWithCredential(auth, credential);
        const firebaseUser = userCredential.user;

        console.log("Google One Tap: Firebase auth successful");

        // Step 3: Get Firebase ID token
        const idToken = await firebaseUser.getIdToken();

        // Step 4: Exchange Firebase token for backend token
        const { user, token } = await loginWithGoogleOneTapAction(idToken);

        console.log("Google One Tap: Backend auth successful", user);

        // Step 5: Store tokens and update user state
        storeTokens(token.accessToken, token.refreshToken);
        setCurrentUser(user);

        // Show success message
        toast.success(t("oauth.loginSuccess", "auth") || "Login successful!");

        // Call success callback
        onSuccess?.();
      } catch (error) {
        console.error("Google One Tap: Authentication failed", error);

        // Show error message
        const errorMessage =
          error instanceof Error
            ? error.message
            : t("errors.errorGoogle", "auth") ||
              "Google login failed. Please try again.";

        toast.error(errorMessage);

        // Call error callback
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      } finally {
        isProcessing.current = false;
      }
    },
    [t, setCurrentUser, onSuccess, onError],
  );

  /**
   * Initialize Google One Tap
   * Sets up the Google Identity Services SDK
   */
  const initializeOneTap = useCallback(() => {
    // Check if script is loaded
    if (!window.google?.accounts?.id) {
      console.warn("Google One Tap: SDK not loaded yet");
      return;
    }

    // Check if already initialized
    if (isInitialized.current) {
      console.log("Google One Tap: Already initialized");
      return;
    }

    // Get client ID from environment
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("Google One Tap: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
      toast.error(
        t("errors.unknownError", "auth") ||
          "Configuration error. Please contact support.",
      );
      return;
    }

    try {
      console.log("Google One Tap: Initializing...");

      // Detect if on mobile device
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;

      console.log(
        `Google One Tap: Device type - ${isMobile ? "Mobile" : "Desktop"}`
      );

      // Initialize Google One Tap with mobile-optimized settings
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false, // Don't auto-select account
        cancel_on_tap_outside: true, // Allow dismissing by clicking outside
        context: "signin", // Context for the prompt
        // Use popup mode for desktop, let Google decide for mobile
        // Mobile may use bottom sheet or native UI
        ux_mode: isMobile ? undefined : "popup",
        itp_support: true, // Enable Intelligent Tracking Prevention support
      });

      isInitialized.current = true;
      console.log("Google One Tap: Initialized successfully");

      // Show the One Tap prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log(
            "Google One Tap: Not displayed -",
            notification.getNotDisplayedReason(),
          );
        } else if (notification.isSkippedMoment()) {
          console.log(
            "Google One Tap: Skipped -",
            notification.getSkippedReason(),
          );
        } else if (notification.isDismissedMoment()) {
          console.log(
            "Google One Tap: Dismissed -",
            notification.getDismissedReason(),
          );
        }
      });
    } catch (error) {
      console.error("Google One Tap: Initialization failed", error);
      toast.error(
        t("errors.unknownError", "auth") ||
          "Failed to initialize Google One Tap",
      );
    }
  }, [handleCredentialResponse, t]);

  /**
   * Cancel the One Tap prompt
   * Useful when user explicitly closes the login page
   */
  const cancelOneTap = useCallback(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.cancel();
      console.log("Google One Tap: Cancelled");
    }
  }, []);

  /**
   * Effect: Initialize One Tap when script loads and conditions are met
   */
  useEffect(() => {
    if (!enabled) {
      console.log("Google One Tap: Disabled");
      return;
    }

    // Wait for script to load
    const checkScript = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkScript);
        initializeOneTap();
      }
    }, 100);

    // Cleanup: Cancel prompt and clear interval
    return () => {
      clearInterval(checkScript);
      cancelOneTap();
    };
  }, [enabled, initializeOneTap, cancelOneTap]);

  return {
    /**
     * Manually trigger the One Tap prompt
     * Useful for retry scenarios
     */
    prompt: () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt();
      }
    },
    /**
     * Cancel the One Tap prompt
     */
    cancel: cancelOneTap,
    /**
     * Check if One Tap is initialized
     */
    isInitialized: isInitialized.current,
  };
}
