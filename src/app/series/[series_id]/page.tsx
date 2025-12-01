"use client";

import { BookOpen, ExternalLink, FileText, Heart, Share2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import { useI18n } from "@/components/providers/i18n-provider";
import { AnimatedSection, Skeletonize } from "@/components/shared";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/core/badge";
import { useSeries, useSeriesFull } from "@/hooks/series";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import { cn } from "@/lib/utils";

/**
 * Series Detail Page Component
 * MangaDex-style layout with banner, cover, metadata, and chapters
 * URL pattern: /series/[series_id]
 */
export default function SeriesDetailPage() {
  const params = useParams();
  const { t } = useI18n();
  const seriesId = params.series_id as string;

  // Fetch series data (transformed)
  const { data: series, isLoading: isLoadingSeries, error: seriesError } = useSeries(seriesId);
  
  // Fetch full backend series data for complete metadata
  const { data: backendSeries, isLoading: isLoadingFull, error: fullError } = useSeriesFull(seriesId);
  
  const isLoading = isLoadingSeries || isLoadingFull;
  const error = seriesError || fullError;

  // Show 404 if series not found
  if (!isLoading && !error && !series) {
    notFound();
  }

  // Format date helper
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status text
  const getStatusText = (status: string | undefined) => {
    if (!status) return t("status.unknown", "series");
    const statusMap: Record<string, string> = {
      [SERIES_CONSTANTS.RELEASING_STATUS.FINISHED]: t("status.finished", "series"),
      [SERIES_CONSTANTS.RELEASING_STATUS.RELEASING]: t("status.releasing", "series"),
      [SERIES_CONSTANTS.RELEASING_STATUS.ONGOING]: t("status.ongoing", "series"),
      [SERIES_CONSTANTS.RELEASING_STATUS.COMING_SOON]: t("status.comingSoon", "series"),
      [SERIES_CONSTANTS.RELEASING_STATUS.COMPLETED]: t("status.completed", "series"),
      [SERIES_CONSTANTS.RELEASING_STATUS.NOT_YET_RELEASED]: t("status.notYetReleased", "series"),
      [SERIES_CONSTANTS.RELEASING_STATUS.CANCELLED]: t("status.cancelled", "series"),
      [SERIES_CONSTANTS.RELEASING_STATUS.HIATUS]: t("status.hiatus", "series"),
    };
    return statusMap[status] || status;
  };

  // Get type text
  const getTypeText = (type: string | undefined) => {
    if (!type) return "N/A";
    const typeMap: Record<string, string> = {
      [SERIES_CONSTANTS.TYPE.ANIME]: t("type.anime", "series"),
      [SERIES_CONSTANTS.TYPE.MANGA]: t("type.manga", "series"),
      [SERIES_CONSTANTS.TYPE.LIGHT_NOVEL]: t("type.lightNovel", "series"),
      [SERIES_CONSTANTS.TYPE.VISUAL_NOVEL]: t("type.visualNovel", "series"),
      [SERIES_CONSTANTS.TYPE.VIDEO_GAME]: t("type.videoGame", "series"),
      [SERIES_CONSTANTS.TYPE.DOUJINSHI]: t("type.doujinshi", "series"),
      [SERIES_CONSTANTS.TYPE.WEB_NOVEL]: t("type.webNovel", "series"),
    };
    return typeMap[type] || type;
  };

  // Get format text
  const getFormatText = (format: string | undefined) => {
    if (!format) return "N/A";
    const formatMap: Record<string, string> = {
      [SERIES_CONSTANTS.FORMAT.TV]: t("format.tv", "series"),
      [SERIES_CONSTANTS.FORMAT.TV_SHORT]: t("format.tvShort", "series"),
      [SERIES_CONSTANTS.FORMAT.MOVIE]: t("format.movie", "series"),
      [SERIES_CONSTANTS.FORMAT.SPECIAL]: t("format.special", "series"),
      [SERIES_CONSTANTS.FORMAT.OVA]: t("format.ova", "series"),
      [SERIES_CONSTANTS.FORMAT.ONA]: t("format.ona", "series"),
      [SERIES_CONSTANTS.FORMAT.MUSIC]: t("format.music", "series"),
      [SERIES_CONSTANTS.FORMAT.MANGA]: t("format.manga", "series"),
      [SERIES_CONSTANTS.FORMAT.NOVEL]: t("format.novel", "series"),
      [SERIES_CONSTANTS.FORMAT.ONE_SHOT]: t("format.oneShot", "series"),
    };
    return formatMap[format] || format;
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection loading={isLoading} data={series} className="w-full">
        <Skeletonize loading={isLoading}>
          {error && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="text-center max-w-md mx-auto">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-xl font-semibold text-foreground mb-2">
                  {t("error.title", "series")}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                  {error.message || t("error.message", "series")}
                </p>
                <Link href="/">
                  <Button>{t("error.backToHome", "series")}</Button>
                </Link>
              </div>
            </div>
          )}

          {!error && series && (
            <>
              {/* Banner Image - Full width at top */}
              {series.bannerUrl && (
                <div className="relative w-full h-32 sm:h-48 md:h-64 lg:h-80 xl:h-96 overflow-hidden">
                  <Image
                    src={series.bannerUrl}
                    alt={series.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                  {/* Gradient overlay for better readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
                </div>
              )}

              {/* Main Content Container */}
              <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  {/* Left Column - Cover Image and Metadata */}
                  <aside className="w-full lg:w-64 xl:w-80 flex-shrink-0">
                    {/* Cover Image - Overlapping banner on mobile, sidebar on desktop */}
                    <div
                      className={cn(
                        "relative w-full max-w-[200px] mx-auto sm:max-w-none sm:w-full aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden shadow-lg mb-3 sm:mb-4 md:mb-6",
                        series.bannerUrl && "-mt-16 sm:-mt-20 md:-mt-24 lg:mt-0"
                      )}
                    >
                      <Image
                        src={series.coverUrl}
                        alt={series.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 200px, (max-width: 1024px) 100vw, 256px"
                        priority
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mb-3 sm:mb-4 md:mb-6">
                      <Button className="w-full text-sm sm:text-base h-10 sm:h-11" size="default">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {t("actions.read", "series")}
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 text-sm sm:text-base h-10 sm:h-11" size="default">
                          <Heart className="h-4 w-4 mr-2" />
                          {t("actions.follow", "series")}
                        </Button>
                        <Button variant="outline" size="icon" className="flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Metadata Sidebar */}
                    <div className="border-t border-border pt-3 sm:pt-4">
                      {/* Compact Grid Layout for Mobile - 2 columns */}
                      <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-2.5 sm:gap-y-3 sm:space-y-0 mb-3 sm:mb-0">
                        {/* Status */}
                        {series.status && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.status", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground break-words">{getStatusText(series.status)}</p>
                          </div>
                        )}

                        {/* Type */}
                        {series.type && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.type", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground break-words">{getTypeText(series.type)}</p>
                          </div>
                        )}

                        {/* Format */}
                        {series.format && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.format", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground break-words">{getFormatText(series.format)}</p>
                          </div>
                        )}

                        {/* Chapters/Volumes */}
                        {backendSeries?.chapters !== undefined && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.chapters", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground break-words">
                              {backendSeries.chapters ?? t("metadata.unknown", "series")}
                            </p>
                          </div>
                        )}

                        {/* Volumes */}
                        {backendSeries?.volumes !== undefined && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.volumes", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground break-words">
                              {backendSeries.volumes ?? t("metadata.unknown", "series")}
                            </p>
                          </div>
                        )}

                        {/* Episodes (for anime) */}
                        {backendSeries?.episodes !== undefined && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.episodes", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground break-words">
                              {backendSeries.episodes ?? t("metadata.unknown", "series")}
                            </p>
                          </div>
                        )}

                        {/* Start Date */}
                        {backendSeries?.startDate && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.startDate", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground break-words">
                              {formatDate(backendSeries.startDate)}
                            </p>
                          </div>
                        )}

                        {/* End Date */}
                        {backendSeries?.endDate && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.endDate", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground break-words">
                              {formatDate(backendSeries.endDate)}
                            </p>
                          </div>
                        )}

                        {/* Season */}
                        {backendSeries?.season && backendSeries?.seasonYear && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.season", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground capitalize break-words">
                              {backendSeries.season} {backendSeries.seasonYear}
                            </p>
                          </div>
                        )}

                        {/* Source */}
                        {backendSeries?.source && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.source", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground capitalize break-words">
                              {backendSeries.source.replace(/_/g, " ")}
                            </p>
                          </div>
                        )}

                        {/* Country of Origin */}
                        {backendSeries?.countryOfOrigin && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.country", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground break-words">
                              {backendSeries.countryOfOrigin}
                            </p>
                          </div>
                        )}

                        {/* Licensed */}
                        {backendSeries?.isLicensed !== undefined && (
                          <div className="sm:space-y-1 sm:mb-0">
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.licensed", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground break-words">
                              {backendSeries.isLicensed ? t("metadata.yes", "series") : t("metadata.no", "series")}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Full-width items below grid */}
                      <div className="space-y-3 sm:space-y-4">

                        {/* NSFW Warning */}
                        {backendSeries?.isNsfw && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2 sm:p-3">
                            <p className="text-[10px] sm:text-xs font-semibold text-destructive">
                              {t("metadata.nsfw", "series")}
                            </p>
                          </div>
                        )}

                        {/* Score */}
                        {series.averageScore && (
                          <div>
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.score", "series")}
                            </h3>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                              <p className="text-xs sm:text-sm text-foreground">
                                {Math.round(series.averageScore / 10)}%
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Popularity */}
                        {series.popularity && (
                          <div>
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">
                              {t("metadata.popularity", "series")}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground">
                              {Math.floor(series.popularity).toLocaleString()}
                            </p>
                          </div>
                        )}

                        {/* Authors */}
                        {backendSeries?.authorRoles && backendSeries.authorRoles.length > 0 && (
                          <div>
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-1.5 sm:mb-2 uppercase tracking-wide">
                              {t("metadata.authors", "series")}
                            </h3>
                            <div className="space-y-1 sm:space-y-1.5">
                              {backendSeries.authorRoles.map((authorRole) => {
                                const author = authorRole.author;
                                if (!author) return null;
                                return (
                                  <div key={authorRole.id} className="flex items-start sm:items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <p className="text-xs sm:text-sm text-foreground break-words">
                                      {author.name}
                                      {authorRole.role && (
                                        <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">
                                          ({authorRole.role})
                                        </span>
                                      )}
                                    </p>
                                    {authorRole.isMain && (
                                      <Badge variant="default" className="text-[10px] sm:text-xs flex-shrink-0">
                                        {t("metadata.main", "series")}
                                      </Badge>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Genres */}
                        {backendSeries?.genres && backendSeries.genres.length > 0 && (
                          <div>
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-1.5 sm:mb-2 uppercase tracking-wide">
                              {t("metadata.genres", "series")}
                            </h3>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                              {backendSeries.genres.map((genreItem) => {
                                const genre = genreItem.genre;
                                if (!genre) return null;
                                return (
                                  <Badge
                                    key={genre.id || genre.name}
                                    variant="secondary"
                                    className="text-[10px] sm:text-xs"
                                  >
                                    {genre.name}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {series.tags && series.tags.length > 0 && (
                          <div>
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-1.5 sm:mb-2 uppercase tracking-wide">
                              {t("metadata.tags", "series")}
                            </h3>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                              {series.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-[10px] sm:text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* External Links */}
                        {backendSeries?.externalLinks && Object.keys(backendSeries.externalLinks).length > 0 && (
                          <div>
                            <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-1.5 sm:mb-2 uppercase tracking-wide">
                              {t("metadata.links", "series")}
                            </h3>
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                              {Object.entries(backendSeries.externalLinks).map(([label, url], index) => (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs sm:text-sm text-primary hover:underline py-1 min-h-[44px] sm:min-h-0"
                                >
                                  <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                                  <span className="break-words">{label}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </aside>

                  {/* Right Column - Main Content */}
                  <main className="flex-1 min-w-0">
                    {/* Title Section */}
                    <header className="mb-4 sm:mb-5 md:mb-6">
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 leading-tight break-words">
                        {series.title}
                      </h1>

                      {/* Alternative Titles */}
                      {backendSeries?.title && (
                        <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-1.5">
                          {backendSeries.title.romaji && backendSeries.title.romaji !== series.title && (
                            <p className="text-xs sm:text-sm text-muted-foreground break-words">
                              <span className="font-medium">Romaji:</span> {backendSeries.title.romaji}
                            </p>
                          )}
                          {backendSeries.title.english && backendSeries.title.english !== series.title && (
                            <p className="text-xs sm:text-sm text-muted-foreground break-words">
                              <span className="font-medium">English:</span> {backendSeries.title.english}
                            </p>
                          )}
                          {backendSeries.title.native && backendSeries.title.native !== series.title && (
                            <p className="text-xs sm:text-sm text-muted-foreground break-words">
                              <span className="font-medium">Native:</span> {backendSeries.title.native}
                            </p>
                          )}
                          {backendSeries.synonyms && backendSeries.synonyms.length > 0 && (
                            <div className="mt-2 sm:mt-3">
                              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1 sm:mb-1.5">Synonyms:</p>
                              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {backendSeries.synonyms.map((synonym, idx) => (
                                  <Badge key={idx} variant="outline" className="text-[10px] sm:text-xs">
                                    {synonym}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      {series.description && (
                        <div className="mt-4 sm:mt-5 md:mt-6">
                          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                            {t("description.title", "series")}
                          </h2>
                          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                            {series.description}
                          </p>
                        </div>
                      )}

                      {/* Chapters Section - Placeholder */}
                      <div className="mt-4 sm:mt-6 md:mt-8">
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                          {t("chapters.title", "series")}
                        </h2>
                        <div className="bg-card border border-border rounded-lg p-3 sm:p-4 md:p-6">
                          <p className="text-xs sm:text-sm text-muted-foreground text-center">
                            {t("chapters.comingSoon", "series")}
                          </p>
                        </div>
                      </div>
                    </header>
                  </main>
                </div>
              </div>
            </>
          )}
        </Skeletonize>
      </AnimatedSection>
    </div>
  );
}

