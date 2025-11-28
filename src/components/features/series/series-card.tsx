"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/core/card";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Series } from "@/lib/interface/series.interface";
import { cn } from "@/lib/utils";

/**
 * Series card component with different variants
 */
interface SeriesCardProps {
  series: Series;
  variant?: "default" | "compact" | "featured" | "tiny";
  showDescription?: boolean;
  showReadButton?: boolean;
  className?: string;
}

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

export function SeriesCard({
  series,
  variant = "default",
  showDescription = true,
  showReadButton = true,
  className,
}: SeriesCardProps) {
  const { t } = useI18n();

  const isCompact = variant === "compact";
  const isTiny = variant === "tiny";
  const isFeatured = variant === "featured";

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md",
        (isCompact || isTiny) && "h-full",
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
        {/* Language flag overlay */}
        <div
          className={cn(
            "absolute rounded bg-background/80 font-semibold backdrop-blur-sm",
            isTiny
              ? "top-1 left-1 px-1 py-0.5 text-[10px]"
              : "top-2 left-2 px-2 py-1 text-xs",
          )}
        >
          {languageFlags[series.language] || series.language.toUpperCase()}
        </div>
        {isFeatured && (
          <div className="absolute top-2 right-2 rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            {t("featured", "series")}
          </div>
        )}
      </div>

      <CardHeader
        className={cn(
          "space-y-2",
          isTiny ? "p-2" : isCompact ? "p-3" : undefined,
        )}
      >
        <h3
          className={cn(
            "font-semibold text-foreground line-clamp-2",
            isTiny ? "text-xs" : isCompact ? "text-sm" : "text-base md:text-lg",
          )}
        >
          {series.title}
        </h3>
        {showDescription && (
          <p
            className={cn(
              "text-muted-foreground line-clamp-3",
              isTiny ? "text-[10px]" : isCompact ? "text-xs" : "text-sm",
            )}
          >
            {series.description || t("noDescription", "series")}
          </p>
        )}
      </CardHeader>

      <CardContent
        className={cn(
          "space-y-3",
          isTiny ? "p-2 pt-0" : isCompact ? "p-3 pt-0" : undefined,
        )}
      >
        {/* Tags */}
        {series.tags && series.tags.length > 0 && !isTiny && (
          <div className="flex flex-wrap gap-1.5">
            {series.tags.slice(0, isCompact ? 2 : 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Author */}
        {!isTiny && (
          <p
            className={cn(
              "text-muted-foreground",
              isCompact ? "text-xs" : "text-sm",
            )}
          >
            {t("by", "series")} {series.author}
          </p>
        )}
      </CardContent>

      {showReadButton && !isTiny && (
        <CardFooter
          className={cn(
            "gap-2",
            isTiny ? "p-2 pt-0" : isCompact ? "p-3 pt-0" : undefined,
          )}
        >
          <Button
            asChild
            className="w-full"
            size={isCompact ? "sm" : "default"}
          >
            <Link href={`/series/${series.id}`}>{t("read", "series")}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
