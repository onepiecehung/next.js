import { useQuery } from "@tanstack/react-query";

import { SeriesAPI } from "@/lib/api/series";
import { SERIES_CONSTANTS } from "@/lib/constants/series.constants";
import type {
  SeriesType,
  SeriesFormat,
  SeriesSeason,
} from "@/lib/constants/series.constants";
import type {
  LatestUpdateItem,
  Series,
  PopularSeries,
  BackendSeries,
} from "@/lib/interface/series.interface";
import {
  transformBackendSeries,
  transformBackendSeriesList,
  transformToPopularSeries,
} from "@/lib/utils/series-utils";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for fetching popular series titles
 * Sorted by popularity or trending
 * @param enabled - Optional flag to control when the query should run
 */
export function usePopularSeries(enabled?: boolean) {
  return useQuery<PopularSeries[]>({
    queryKey: queryKeys.series.popular(),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 10,
        sortBy: "popularity",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA, // For homepage, show series
      });
      const backendSeries = response.data.result as BackendSeries[];
      return backendSeries.map(transformToPopularSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching latest updates
 * Note: This is a placeholder - backend may need a separate endpoint for latest updates
 * @param enabled - Optional flag to control when the query should run
 */
export function useLatestUpdates(enabled?: boolean) {
  return useQuery<LatestUpdateItem[]>({
    queryKey: queryKeys.series.latestUpdates(),
    queryFn: async () => {
      // For now, use recently updated series
      // TODO: Replace with actual latest updates endpoint when available
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 10,
        sortBy: "updatedAt",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
      });
      const backendSeries = response.data.result as BackendSeries[];

      // Transform to LatestUpdateItem format
      // Note: This is a simplified transformation
      // Real implementation would need chapter/group data from backend
      return backendSeries.map((series) => {
        // Convert date string to Date object
        const timestampStr = series.updatedAt || series.createdAt;
        const timestamp = timestampStr ? new Date(timestampStr) : new Date();

        return {
          id: series.id,
          title: transformBackendSeries(series).title,
          coverUrl: transformBackendSeries(series).coverUrl,
          chapter: {
            number: "1",
            title: "Chapter 1",
            language: "en",
            url: `/series/${series.id}`,
          },
          groups: [],
          timestamp,
          commentCount: 0,
        };
      });
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching recommended series
 * Sorted by average score
 * @param enabled - Optional flag to control when the query should run
 */
export function useRecommendedSeries(enabled?: boolean) {
  return useQuery<Series[]>({
    queryKey: queryKeys.series.recommended(),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 12,
        sortBy: "averageScore",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
        minScore: 70, // Minimum score of 70
      });
      const backendSeries = response.data.result as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching self-published series
 * Filtered by isLicensed: false
 * @param enabled - Optional flag to control when the query should run
 */
export function useSelfPublishedSeries(enabled?: boolean) {
  return useQuery<Series[]>({
    queryKey: queryKeys.series.selfPublished(),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
        isLicensed: false,
      });
      const backendSeries = response.data.result as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching featured series
 * Sorted by trending
 * @param enabled - Optional flag to control when the query should run
 */
export function useFeaturedSeries(enabled?: boolean) {
  return useQuery<Series[]>({
    queryKey: queryKeys.series.featured(),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 3,
        sortBy: "trending",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
      });
      const backendSeries = response.data.result as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching seasonal series
 * Filtered by season and seasonYear
 * @param enabled - Optional flag to control when the query should run
 */
export function useSeasonalSeries(enabled?: boolean) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Determine current season
  let season: string;
  if (currentMonth >= 2 && currentMonth <= 4)
    season = SERIES_CONSTANTS.SEASON.SPRING;
  else if (currentMonth >= 5 && currentMonth <= 7)
    season = SERIES_CONSTANTS.SEASON.SUMMER;
  else if (currentMonth >= 8 && currentMonth <= 10)
    season = SERIES_CONSTANTS.SEASON.FALL;
  else season = SERIES_CONSTANTS.SEASON.WINTER;

  return useQuery<Series[]>({
    queryKey: queryKeys.series.seasonal(season, currentYear),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 20,
        sortBy: "popularity",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
        season,
        seasonYear: currentYear,
      });
      const backendSeries = response.data.result as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching recently added series
 * Sorted by creation date
 * @param enabled - Optional flag to control when the query should run
 */
export function useRecentlyAddedSeries(enabled?: boolean) {
  return useQuery<Series[]>({
    queryKey: queryKeys.series.recentlyAdded(),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset({
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        order: "DESC",
        type: SERIES_CONSTANTS.TYPE.MANGA,
      });
      const backendSeries = response.data.result as BackendSeries[];
      return transformBackendSeriesList(backendSeries);
    },
    enabled: enabled !== undefined ? enabled : true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single series by ID
 */
export function useSeries(seriesId: string) {
  return useQuery({
    queryKey: queryKeys.series.detail(seriesId),
    queryFn: async () => {
      const backendSeries = await SeriesAPI.getSeries(seriesId);
      return transformBackendSeries(backendSeries as BackendSeries);
    },
    enabled: !!seriesId && seriesId !== "undefined" && seriesId !== "null",
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching series list with filters
 */
export function useSeriesList(params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
  type?: SeriesType;
  format?: SeriesFormat;
  season?: SeriesSeason;
  seasonYear?: number;
  genres?: string[];
  minScore?: number;
  maxScore?: number;
  query?: string;
}) {
  return useQuery({
    queryKey: queryKeys.series.list(params),
    queryFn: async () => {
      const response = await SeriesAPI.getSeriesOffset(params);
      const backendSeries = response.data.result as BackendSeries[];
      return {
        series: transformBackendSeriesList(backendSeries),
        metaData: response.data.metaData,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}
