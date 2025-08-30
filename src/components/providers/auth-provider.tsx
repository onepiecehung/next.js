"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  currentUserAtom,
  authLoadingAtom,
  checkAndRefreshToken,
  fetchMeAction,
} from "@/lib/auth-store";
import { useLoading } from "./loading-provider";
import { ClientOnly } from "@/components/ui/client-only";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAuthLoading] = useAtom(authLoadingAtom);
  const { showGlobalSkeleton, hideGlobalSkeleton } = useLoading();

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        showGlobalSkeleton();

        // First check if token is valid and refresh if needed
        const isTokenValid = await checkAndRefreshToken();
        if (isTokenValid) {
          // Token is valid, fetch user data
          const user = await fetchMeAction();
          setUser(user);
        } else {
          // Token is invalid and refresh failed, clear state
          setUser(null);
        }
      } catch {
        // User is not authenticated, clear state
        setUser(null);
      } finally {
        setAuthLoading(false);
        hideGlobalSkeleton();
      }
    };

    checkAuth();
  }, [setUser, setAuthLoading]);

  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      {children}
    </ClientOnly>
  );
}
