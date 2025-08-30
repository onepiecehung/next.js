"use client";

import { useLoading } from "@/components/providers/loading-provider";
import { LoadingSkeleton } from "./loading-skeleton";

/**
 * Global Skeleton Overlay
 * Shows when the entire application is in a skeleton loading state
 * This replaces the entire page content with a full-screen skeleton
 */
export function GlobalLoadingOverlay() {
  const { isGlobalSkeleton } = useLoading();

  if (!isGlobalSkeleton) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Full-screen skeleton layout */}
      <div className="min-h-screen flex flex-col">
        {/* Header skeleton */}
        <header className="border-b bg-background">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            {/* Logo skeleton */}
            <LoadingSkeleton className="h-8 w-32" />
            
            {/* Right side actions skeleton */}
            <div className="flex items-center gap-3">
              {/* Theme toggle skeleton */}
              <LoadingSkeleton className="h-9 w-9 rounded-md" />
              {/* User action skeleton */}
              <LoadingSkeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </header>

        {/* Main content skeleton */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-4xl">
            {/* Page title skeleton */}
            <div className="mb-8">
              <LoadingSkeleton className="h-12 w-64 mb-4" />
              <LoadingSkeleton className="h-6 w-96" />
            </div>

            {/* Content grid skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Card skeletons */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4 p-6 border rounded-lg bg-card">
                  <LoadingSkeleton className="h-48 w-full rounded-md" />
                  <div className="space-y-2">
                    <LoadingSkeleton className="h-6 w-3/4" />
                    <LoadingSkeleton className="h-4 w-full" />
                    <LoadingSkeleton className="h-4 w-5/6" />
                  </div>
                  <div className="flex gap-2">
                    <LoadingSkeleton className="h-8 w-20 rounded-md" />
                    <LoadingSkeleton className="h-8 w-16 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer skeleton */}
        <footer className="border-t bg-background py-6">
          <div className="mx-auto max-w-4xl px-4">
            <div className="flex justify-between items-center">
              <LoadingSkeleton className="h-6 w-32" />
              <div className="flex gap-4">
                <LoadingSkeleton className="h-6 w-20" />
                <LoadingSkeleton className="h-6 w-24" />
                <LoadingSkeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/**
 * Page Skeleton Overlay
 * Shows when a specific page is in skeleton loading state
 * This replaces the entire page content with a full-page skeleton
 */
export function PageLoadingOverlay({ page }: { page: string }) {
  const { pageSkeleton } = useLoading();
  const isLoading = pageSkeleton[page];

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-40 bg-background">
      {/* Full-page skeleton layout */}
      <div className="min-h-screen flex flex-col">
        {/* Header skeleton (same as global) */}
        <header className="border-b bg-background">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <LoadingSkeleton className="h-8 w-32" />
            <div className="flex items-center gap-3">
              <LoadingSkeleton className="h-9 w-9 rounded-md" />
              <LoadingSkeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </header>

        {/* Page-specific content skeleton */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-4xl">
            {/* Page title */}
            <div className="mb-8">
              <LoadingSkeleton className="h-10 w-48 mb-4" />
              <LoadingSkeleton className="h-5 w-80" />
            </div>

            {/* Page content skeleton */}
            <div className="space-y-6">
              {/* Main content area */}
              <div className="space-y-4">
                <LoadingSkeleton className="h-6 w-full" />
                <LoadingSkeleton className="h-6 w-5/6" />
                <LoadingSkeleton className="h-6 w-4/6" />
                <LoadingSkeleton className="h-6 w-full" />
                <LoadingSkeleton className="h-6 w-3/4" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <LoadingSkeleton className="h-10 w-28 rounded-md" />
                <LoadingSkeleton className="h-10 w-24 rounded-md" />
              </div>

              {/* Additional content sections */}
              <div className="grid gap-4 md:grid-cols-2 pt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <LoadingSkeleton className="h-5 w-32 mb-3" />
                    <LoadingSkeleton className="h-4 w-full mb-2" />
                    <LoadingSkeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * Component Skeleton Overlay
 * Shows when a specific component is in skeleton loading state
 * This shows a skeleton overlay on top of the component content
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
