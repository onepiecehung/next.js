"use client";

import React from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

/**
 * Skeleton component for text loading state
 */
function TextSkeleton({
  className,
  width = "8ch",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block h-4 rounded bg-muted animate-pulse",
        className,
      )}
      style={{ width }}
      aria-hidden="true"
      aria-label="Loading..."
    />
  );
}

/**
 * Hook to get translated text with loading state
 *
 * Returns the translation and a flag indicating if it's still loading.
 * Useful when you need more control over the loading state.
 */
export function useTranslatedText(
  i18nKey: string,
  namespace?: string,
  variables?: Record<string, unknown>,
  fallback?: string,
) {
  const { t, isLoading, isReady } = useI18n();
  const translation = t(i18nKey, namespace, variables, fallback);

  // Consider still loading only when messages are not ready yet
  // Translation not found (translation === key) is NOT a loading state,
  // it's a missing translation error (which should show fallback or key)
  const isStillLoading = !isReady || isLoading;

  return {
    text: translation,
    isLoading: isStillLoading,
  };
}

/**
 * TranslatedText component with skeleton fallback
 *
 * This component automatically shows a skeleton placeholder when translations
 * are still loading, instead of displaying the i18n key. This provides a better
 * UX on slow networks.
 *
 * Best practices:
 * - Always provide a fallback text for critical UI elements
 * - Use skeleton for non-critical text that can wait
 * - Skeleton width should approximate the final text width
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TranslatedText
 *   i18nKey="searchPlaceholder"
 *   namespace="series"
 * />
 *
 * // With fallback text
 * <TranslatedText
 *   i18nKey="searchPlaceholder"
 *   namespace="series"
 *   fallback="Search..."
 * />
 *
 * // Custom skeleton width
 * <TranslatedText
 *   i18nKey="title"
 *   namespace="home"
 *   skeletonWidth="12ch"
 * />
 * ```
 */
interface TranslatedTextProps {
  /** i18n key to translate */
  i18nKey: string;
  /** Namespace for the translation */
  namespace?: string;
  /** Variables to interpolate in the translation */
  variables?: Record<string, unknown>;
  /** Fallback text if translation is not found (prevents skeleton) */
  fallback?: string;
  /** Custom className for the text element */
  className?: string;
  /** Custom className for the skeleton */
  skeletonClassName?: string;
  /** Custom skeleton width (default: "8ch") */
  skeletonWidth?: string;
  /** HTML tag to render (default: "span") */
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function TranslatedText({
  i18nKey,
  namespace = "common",
  variables,
  fallback,
  className,
  skeletonClassName,
  skeletonWidth = "8ch",
  as: Component = "span",
}: TranslatedTextProps) {
  const { text, isLoading } = useTranslatedText(
    i18nKey,
    namespace,
    variables,
    fallback,
  );

  // Show skeleton when loading and no fallback provided
  // If fallback is provided, show it immediately (better UX than skeleton)
  if (isLoading && !fallback) {
    return (
      <TextSkeleton
        className={cn(skeletonClassName, className)}
        width={skeletonWidth}
      />
    );
  }

  // If translation equals key (not found) and no fallback, still show skeleton
  // to avoid showing the raw key to users
  if (!isLoading && text === i18nKey && !fallback) {
    return (
      <TextSkeleton
        className={cn(skeletonClassName, className)}
        width={skeletonWidth}
      />
    );
  }

  return <Component className={className}>{text}</Component>;
}
