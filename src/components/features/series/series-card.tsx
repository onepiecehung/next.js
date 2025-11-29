"use client";

import Image from "next/image";

import { useI18n } from "@/components/providers/i18n-provider";
import { Card, CardHeader } from "@/components/ui/core/card";
import type { Series } from "@/lib/interface/series.interface";
import { cn } from "@/lib/utils";

/**
 * Series card component with different variants
 * Only displays cover image and title
 */
interface SeriesCardProps {
  series: Series;
  variant?: "default" | "compact" | "featured" | "tiny";
  className?: string;
}

export function SeriesCard({
  series,
  variant = "default",
  className,
}: SeriesCardProps) {
  const { t } = useI18n();

  const isCompact = variant === "compact";
  const isTiny = variant === "tiny";
  const isFeatured = variant === "featured";

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md p-0",
        className,
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <Image
          src={series.coverUrl}
          alt={series.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {isFeatured && (
          <div className="absolute top-2 right-2 rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            {t("featured", "series")}
          </div>
        )}
      </div>

      <CardHeader
        className={cn(
          "flex-shrink-0",
          isTiny ? "p-1.5" : isCompact ? "p-2" : "px-2 pt-1 pb-1",
        )}
      >
        <h3
          className={cn(
            "font-semibold text-foreground line-clamp-2",
            isTiny
              ? "text-[10px]"
              : isCompact
                ? "text-xs"
                : "text-sm md:text-base",
          )}
        >
          {series.title}
        </h3>
      </CardHeader>
    </Card>
  );
}
