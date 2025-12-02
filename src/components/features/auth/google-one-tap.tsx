"use client";

import { useGoogleOneTap } from "@/hooks/auth/useGoogleOneTap";

/**
 * Google One Tap Component
 *
 * Displays Google One Tap authentication prompt automatically when:
 * - User is not authenticated
 * - Google Identity Services script is loaded
 * - User hasn't explicitly dismissed the prompt
 *
 * Features:
 * - Auto-display in top-right corner
 * - One-click authentication with Google accounts
 * - Silent credential exchange with Firebase
 * - Automatic token storage and user state update
 * - No UI needed - Google renders the prompt
 *
 * Usage:
 * ```tsx
 * <GoogleOneTap
 *   enabled={!isAuthenticated}
 *   onSuccess={() => router.push('/dashboard')}
 * />
 * ```
 *
 * Environment requirements:
 * - NEXT_PUBLIC_GOOGLE_CLIENT_ID must be set
 * - Google Identity Services script must be loaded in layout
 *
 * @param props Component properties
 * @param props.enabled Whether to enable One Tap (default: true)
 * @param props.onSuccess Callback when login succeeds
 * @param props.onError Callback when login fails
 */
export default function GoogleOneTap({
  enabled = true,
  onSuccess,
  onError,
}: {
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  // Initialize Google One Tap
  useGoogleOneTap({
    enabled,
    onSuccess,
    onError,
  });

  // This component renders nothing - Google One Tap UI is managed by Google SDK
  return null;
}
