"use client";

import Image from "next/image";
import Link from "next/link";

import {
  LatestUpdatesList,
  SeriesCarousel,
  RecommendedGrid,
  SearchBar,
} from "@/components/features/series";
import { SeriesCard } from "@/components/features/series/series-card";
import { Skeletonize } from "@/components/shared/skeletonize";
import { Button } from "@/components/ui/core/button";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  useFeaturedSeries,
  useLatestUpdates,
  usePopularSeries,
  useRecentlyAddedSeries,
  useRecommendedSeries,
  useSeasonalSeries,
  useSelfPublishedSeries,
} from "@/hooks/series";

/**
 * MangaDex-style Homepage
 * Main landing page with all series sections
 */
export default function HomePage() {
  const { t } = useI18n();

  // Fetch all series data
  const { data: popularSeries, isLoading: isLoadingPopular } =
    usePopularSeries();
  const { data: latestUpdates, isLoading: isLoadingUpdates } =
    useLatestUpdates();
  const { data: recommended, isLoading: isLoadingRecommended } =
    useRecommendedSeries();
  const { data: selfPublished, isLoading: isLoadingSelfPublished } =
    useSelfPublishedSeries();
  const { data: featured, isLoading: isLoadingFeatured } = useFeaturedSeries();
  const { data: seasonal, isLoading: isLoadingSeasonal } = useSeasonalSeries();
  const { data: recentlyAdded, isLoading: isLoadingRecentlyAdded } =
    useRecentlyAddedSeries();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <section className="border-b border-border bg-card py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl">
            <SearchBar className="w-full" />
          </div>
        </div>
      </section>

      {/* Popular New Titles Carousel */}
      <section className="border-b border-border py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <Skeletonize loading={isLoadingPopular}>
            {popularSeries && popularSeries.length > 0 && (
              <SeriesCarousel
                series={popularSeries}
                title={t("popularNewTitles", "series")}
                autoPlay={true}
                showIndicators={true}
              />
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Banner Ad */}
      <section className="border-b border-border py-4 md:py-6">
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
      </section>

      {/* Latest Updates */}
      <section className="border-b border-border py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <Skeletonize loading={isLoadingUpdates}>
            {latestUpdates && latestUpdates.length > 0 && (
              <LatestUpdatesList items={latestUpdates} />
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Recommended */}
      <section className="border-b border-border py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
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
      <section className="border-b border-border py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
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
      <section className="border-b border-border py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {t("featured", "series")}
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/series/featured">
                {t("viewFeaturedList", "series")}
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
          <Skeletonize loading={isLoadingFeatured}>
            {featured && featured.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((series) => (
                  <SeriesCard
                    key={series.id}
                    series={series}
                    variant="featured"
                    showDescription={true}
                    showReadButton={true}
                  />
                ))}
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Seasonal: Fall 2025 */}
      <section className="border-b border-border py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {t("seasonalFall2025", "series")}
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/series/seasonal">
                {t("openListSeasonal", "series")}
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
          <Skeletonize loading={isLoadingSeasonal}>
            {seasonal && seasonal.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {seasonal.map((series) => (
                  <SeriesCard
                    key={series.id}
                    series={series}
                    variant="compact"
                    showDescription={false}
                    showReadButton={false}
                  />
                ))}
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Recently Added */}
      <section className="border-b border-border py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {t("recentlyAdded", "series")}
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/series/recently-added">
                {t("viewRecentlyAdded", "series")}
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
          <Skeletonize loading={isLoadingRecentlyAdded}>
            {recentlyAdded && recentlyAdded.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
                {recentlyAdded.slice(0, 10).map((series) => (
                  <SeriesCard
                    key={series.id}
                    series={series}
                    variant="tiny"
                    showDescription={false}
                    showReadButton={false}
                  />
                ))}
              </div>
            )}
          </Skeletonize>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
