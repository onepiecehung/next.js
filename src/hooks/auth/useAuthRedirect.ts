"use client";

import { authLoadingAtom, currentUserAtom } from "@/lib/auth";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

/**
 * Custom hook for handling authentication redirects
 * Uses Next.js 15's modern navigation approach
 */
export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const [hasRedirected, setHasRedirected] = React.useState(false);

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) {
      console.log("Auth is loading, waiting...");
      return;
    }

    // If user is authenticated, redirect to home or intended destination
    if (user && !hasRedirected) {
      const redirectUrl = searchParams.get("redirect") || "/";
      console.log(
        "User authenticated, current path:",
        window.location.pathname,
        "redirect to:",
        redirectUrl,
      );
      // Only redirect if we're not already on the target page
      if (window.location.pathname !== redirectUrl) {
        console.log("Redirecting to:", redirectUrl);
        setHasRedirected(true);
        router.push(redirectUrl);
      } else {
        console.log("Already on target page, no redirect needed");
        setHasRedirected(true);
      }
    } else if (!user) {
      console.log("User not authenticated");
      setHasRedirected(false);
    }
  }, [user, authLoading, router, searchParams, hasRedirected]);

  return {
    user,
    authLoading,
    isAuthenticated: !!user,
  };
}

/**
 * Custom hook for protecting routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function useRequireAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      const currentPath = window.location.pathname;
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [user, authLoading, router, searchParams]);

  return {
    user,
    authLoading,
    isAuthenticated: !!user,
  };
}
