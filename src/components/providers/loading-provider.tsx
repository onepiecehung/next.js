"use client";

import { userProfileLoadingAtom } from "@/lib/auth";
import { useAtom } from "jotai";
import { createContext, ReactNode, useContext, useMemo } from "react";

/**
 * Loading Context Interface
 * Defines the structure for global loading state management
 */
interface LoadingContextType {
  userProfileLoading: boolean;
  setUserProfileLoading: (loading: boolean) => void;
}

/**
 * Loading Context
 * Provides global loading state management for the application
 */
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Loading Provider Component
 * Manages global loading states and provides them to child components
 * Uses Jotai atoms for state management to ensure consistency across the app
 */
export function LoadingProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [userProfileLoading, setUserProfileLoading] = useAtom(
    userProfileLoadingAtom,
  );

  const value: LoadingContextType = useMemo(
    () => ({
      userProfileLoading,
      setUserProfileLoading,
    }),
    [userProfileLoading, setUserProfileLoading],
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

/**
 * useLoading Hook
 * Custom hook to access loading context values
 * Provides type-safe access to global loading states
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
