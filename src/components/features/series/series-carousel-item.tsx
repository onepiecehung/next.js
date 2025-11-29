"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import { Card } from "@/components/ui/core/card";
import { useI18n } from "@/components/providers/i18n-provider";
import type { PopularSeries } from "@/lib/interface/series.interface";

/**
 * Individual carousel item for series
 * MangaDex-style design:
 * - Blurred banner background with dark overlay
 * - Cover image on left (1/3 width) in card with shadow
 * - Content on right (2/3 width) with white text
 * - Genres below title (dark badges with white text)
 * - Full description
 * - Author before buttons
 */
interface SeriesCarouselItemProps {
  series: PopularSeries;
}

export function SeriesCarouselItem({ series }: SeriesCarouselItemProps) {
  const { t } = useI18n();

  return (
    <Link
      href={`/series/${series.id}`}
      className="flex relative h-full overflow-hidden shadow bg-muted"
      style={{ height: "440px" }}
    >
      {/* Blurred banner background - MangaDex style: h-[150%] for positioning */}
      {series.bannerUrl ? (
        <>
          <Image
            src={series.bannerUrl}
            alt={series.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            style={{ objectPosition: "0px 30%" }}
          />
          {/* Dark blur overlay - MangaDex style banner-bg */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-sm" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10" />
      )}

      {/* Content container - MangaDex style: grid-rows-[1fr_1rem] on mobile, md:grid-rows-1 on desktop */}
      <div className="relative z-10 w-full">
        <div className="p-4 mb-6 md:mb-0 md:py-4 md:px-4 grid grid-rows-[1fr_1rem] md:grid-rows-1 gap-2 md:h-[77%] sm:h-[65%] h-[70%] mt-auto xl:max-w-[1440px] w-full mx-auto">
          <div className="grid gap-2 md:grid-cols-12 md:gap-4">
            {/* Cover Image Card - Left side (1/3 = 4 columns) */}
            <div className="md:col-span-4 flex items-center">
              <Card className="overflow-hidden shadow-2xl w-full transition-transform hover:scale-[1.02]">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                  <Image
                    src={series.coverUrl}
                    alt={series.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </Card>
            </div>

            {/* Content - Right side (2/3 = 8 columns) */}
            <div className="flex flex-col justify-center space-y-2 md:col-span-8 md:space-y-2.5">
              {/* Title - Large, bold, white text */}
              <h3 className="text-xl font-bold text-white drop-shadow-lg md:text-2xl lg:text-3xl line-clamp-2">
                {series.title}
              </h3>

              {/* Genres/Tags - Below title, MangaDex style (dark gray bg, white text, uppercase) */}
              {series.tags && series.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {series.tags.slice(0, 6).map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-gray-800/90 text-white border-0 hover:bg-gray-800 text-xs font-semibold px-2 py-0.5"
                    >
                      {tag.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description - Full text, white/light text with good line height */}
              <p className="text-sm leading-relaxed text-white/90 drop-shadow-md md:text-base line-clamp-3">
                {series.description || t("noDescription", "series")}
              </p>

              {/* Author - Light text, italic */}
              {series.author && (
                <p className="text-sm text-white/80 md:text-base font-medium italic truncate sm:mr-36 mr-4">
                  {series.author}
                </p>
              )}

              {/* Additional Links - Light text with hover */}
              {series.additionalLinks && series.additionalLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 text-sm">
                  {series.additionalLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white underline transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-semibold"
                >
                  <span>{t("read", "series")}</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  <span>{t("viewDetails", "series")}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
