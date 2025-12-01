"use client";

import { Frown, Heart, Plus, Smile } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Card } from "@/components/ui/core/card";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import type { Series } from "@/lib/interface/series.interface";
import { cn } from "@/lib/utils";

/**
 * Format countdown time for episode airing
 * Returns formatted string like "1 day, 7 hours" or "6 hours, 59 mins"
 */
function formatAiringTime(targetDate: Date | string): string {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return "Airing now";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0 && days === 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(", ") : "Airing soon";
}

/**
 * Series card component with different variants
 * - anichart: AniChart-style vertical poster with gradient overlay
 * - default: Horizontal layout with cover image on left, content on right
 * - compact: Vertical compact card
 * - featured: Vertical card with featured badge
 * - tiny: Smallest vertical card variant
 */
interface SeriesCardProps {
  series: Series;
  variant?: "default" | "compact" | "featured" | "tiny" | "anichart";
  className?: string;
  // Optional props for detailed view
  currentEpisode?: number;
  totalEpisodes?: number;
  nextAiringDate?: Date | string;
  rank?: number;
  studio?: string;
  // Optional props for AniChart variant
  romajiTitle?: string; // Reserved for future use
  startDate?: Date | string;
  genres?: string[];
}

export function SeriesCard({
  series,
  variant = "default",
  className,
  currentEpisode,
  totalEpisodes,
  nextAiringDate,
  rank,
  studio,
  startDate,
  genres,
  // romajiTitle reserved for future use
}: SeriesCardProps) {
  const { t } = useI18n();

  const isCompact = variant === "compact";
  const isTiny = variant === "tiny";
  const isFeatured = variant === "featured";
  const isDefault = variant === "default";
  const isAniChart = variant === "anichart";

  // Calculate rating percentage from averageScore (0-100 scale)
  const rating = series.averageScore ? Math.round(series.averageScore / 10) : null;
  const ratingIcon = useMemo(() => {
    if (rating === null) return null;
    return rating >= 70 ? (
      <Smile className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
    ) : (
      <Frown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500" />
    );
  }, [rating]);

  // Format episode info
  const episodeInfo = useMemo(() => {
    if (!currentEpisode || !totalEpisodes) return null;
    const airingText = nextAiringDate ? formatAiringTime(nextAiringDate) : "Airing";
    return `Ep ${currentEpisode} of ${totalEpisodes} airing in ${airingText}`;
  }, [currentEpisode, totalEpisodes, nextAiringDate]);


  // Format airing date for AniChart variant
  const formatAiringDate = useMemo(() => {
    if (startDate) {
      const date = typeof startDate === "string" ? new Date(startDate) : startDate;
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    if (series.season && series.seasonYear) {
      // If no specific date, show "Airing in [Month] [Year]"
      const monthMap: Record<string, string> = {
        winter: "January",
        spring: "April",
        summer: "July",
        fall: "October",
      };
      return `${monthMap[series.season] || series.season} ${series.seasonYear}`;
    }
    return null;
  }, [startDate, series.season, series.seasonYear]);

  // Get genres for AniChart variant (use provided genres or fallback to tags)
  const displayGenres = useMemo(() => {
    return genres || series.tags || [];
  }, [genres, series.tags]);

  // AniChart-style variant: horizontal layout with cover image on left, info panel on right
  if (isAniChart) {
    return (
      <Card
        className={cn(
          "group flex flex-row h-full overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md p-0",
          className,
        )}
      >
        {/* Left Section: Cover Image */}
        <Link
          href={`/series/${series.id}`}
          className="relative w-24 sm:w-28 md:w-32 lg:w-36 flex-shrink-0 h-full overflow-hidden bg-muted"
        >
          <div className="relative w-full h-full">
            <Image
              src={series.coverUrl}
              alt={series.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
            />
            
            {/* Dark Gradient Overlay at Bottom with Title and Studio */}
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 pb-2 px-2 sm:px-3">
              <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-2 mb-1 drop-shadow-lg leading-tight">
                {series.title}
              </h3>
              {studio && (
                <p className="text-blue-300 text-[10px] sm:text-xs line-clamp-1 drop-shadow-md">
                  {studio}
                </p>
              )}
            </div>
          </div>
        </Link>

        {/* Right Section: Information Panel */}
        <div className="flex flex-1 flex-col p-3 sm:p-4 min-w-0">
          {/* Top Row: Airing Date and Ranking */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] sm:text-xs text-muted-foreground">Airing on</span>
                {formatAiringDate && (
                  <span className="text-sm sm:text-base font-semibold text-foreground">
                    {formatAiringDate}
                  </span>
                )}
              </div>
              {/* Sequel/Source Info */}
              {(series.status === SERIES_CONSTANTS.RELEASING_STATUS.COMING_SOON || series.source) && (
                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                  {series.status === SERIES_CONSTANTS.RELEASING_STATUS.COMING_SOON
                    ? `Sequel to ${series.title}`
                    : series.source
                    ? `Source • ${series.source.replace(/_/g, " ")}`
                    : null}
                </p>
              )}
            </div>
            {/* Ranking Badge */}
            {rank && (
              <div className="flex items-center gap-1 text-pink-500 flex-shrink-0">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                <span className="text-sm sm:text-base font-semibold">#{rank}</span>
              </div>
            )}
          </div>

          {/* Synopsis/Description */}
          {series.description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 sm:line-clamp-4 leading-relaxed mb-3 flex-1">
              {series.description}
            </p>
          )}

          {/* Bottom: Genre Pills */}
          {displayGenres.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 mt-auto pt-2">
              <div className="flex flex-wrap gap-1 sm:gap-1.5 flex-1">
                {displayGenres.slice(0, 4).map((genre, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-medium bg-amber-600 text-white border-0"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0"
                aria-label="Add to list"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Show horizontal layout only for default variant
  if (isDefault && (episodeInfo || rank || studio)) {
    return (
      <Card
        className={cn(
          "group flex flex-row gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 rounded-lg border border-border bg-card transition-all duration-150 hover:shadow-md hover:border-border/80",
          className,
        )}
      >
        {/* Cover Image - Left side */}
        <Link
          href={`/series/${series.id}`}
          className="relative w-14 sm:w-16 md:w-20 lg:w-24 h-18 sm:h-20 md:h-28 lg:h-32 flex-shrink-0 overflow-hidden rounded bg-muted"
        >
          <Image
            src={series.coverUrl}
            alt={series.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 375px) 56px, (max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
          />
        </Link>

        {/* Content - Right side */}
        <div className="flex flex-1 flex-col gap-1 sm:gap-1.5 md:gap-2 min-w-0">
          {/* Header: Episode info, Rating, Rank */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
            {episodeInfo && (
              <span className="truncate">{episodeInfo}</span>
            )}
            {rating !== null && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <span>{rating}%</span>
                {ratingIcon}
              </div>
            )}
            {rank && (
              <div className="flex items-center gap-1 text-red-500 flex-shrink-0 ml-auto">
                <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                <span>#{rank}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link
            href={`/series/${series.id}`}
            className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-foreground hover:text-primary line-clamp-2 leading-tight"
          >
            {series.title}
          </Link>

          {/* Subtitle/Source */}
          {series.season && series.seasonYear && (
            <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
              {series.season} {series.seasonYear}
              {series.source && (
                <span className="hidden sm:inline">
                  {` • Source • ${series.source}`}
                </span>
              )}
            </p>
          )}

          {/* Description */}
          {series.description && (
            <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 md:line-clamp-3 leading-relaxed">
              {series.description}
            </p>
          )}

          {/* Studio/Source */}
          {studio && (
            <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
              {studio}
            </p>
          )}

          {/* Genre Tags */}
          {series.tags && series.tags.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mt-auto pt-0.5 sm:pt-1">
              <div className="flex flex-wrap gap-0.5 sm:gap-1 md:gap-1.5 flex-1">
                {series.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1 sm:px-1.5 md:px-2 py-0.5 rounded text-[8px] sm:text-[9px] md:text-[10px] font-medium bg-accent text-accent-foreground border border-border/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0"
                aria-label="View more"
              >
                <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Original vertical layout for other variants
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
          sizes={isTiny 
            ? "(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 10vw"
            : isCompact
              ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        />
        {isFeatured && (
          <div className="absolute top-2 right-2 rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            {t("featured", "series")}
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex-shrink-0",
          isTiny 
            ? "p-1 sm:p-1.5" 
            : isCompact 
              ? "p-1.5 sm:p-2" 
              : "px-1.5 sm:px-2 pt-1 pb-1",
        )}
      >
        <h3
          className={cn(
            "font-semibold text-foreground line-clamp-2",
            isTiny
              ? "text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg"
              : isCompact
                ? "text-xs sm:text-sm md:text-base lg:text-lg"
                : "text-sm sm:text-base md:text-lg lg:text-xl",
          )}
        >
          {series.title}
        </h3>
      </div>
    </Card>
  );
}
