"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

interface SkeletonContextType {
  // Global skeleton state for the entire app
  isGlobalSkeleton: boolean;
  // Page-specific skeleton states
  pageSkeleton: Record<string, boolean>;
  // Component-specific skeleton states
  componentSkeleton: Record<string, boolean>;

  // Actions
  setGlobalSkeleton: (loading: boolean) => void;
  setPageSkeleton: (page: string, loading: boolean) => void;
  setComponentSkeleton: (component: string, loading: boolean) => void;

  // Utility functions
  showGlobalSkeleton: () => void;
  hideGlobalSkeleton: () => void;
  showPageSkeleton: (page: string) => void;
  hidePageSkeleton: (page: string) => void;
  showComponentSkeleton: (component: string) => void;
  hideComponentSkeleton: (component: string) => void;
}

const SkeletonContext = createContext<SkeletonContextType | undefined>(
  undefined,
);

/**
 * Global Skeleton Provider
 * Manages skeleton loading states across the entire application
 */
export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isGlobalSkeleton, setIsGlobalSkeleton] = useState(false);
  const [pageSkeleton, setPageSkeletonState] = useState<
    Record<string, boolean>
  >({});
  const [componentSkeleton, setComponentSkeletonState] = useState<
    Record<string, boolean>
  >({});

  // Global skeleton actions
  const setGlobalSkeleton = useCallback((loading: boolean) => {
    setIsGlobalSkeleton(loading);
  }, []);

  const showGlobalSkeleton = useCallback(() => {
    setIsGlobalSkeleton(true);
  }, []);

  const hideGlobalSkeleton = useCallback(() => {
    setIsGlobalSkeleton(false);
  }, []);

  // Page skeleton actions
  const setPageSkeleton = useCallback((page: string, loading: boolean) => {
    setPageSkeletonState((prev) => ({
      ...prev,
      [page]: loading,
    }));
  }, []);

  const showPageSkeleton = useCallback((page: string) => {
    setPageSkeletonState((prev) => ({
      ...prev,
      [page]: true,
    }));
  }, []);

  const hidePageSkeleton = useCallback((page: string) => {
    setPageSkeletonState((prev) => ({
      ...prev,
      [page]: false,
    }));
  }, []);

  // Component skeleton actions
  const setComponentSkeleton = useCallback(
    (component: string, loading: boolean) => {
      setComponentSkeletonState((prev) => ({
        ...prev,
        [component]: loading,
      }));
    },
    [],
  );

  const showComponentSkeleton = useCallback((component: string) => {
    setComponentSkeletonState((prev) => ({
      ...prev,
      [component]: true,
    }));
  }, []);

  const hideComponentSkeleton = useCallback((component: string) => {
    setComponentSkeletonState((prev) => ({
      ...prev,
      [component]: false,
    }));
  }, []);

  const value: SkeletonContextType = {
    isGlobalSkeleton,
    pageSkeleton,
    componentSkeleton,
    setGlobalSkeleton,
    setPageSkeleton,
    setComponentSkeleton,
    showGlobalSkeleton,
    hideGlobalSkeleton,
    showPageSkeleton,
    hidePageSkeleton,
    showComponentSkeleton,
    hideComponentSkeleton,
  };

  return (
    <SkeletonContext.Provider value={value}>
      {children}
    </SkeletonContext.Provider>
  );
}

/**
 * Hook to use skeleton context
 */
export function useLoading() {
  const context = useContext(SkeletonContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

/**
 * Hook for page-specific skeleton
 */
export function usePageLoading(page: string) {
  const { pageSkeleton, showPageSkeleton, hidePageSkeleton } = useLoading();
  return {
    isLoading: pageSkeleton[page] || false,
    startLoading: () => showPageSkeleton(page),
    stopLoading: () => hidePageSkeleton(page),
  };
}

/**
 * Hook for component-specific skeleton
 */
export function useComponentLoading(component: string) {
  const { componentSkeleton, showComponentSkeleton, hideComponentSkeleton } =
    useLoading();
  return {
    isLoading: componentSkeleton[component] || false,
    startLoading: () => showComponentSkeleton(component),
    stopLoading: () => hideComponentSkeleton(component),
  };
}
