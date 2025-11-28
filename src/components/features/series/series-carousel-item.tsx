"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import { useI18n } from "@/components/providers/i18n-provider";
import type { PopularSeries } from "@/lib/interface/series.interface";

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
 * Individual carousel item for series
 */
interface SeriesCarouselItemProps {
  series: PopularSeries;
}

export function SeriesCarouselItem({ series }: SeriesCarouselItemProps) {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted md:max-w-xs">
          <Image
            src={series.coverUrl}
            alt={series.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          {/* Language flag overlay */}
          <div className="absolute top-2 left-2 rounded bg-background/80 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
            {languageFlags[series.language] || series.language.toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center space-y-4 md:col-span-2 lg:col-span-2">
          <div>
            <h3 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              {series.title}
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              {t("by", "series")} {series.author}
            </p>
            {series.tags && series.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {series.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <p className="mb-4 text-sm text-foreground md:text-base">
              {series.description || t("noDescription", "series")}
            </p>
            {series.additionalLinks && series.additionalLinks.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {series.additionalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button asChild size="lg">
              <Link href={`/series/${series.id}`}>{t("read", "series")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/series/${series.id}`}>
                {t("viewDetails", "series")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
