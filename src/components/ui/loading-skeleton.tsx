import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Loading skeleton component with pulse animation
 * Provides visual feedback during loading states
 */
export function LoadingSkeleton({ className, children }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Navigation loading skeleton
 * Shows while checking authentication status
 */
export function NavLoadingSkeleton() {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar skeleton */}
      <LoadingSkeleton className="h-8 w-8 rounded-full" />

      {/* Text skeleton */}
      <LoadingSkeleton className="h-4 w-20" />
    </div>
  );
}

/**
 * Card loading skeleton
 * Shows while loading content
 */
export function CardLoadingSkeleton() {
  return (
    <div className="space-y-3">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-4 w-2/3" />
    </div>
  );
}

/**
 * Button loading skeleton
 * Shows while button is in loading state
 */
export function ButtonLoadingSkeleton() {
  return <LoadingSkeleton className="h-9 w-20 rounded-md" />;
}
