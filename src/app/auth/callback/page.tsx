"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { authLoadingAtom, currentUserAtom } from "@/lib/auth";
import { AuthAPI } from "@/lib/api/auth";
import { storeTokens } from "@/lib/auth/auth-store";
import { getOAuthRedirectResult } from "@/lib/auth/firebase";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * OAuth Callback Page
 * Handles OAuth redirect results from Firebase Auth
 * Supports Google, GitHub, and X (Twitter) OAuth flows
 */
export default function OAuthCallbackPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAuthLoading] = useAtom(authLoadingAtom);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        setAuthLoading(true);
        setIsProcessing(true);

        // Get the redirect result from Firebase
        const firebaseUser = await getOAuthRedirectResult();

        if (!firebaseUser) {
          // No redirect result - user might have navigated here directly
          setError(t("oauth.noRedirectResult", "auth") || "No OAuth result found");
          setAuthLoading(false);
          setIsProcessing(false);
          
          // Redirect to login after a delay
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
          return;
        }

        // Get the ID token
        const idToken = await firebaseUser.getIdToken();

        // Determine which provider was used based on providerData
        const providerId = firebaseUser.providerData[0]?.providerId;
        
        // Call backend to complete authentication
        let user;
        let token;

        if (providerId === "google.com") {
          const result = await AuthAPI.firebaseLogin({ idToken });
          user = result.user;
          token = result.token;
        } else if (providerId === "github.com") {
          const result = await AuthAPI.firebaseLogin({ idToken });
          user = result.user;
          token = result.token;
        } else if (providerId === "twitter.com") {
          const result = await AuthAPI.firebaseLogin({ idToken });
          user = result.user;
          token = result.token;
        } else {
          // Fallback: try to login with the token anyway
          const result = await AuthAPI.firebaseLogin({ idToken });
          user = result.user;
          token = result.token;
        }

        // Store tokens
        storeTokens(token.accessToken, token.refreshToken);

        // Update user state
        setUser(user);

        // Show success message
        toast.success(
          t("oauth.loginSuccess", "auth") || "Login successful!",
        );

        // Get redirect URL from query params or use home page
        const redirectUrl = searchParams.get("redirect") || "/";

        // Redirect to intended destination
        setTimeout(() => {
          router.replace(redirectUrl);
        }, 500);
      } catch (error) {
        console.error("OAuth callback error:", error);
        
        const errorMessage =
          error instanceof Error
            ? error.message
            : t("oauth.callbackError", "auth") || "OAuth callback failed";
        
        setError(errorMessage);
        toast.error(errorMessage);

        // Redirect to login after showing error
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } finally {
        setAuthLoading(false);
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [router, searchParams, setUser, setAuthLoading, t]);

  if (isProcessing) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("oauth.processing", "auth") || "Processing authentication..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="text-destructive text-lg font-semibold">
            {t("oauth.error", "auth") || "Authentication Error"}
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground">
            {t("oauth.redirectingToLogin", "auth") || "Redirecting to login page..."}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

