"use client";

import { useLoading } from "@/components/providers/loading-provider";
import { LoadingSkeleton } from "./loading-skeleton";

/**
 * Global Skeleton Overlay
 * Shows when the entire application is in a skeleton loading state
 */
export function GlobalLoadingOverlay() {
  const { isGlobalSkeleton } = useLoading();

  if (!isGlobalSkeleton) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 p-8 rounded-lg bg-card border shadow-lg">
        {/* App Logo/Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Medium-ish
          </h1>
          <p className="text-muted-foreground">Loading your experience...</p>
        </div>

        {/* Skeleton Loading Animation */}
        <div className="space-y-4 w-full max-w-sm">
          {/* Header skeleton */}
          <div className="flex items-center space-x-4">
            <LoadingSkeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <LoadingSkeleton className="h-4 w-3/4" />
              <LoadingSkeleton className="h-3 w-1/2" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-4 w-5/6" />
            <LoadingSkeleton className="h-4 w-4/6" />
          </div>

          {/* Button skeleton */}
          <LoadingSkeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Page Skeleton Overlay
 * Shows when a specific page is in skeleton loading state
 */
export function PageLoadingOverlay({ page }: { page: string }) {
  const { pageSkeleton } = useLoading();
  const isLoading = pageSkeleton[page];

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 p-6 rounded-lg bg-card border shadow-lg">
        {/* Page-specific skeleton */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Loading {page}
          </h2>
          <p className="text-sm text-muted-foreground">Please wait...</p>
        </div>

        {/* Page skeleton content */}
        <div className="space-y-4 w-full max-w-md">
          <LoadingSkeleton className="h-6 w-full" />
          <LoadingSkeleton className="h-4 w-3/4" />
          <LoadingSkeleton className="h-4 w-5/6" />
          <LoadingSkeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

/**
 * Component Skeleton Overlay
 * Shows when a specific component is in skeleton loading state
 */
export function ComponentLoadingOverlay({
  component,
  children,
}: {
  component: string;
  children?: React.ReactNode;
}) {
  const { componentSkeleton } = useLoading();
  const isLoading = componentSkeleton[component];

  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {/* Skeleton overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-md">
        <div className="flex flex-col items-center gap-3 p-4">
          <div className="space-y-2">
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Original content (dimmed) */}
      <div className="opacity-50 pointer-events-none">{children}</div>
    </div>
  );
}
