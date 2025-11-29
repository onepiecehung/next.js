"use client";

import Image from "next/image";
import Link from "next/link";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import type { LatestUpdateItem } from "@/lib/interface/series.interface";

/**
 * Language flag mapping
 */
const languageFlags: Record<string, string> = {
  ja: "🇯🇵",
  en: "🇺🇸",
  vi: "🇻🇳",
  zh: "🇨🇳",
  ko: "🇰🇷",
  pt: "🇵🇹",
  fr: "🇫🇷",
};

/**
 * Format relative time
 * Handles both Date objects and date strings (ISO format)
 */
function formatRelativeTime(
  date: Date | string,
  t: (key: string, ns?: string) => string,
): string {
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
  if (minutes < 60) return t("minutesAgo", "series").replace("{{value}}", minutes.toString());
  if (hours < 24) return t("hoursAgo", "series").replace("{{value}}", hours.toString());
  return t("daysAgo", "series").replace("{{value}}", days.toString());
}

/**
 * Latest updates list component
 */
interface LatestUpdatesListProps {
  items: LatestUpdateItem[];
  className?: string;
}

export function LatestUpdatesList({
  items,
  className,
}: LatestUpdatesListProps) {
  const { t } = useI18n();

  return (
    <div className={className}>
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
          {t("latestUpdates", "series")}
        </h2>
        <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
          <Link href="/series/latest" className="text-xs sm:text-sm">
            {t("viewLastUpdatedTitles", "series")}
            <span className="ml-2">→</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-2 sm:gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg border border-border bg-card transition-colors hover:bg-accent/50"
          >
            {/* Cover - Smaller on mobile for better space utilization */}
            <Link
              href={`/series/${item.id}`}
              className="relative h-16 w-12 sm:h-20 sm:w-16 flex-shrink-0 overflow-hidden rounded bg-muted"
            >
              <Image
                src={item.coverUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 48px, 64px"
              />
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-0.5 sm:gap-1 min-w-0">
              {/* Title - Full width on mobile for better readability */}
              <Link
                href={`/series/${item.id}`}
                className="font-semibold text-sm sm:text-base text-foreground hover:text-primary line-clamp-2 sm:line-clamp-1 min-w-0"
              >
                {item.title}
              </Link>

              {/* Chapter info - Stacked on mobile, inline on desktop */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">
                  <span className="text-[10px] sm:text-xs flex-shrink-0">
                    {languageFlags[item.chapter.language] ||
                      `[${item.chapter.language.toUpperCase()}]`}
                  </span>
                  <span className="truncate">
                    {t("chapter", "series")} {item.chapter.number}
                    {item.chapter.title && (
                      <span className="hidden sm:inline">
                        {` - ${item.chapter.title}`}
                      </span>
                    )}
                  </span>
                </div>
                
                {/* Timestamp - Separate line on mobile for clarity */}
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                  <span className="flex-shrink-0">
                    {formatRelativeTime(item.timestamp, t)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
