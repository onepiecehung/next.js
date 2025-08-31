"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAtom } from "jotai";
import { userProfileLoadingAtom } from "@/lib/auth-store";

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
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [userProfileLoading, setUserProfileLoading] = useAtom(
    userProfileLoadingAtom,
  );

  const value: LoadingContextType = {
    userProfileLoading,
    setUserProfileLoading,
  };

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
