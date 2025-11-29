"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

import {
  LatestUpdatesList,
  RecommendedGrid,
} from "@/components/features/series";
import { SearchBar } from "@/components/features/series";
import { SeriesCard } from "@/components/features/series/series-card";
import {
  SeriesHeroCarousel,
  type FeaturedSeries,
} from "@/components/features/series/series-hero-carousel";
import { useI18n } from "@/components/providers/i18n-provider";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Button } from "@/components/ui/core/button";
import {
  useFeaturedSeries,
  useLatestUpdates,
  usePopularSeries,
  useRecentlyAddedSeries,
  useRecommendedSeries,
  useSeasonalSeries,
  useSelfPublishedSeries,
} from "@/hooks/series";
import type { PopularSeries } from "@/lib/interface/series.interface";

/**
 * MangaDex-style Homepage
 * Main landing page with all series sections
 */
export default function HomePage() {
  const { t } = useI18n();

  // Fetch all series data sequentially from top to bottom
  // Each section loads only after the previous one completes successfully
  const { data: popularSeries, isLoading: isLoadingPopular, isSuccess: isPopularSuccess } =
    usePopularSeries(true); // First section - always enabled
  
  const { data: latestUpdates, isLoading: isLoadingUpdates, isSuccess: isLatestUpdatesSuccess } =
    useLatestUpdates(isPopularSuccess); // Enabled after popular series loads
  
  const { data: recommended, isLoading: isLoadingRecommended, isSuccess: isRecommendedSuccess } =
    useRecommendedSeries(isLatestUpdatesSuccess); // Enabled after latest updates loads
  
  const { data: selfPublished, isLoading: isLoadingSelfPublished, isSuccess: isSelfPublishedSuccess } =
    useSelfPublishedSeries(isRecommendedSuccess); // Enabled after recommended loads
  
  const { data: featured, isLoading: isLoadingFeatured, isSuccess: isFeaturedSuccess } = 
    useFeaturedSeries(isSelfPublishedSuccess); // Enabled after self-published loads
  
  const { data: seasonal, isLoading: isLoadingSeasonal, isSuccess: isSeasonalSuccess } = 
    useSeasonalSeries(isFeaturedSuccess); // Enabled after featured loads
  
  const { data: recentlyAdded, isLoading: isLoadingRecentlyAdded } =
    useRecentlyAddedSeries(isSeasonalSuccess); // Enabled after seasonal loads

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Search Bar - Only visible on mobile */}
      <section className="border-b border-border bg-background md:hidden">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <SearchBar className="w-full" showKeyboardShortcut={false} />
        </div>
      </section>

      {/* Popular New Titles Hero Carousel - Full width with navigation overlay */}
      <section className="relative -mt-20 pt-20 pb-0 border-b border-border">
        <Skeletonize loading={isLoadingPopular}>
          {popularSeries && popularSeries.length > 0 && (
            <SeriesHeroCarousel
              items={popularSeries.map(
                (series: PopularSeries): FeaturedSeries => ({
                  id: series.id,
                  title: series.title,
                  description: series.description || "",
                  tags: series.tags || [],
                  coverUrl: series.coverUrl,
                }),
              )}
              className="h-[20vh] min-h-[180px] sm:h-[25vh] sm:min-h-[220px] md:h-[30vh] md:min-h-[280px] lg:h-[40vh] lg:min-h-[400px] xl:h-[45vh] xl:max-h-[700px]"
            />
          )}
        </Skeletonize>
      </section>

      {/* Banner Ad */}
      {/* <section className="border-b border-border py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/advertise"
            className="block w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 p-8 text-center transition-all hover:from-primary/30 hover:to-primary/20"
          >
            <h3 className="text-lg font-semibold text-foreground md:text-xl">
              {t("advertise", "series")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("advertise", "series")} - {t("advertiseNav", "series")}
            </p>
          </Link>
        </div>
      </section> */}

      {/* Latest Updates */}
      <section className="border-b border-border py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <Skeletonize loading={isLoadingUpdates}>
            {latestUpdates && latestUpdates.length > 0 && (
              <LatestUpdatesList items={latestUpdates} />
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Recommended */}
      <section className="border-b border-border py-3 sm:py-4 md:py-5 lg:py-6 xl:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
          <Skeletonize loading={isLoadingRecommended}>
            {recommended && recommended.length > 0 && (
              <RecommendedGrid
                series={recommended}
                titleI18nKey="recommended"
                viewAllI18nKey="viewRecommendedList"
                viewAllHref="/series/recommended"
              />
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Self-Published */}
      <section className="border-b border-border py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <Skeletonize loading={isLoadingSelfPublished}>
            {selfPublished && selfPublished.length > 0 && (
              <RecommendedGrid
                series={selfPublished}
                titleI18nKey="selfPublished"
                viewAllI18nKey="viewSelfPublishedList"
                viewAllHref="/series/self-published"
              />
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Featured */}
      <section className="border-b border-border py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <div className="mb-3 sm:mb-4 flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                {t("featured", "series")}
              </h2>
              {/* Arrow icon - visible on mobile only, inline with heading */}
              <Link 
                href="/series/featured"
                className="sm:hidden flex items-center justify-center"
                aria-label={t("viewFeaturedList", "series")}
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
            </div>
            {/* Button with text - visible on desktop only */}
            <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm hidden sm:flex">
              <Link href="/series/featured" className="flex items-center gap-1.5 sm:gap-2">
                <span>{t("viewFeaturedList", "series")}</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              </Link>
            </Button>
          </div>
          <Skeletonize loading={isLoadingFeatured}>
            {featured && featured.length > 0 && (
              <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {featured.slice(0, 6).map((series) => (
                  <SeriesCard
                    key={series.id}
                    series={series}
                    variant="featured"
                  />
                ))}
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Seasonal: Fall 2025 */}
      <section className="border-b border-border py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <div className="mb-3 sm:mb-4 flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                {t("seasonalFall2025", "series")}
              </h2>
              {/* Arrow icon - visible on mobile only, inline with heading */}
              <Link 
                href="/series/seasonal"
                className="sm:hidden flex items-center justify-center"
                aria-label={t("openListSeasonal", "series")}
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
            </div>
            {/* Button with text - visible on desktop only */}
            <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm hidden sm:flex">
              <Link href="/series/seasonal" className="flex items-center gap-1.5 sm:gap-2">
                <span>{t("openListSeasonal", "series")}</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              </Link>
            </Button>
          </div>
          <Skeletonize loading={isLoadingSeasonal}>
            {seasonal && seasonal.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {seasonal.map((series) => (
                  <SeriesCard
                    key={series.id}
                    series={series}
                    variant="compact"
                  />
                ))}
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Recently Added */}
      <section className="border-b border-border py-4 sm:py-5 md:py-6 lg:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <div className="mb-3 sm:mb-4 flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                {t("recentlyAdded", "series")}
              </h2>
              {/* Arrow icon - visible on mobile only, inline with heading */}
              <Link 
                href="/series/recently-added"
                className="sm:hidden flex items-center justify-center"
                aria-label={t("viewRecentlyAdded", "series")}
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
            </div>
            {/* Button with text - visible on desktop only */}
            <Button asChild variant="ghost" size="sm" className="text-xs sm:text-sm hidden sm:flex">
              <Link href="/series/recently-added" className="flex items-center gap-1.5 sm:gap-2">
                <span>{t("viewRecentlyAdded", "series")}</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              </Link>
            </Button>
          </div>
          <Skeletonize loading={isLoadingRecentlyAdded}>
            {recentlyAdded && recentlyAdded.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1.5 sm:gap-2 md:gap-2.5">
                {recentlyAdded.slice(0, 10).map((series) => (
                  <SeriesCard key={series.id} series={series} variant="tiny" />
                ))}
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {/* Social Links */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">
                {t("community", "series")}
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="https://discord.gg/mangadex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("discord", "series")}
                </Link>
                <Link
                  href="https://twitter.com/mangadex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("twitter", "series")}
                </Link>
                <Link
                  href="https://reddit.com/r/mangadex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("reddit", "series")}
                </Link>
                <Link
                  href="/status"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("systemStatus", "series")}
                </Link>
              </div>
            </div>

            {/* Policies */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">
                {t("mangadex", "series")}
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/guidelines"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("communityGuidelines", "series")}
                </Link>
                <Link
                  href="/announcements"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("announcements", "series")}
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("aboutUs", "series")}
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("contact", "series")}
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">
                {t("termsAndPolicies", "series")}
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("termsAndPolicies", "series")}
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {t("privacy", "series")}
                </Link>
              </div>
            </div>

            {/* Version Info */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">
                {t("version", "series")}
              </h3>
              <p className="text-sm text-muted-foreground">v2025.11.26</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
