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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          {t("latestUpdates", "series")}
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link href="/series/latest">
            {t("viewLastUpdatedTitles", "series")}
            <span className="ml-2">→</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 rounded-lg border border-border bg-card transition-colors hover:bg-accent/50"
          >
            {/* Cover */}
            <Link
              href={`/series/${item.id}`}
              className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-muted"
            >
              <Image
                src={item.coverUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              {/* Title and metadata - inline on mobile, stacked on desktop */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                <Link
                  href={`/series/${item.id}`}
                  className="font-semibold text-foreground hover:text-primary truncate sm:flex-1 min-w-0"
                >
                  {item.title}
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                  <span className="text-xs flex-shrink-0">
                    {languageFlags[item.chapter.language] ||
                      `[${item.chapter.language.toUpperCase()}]`}
                  </span>
                  <span className="truncate">
                    {t("chapter", "series")} {item.chapter.number}
                    {item.chapter.title && ` - ${item.chapter.title}`}
                  </span>
                </div>
              </div>



              {/* Groups and timestamp - inline */}
              {/* <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground min-w-0">
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  {item.groups.slice(0, 2).map((group, index) => (
                    <Link
                      key={group.id}
                      href={group.url}
                      className="text-primary hover:underline truncate"
                    >
                      {group.name}
                    </Link>
                  ))}
                  {item.groups.length > 2 && (
                    <span className="text-muted-foreground truncate">
                      +{item.groups.length - 2}
                    </span>
                  )}
                </div>
                <span className="flex-shrink-0 ml-auto sm:ml-0">
                  {formatRelativeTime(item.timestamp, t)}
                </span>
                {item.commentCount !== undefined && item.commentCount > 0 && (
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {item.commentCount}
                  </Badge>
                )}
              </div> */}



              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                  <span className="text-xs flex-shrink-0">
                  {formatRelativeTime(item.timestamp, t)}
                  </span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
