"use client";

import Link from "next/link";

import { Button } from "@/components/ui/core/button";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Series } from "@/lib/interface/series.interface";
import { cn } from "@/lib/utils";
import { SeriesCard } from "./series-card";

/**
 * Recommended grid component
 */
interface RecommendedGridProps {
  series: Series[];
  titleI18nKey: string;
  viewAllI18nKey: string;
  viewAllHref?: string;
  variant?: "default" | "compact";
  className?: string;
}

export function RecommendedGrid({
  series,
  titleI18nKey,
  viewAllI18nKey,
  viewAllHref = "/series",
  variant = "default",
  className,
}: RecommendedGridProps) {
  const { t } = useI18n();
  const isCompact = variant === "compact";

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          {t(titleI18nKey, "series")}
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link href={viewAllHref}>
            {t(viewAllI18nKey, "series")}
            <span className="ml-2">→</span>
          </Link>
        </Button>
      </div>

      <div
        className={cn(
          "grid gap-4",
          isCompact
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
        )}
      >
        {series.map((series) => (
          <SeriesCard
            key={series.id}
            series={series}
            variant={isCompact ? "compact" : "default"}
          />
        ))}
      </div>
    </div>
  );
}
