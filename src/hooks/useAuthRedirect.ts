"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { currentUserAtom, authLoadingAtom } from "@/lib/auth-store";

/**
 * Custom hook for handling authentication redirects
 * Uses Next.js 15's modern navigation approach
 */
export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) return;

    // If user is authenticated, redirect to home or intended destination
    if (user) {
      const redirectUrl = searchParams.get('redirect') || '/';
      router.push(redirectUrl);
    }
  }, [user, authLoading, router, searchParams]);

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
