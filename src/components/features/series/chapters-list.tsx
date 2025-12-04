"use client";

import { BookOpen, EyeOff, Globe, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import { useSeriesSegmentsInfinite } from "@/hooks/series";
import type { SeriesSegment } from "@/lib/interface/series.interface";
import type { PaginationCursor } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Format relative time helper
 * Handles both Date objects and date strings (ISO format)
 */
function formatRelativeTime(
  date: Date | string | undefined,
  t: (key: string, ns?: string) => string,
): string {
  if (!date) return t("justNow", "series");

  // Convert to Date object if it's a string
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Validate date
  if (isNaN(dateObj.getTime())) {
    return t("justNow", "series");
  }

  const minutes = Math.floor((Date.now() - dateObj.getTime()) / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return t("justNow", "series");
  if (minutes < 60)
    return t("minutesAgo", "series").replace("{{value}}", minutes.toString());
  if (hours < 24)
    return t("hoursAgo", "series").replace("{{value}}", hours.toString());
  return t("daysAgo", "series").replace("{{value}}", days.toString());
}

/**
 * Segment Item Component
 * Individual segment card in the list
 */
interface SegmentItemProps {
  segment: SeriesSegment;
  t: (key: string, ns?: string) => string;
}

function SegmentItem({ segment, t }: SegmentItemProps) {
  // Format segment number with sub-number if exists
  const segmentNumber = segment.subNumber
    ? `${segment.number}.${segment.subNumber}`
    : segment.number.toString();

  // Format status badge
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      active: { label: t("segments.status.active", "series"), variant: "default" },
      pending: { label: t("segments.status.pending", "series"), variant: "secondary" },
      inactive: { label: t("segments.status.inactive", "series"), variant: "outline" },
      archived: { label: t("segments.status.archived", "series"), variant: "outline" },
    };
    return statusMap[status] || { label: status, variant: "outline" };
  };

  const statusInfo = getStatusBadge(segment.status);

  return (
    <Link
      href={`/segments/${segment.id}`}
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border bg-card transition-colors hover:bg-accent/50 cursor-pointer group"
    >
      {/* Segment Number Badge */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
          <span className="text-sm sm:text-base font-semibold text-primary">
            {segmentNumber}
          </span>
        </div>
      </div>

      {/* Segment Info */}
      <div className="flex-1 min-w-0">
        {/* Chapter Number: Title */}
        <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary line-clamp-1 transition-colors mb-1">
          {segment.title
            ? `${t("chapters.title", "series")} ${segmentNumber}: ${segment.title}`
            : `${t("chapters.title", "series")} ${segmentNumber}`}
        </h3>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
          {/* Status Badge */}
          <Badge variant={statusInfo.variant} className="text-[10px] sm:text-xs">
            {statusInfo.label}
          </Badge>

          {/* NSFW Badge */}
          {segment.isNsfw && (
            <Badge variant="destructive" className="text-[9px] sm:text-[10px] px-1.5 py-0.5 h-auto">
              <EyeOff className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-0.5" />
              NSFW
            </Badge>
          )}

          {/* Access Type */}
          {segment.accessType && (
            <Badge
              variant={segment.accessType === "free" ? "default" : "outline"}
              className={cn(
                "text-[10px] sm:text-xs",
                segment.accessType === "free" &&
                  "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20",
              )}
            >
              {t(`segments.accessType.${segment.accessType}`, "series") ||
                segment.accessType}
            </Badge>
          )}

          {/* Language */}
          {segment.languageCode && (
            <span className="text-[10px] sm:text-xs">
              {segment.languageCode.toUpperCase()}
            </span>
          )}

          {/* Page Count (for chapter segments) */}
          {segment.type === "chapter" && segment.pageCount && (
            <span className="text-[10px] sm:text-xs">
              {segment.pageCount} {t("segments.pages", "series") || "pages"}
            </span>
          )}

          {/* Duration (for episodes) */}
          {segment.type === "episode" && segment.durationSec && (
            <span className="text-[10px] sm:text-xs">
              {Math.floor(segment.durationSec / 60)} {t("segments.minutes", "series") || "min"}
            </span>
          )}
        </div>

        {/* Additional Info Row - Updated time and Upload by */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-[10px] sm:text-xs text-muted-foreground">
          {/* Updated Time */}
          {segment.updatedAt && (
            <span className="flex items-center gap-1">
              {t("chapters.updatedAt", "series") || "Updated"}:{" "}
              {formatRelativeTime(segment.updatedAt, t)}
            </span>
          )}

          {/* Upload By */}
          {segment.user && (
            <span className="flex items-center gap-1">
              {t("chapters.uploadBy", "series") || "Upload by"}:{" "}
              <span className="font-medium text-foreground">
                {segment.user.name || segment.user.username || segment.user.email?.split("@")[0] || "Unknown"}
              </span>
            </span>
          )}
        </div>

        {/* Description (if available) */}
        {segment.description && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1.5">
            {segment.description}
          </p>
        )}
      </div>

      {/* Read Button */}
      <div className="flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex"
          onClick={(e) => {
            e.preventDefault();
            // Navigation handled by Link wrapper
          }}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          {t("actions.read", "series")}
        </Button>
      </div>
    </Link>
  );
}

/**
 * Segments List Component with Infinite Scroll
 * Loads segments using cursor-based pagination
 */
interface ChaptersListProps {
  seriesId: string;
  enabled: boolean;
  className?: string;
}

export function ChaptersList({
  seriesId,
  enabled,
  className,
}: ChaptersListProps) {
  const { t } = useI18n();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  // Fetch segments with infinite scroll
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useSeriesSegmentsInfinite(
    seriesId,
    enabled,
    selectedLanguage === "all" ? undefined : selectedLanguage,
  );

  // Flatten all pages into a single array
  const segments =
    data?.pages.flatMap(
      (page) => (page as PaginationCursor<SeriesSegment>).result,
    ) ?? [];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!enabled || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before reaching the bottom
        threshold: 0.1,
      },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [enabled, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading state (initial load)
  if (isLoading && segments.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 sm:mb-4">
          {t("chapters.title", "series")}
        </h2>
        <Skeletonize loading={true}>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 sm:h-24 rounded-lg border border-border"
              />
            ))}
          </div>
        </Skeletonize>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 sm:mb-4">
          {t("chapters.title", "series")}
        </h2>
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            {t("error.loadingChapters", "series") || "Failed to load chapters"}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              // Retry by refetching
              window.location.reload();
            }}
          >
            {t("actions.retry", "common") || "Retry"}
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!isLoading && segments.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 sm:mb-4">
          {t("chapters.title", "series")}
        </h2>
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("chapters.noChapters", "series") || "No chapters available yet"}
          </p>
        </div>
      </div>
    );
  }

  // Available languages for filter
  const languages = [
    { value: "all", label: t("chapters.filter.all", "series") || "All Languages" },
    { value: "en", label: "English" },
    { value: "vi", label: "Tiếng Việt" },
    { value: "ja", label: "日本語" },
    { value: "zh", label: "中文" },
    { value: "ko", label: "한국어" },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
          {t("chapters.title", "series")}
        </h2>

        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="h-9 px-3 py-1 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] sm:min-w-[160px]"
            aria-label={t("chapters.filter.label", "series") || "Filter by language"}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Segments List */}
      <div className="space-y-2 sm:space-y-3">
        {segments.map((segment) => (
          <SegmentItem
            key={segment.id}
            segment={segment}
            t={t}
          />
        ))}
      </div>

      {/* Load More Trigger (Intersection Observer target) */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("chapters.loading", "series") || "Loading more chapters..."}</span>
            </div>
          )}
        </div>
      )}

      {/* End of list indicator */}
      {!hasNextPage && segments.length > 0 && (
        <div className="text-center py-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("chapters.endOfList", "series") || "No more chapters"}
          </p>
        </div>
      )}
    </div>
  );
}

