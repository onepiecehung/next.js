"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  currentUserAtom,
  authLoadingAtom,
  checkAndRefreshToken,
  fetchMeAction,
} from "@/lib/auth-store";
import { ClientOnly } from "@/components/ui";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAuthLoading] = useAtom(authLoadingAtom);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        setAuthLoading(true);

        // Check if user is already authenticated on app load
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
