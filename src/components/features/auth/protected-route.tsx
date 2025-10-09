"use client";

import { useRequireAuth } from "@/hooks/auth";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
  readonly fallback?: React.ReactNode;
}

/**
 * Protected Route Component
 * Wraps components that require authentication
 * Automatically redirects to login if user is not authenticated
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, authLoading } = useRequireAuth();

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      fallback || (
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  // Don't render children if user is not authenticated
  // The useRequireAuth hook will handle the redirect
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
