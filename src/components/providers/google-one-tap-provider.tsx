"use client";

import { GoogleOneTap } from "@/components/features/auth";
import { currentUserAtom } from "@/lib/auth/auth-store";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Global Google One Tap Provider
 * 
 * Shows Google One Tap on ALL pages except:
 * - When user is already authenticated
 * - On auth pages (login, register) - to avoid duplicate prompts
 * - On pages where it might be intrusive (optional)
 * 
 * Features:
 * - Auto-hide when user logs in
 * - Auto-show when user logs out
 * - Smart page detection
 * - Configurable excluded paths
 * 
 * Usage:
 * Add to app/layout.tsx inside providers:
 * ```tsx
 * <GoogleOneTapProvider />
 * ```
 */
export default function GoogleOneTapProvider() {
  const [currentUser] = useAtom(currentUserAtom);
  const pathname = usePathname();
  const router = useRouter();
  const [shouldShow, setShouldShow] = useState(false);

  /**
   * List of paths where One Tap should NOT appear
   * Customize this list based on your needs
   */
  const excludedPaths = [
    "/auth/login",      // Login page already has One Tap
    "/auth/register",   // Register page
    "/auth/callback",   // OAuth callback
    // Add more paths as needed:
    // "/checkout",     // Don't interrupt checkout
    // "/payment",      // Don't interrupt payment
  ];

  /**
   * Check if current path should show One Tap
   */
  useEffect(() => {
    // Don't show if user is authenticated
    if (currentUser) {
      setShouldShow(false);
      return;
    }

    // Don't show on excluded paths
    const isExcluded = excludedPaths.some((path) =>
      pathname?.startsWith(path)
    );

    if (isExcluded) {
      setShouldShow(false);
      return;
    }

    // Show on all other pages when not authenticated
    // Note: Mobile detection is handled by Google SDK
    // One Tap will automatically adapt for mobile devices
    setShouldShow(true);
  }, [currentUser, pathname]);

  /**
   * Handle successful login
   * Redirect to current page (refresh) to update auth state
   */
  const handleSuccess = () => {
    // User will be redirected automatically by useAuthRedirect hook
    // Or refresh current page to update state
    router.refresh();
  };

  /**
   * Handle login error
   * Just log it, user can try again
   */
  const handleError = (error: Error) => {
    console.error("Google One Tap error:", error);
    // Optionally show a toast notification
    // toast.error("Login failed. Please try again.");
  };

  // Only render when should show
  if (!shouldShow) {
    return null;
  }

  return (
    <GoogleOneTap
      enabled={shouldShow}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}

