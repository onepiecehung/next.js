import type {
    SeriesFormat,
    SeriesReleasingStatus,
    SeriesSeason,
    SeriesSource,
    SeriesStatus,
    SeriesType,
} from "@/lib/constants/series.constants";
import { http } from "@/lib/http";
import type {
    CreateSegmentDto,
    Series,
    SeriesSegment,
    UpdateSegmentDto,
} from "@/lib/interface/series.interface";
import type {
    AdvancedQueryParams,
    ApiResponse,
    ApiResponseCursor,
    ApiResponseOffset,
    QueryParamsWithCursor,
} from "@/lib/types";

/**
 * Create Series DTO
 * Based on backend CreateSeriesDto
 */
export interface CreateSeriesDto {
  myAnimeListId?: string;
  aniListId?: string;
  title?: {
    romaji?: string;
    english?: string;
    native?: string;
    userPreferred?: string;
  };
  type: SeriesType;
  format?: SeriesFormat;
  status?: SeriesReleasingStatus;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  season?: SeriesSeason;
  seasonYear?: number;
  seasonInt?: number;
  episodes?: number;
  duration?: number;
  chapters?: number;
  volumes?: number;
  countryOfOrigin?: string;
  isLicensed?: boolean;
  source?: SeriesSource;
  coverImageId?: string;
  bannerImageId?: string;
  genreIds?: string[];
  tagIds?: string[];
  synonyms?: string[];
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  isLocked?: boolean;
  trending?: number;
  isNsfw?: boolean;
  autoCreateForumThread?: boolean;
  isRecommendationBlocked?: boolean;
  isReviewBlocked?: boolean;
  notes?: string;
  releasingStatus?: SeriesReleasingStatus;
  externalLinks?: Record<string, string>;
  streamingEpisodes?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

/**
 * Update Series DTO
 * All fields optional
 */
export type UpdateSeriesDto = Partial<CreateSeriesDto>;

/**
 * Query Series DTO
 * Based on backend QuerySeriesDto
 */
export interface QuerySeriesDto extends AdvancedQueryParams {
  type?: SeriesType;
  format?: SeriesFormat;
  season?: SeriesSeason;
  seasonYear?: number;
  source?: SeriesSource;
  genres?: string[];
  isNsfw?: boolean;
  isLicensed?: boolean;
  minScore?: number;
  maxScore?: number;
  minPopularity?: number;
  maxPopularity?: number;
  seriesStatus?: SeriesStatus;
}

/**
 * Series API wrapper
 * Handles all series-related API calls
 */
export class SeriesAPI {
  private static readonly BASE_URL = "/series";

  /**
   * Create a new series
   * Requires authentication
   */
  static async createSeries(data: CreateSeriesDto): Promise<Series> {
    const response = await http.post<ApiResponse<Series>>(this.BASE_URL, data);
    return response.data.data;
  }

  /**
   * Get series by ID
   */
  static async getSeries(id: string): Promise<Series> {
    const response = await http.get<ApiResponse<Series>>(
      `${this.BASE_URL}/${id}`,
    );
    return response.data.data;
  }

  /**
   * Get series by ID with reaction counts
   */
  static async getSeriesWithReactions(
    id: string,
    kinds?: string[],
  ): Promise<Series> {
    const params = kinds && kinds.length > 0 ? { kinds: kinds.join(",") } : {};
    const response = await http.get<ApiResponse<Series>>(
      `${this.BASE_URL}/${id}/reactions`,
      { params },
    );
    return response.data.data;
  }

  /**
   * Update series by ID
   * Requires authentication
   */
  static async updateSeries(
    id: string,
    data: UpdateSeriesDto,
  ): Promise<Series> {
    const response = await http.patch<ApiResponse<Series>>(
      `${this.BASE_URL}/${id}`,
      data,
    );
    return response.data.data;
  }

  /**
   * Delete series by ID (soft delete)
   * Requires authentication
   */
  static async deleteSeries(id: string): Promise<void> {
    await http.delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Get series list with offset pagination
   */
  static async getSeriesOffset(
    params?: QuerySeriesDto,
  ): Promise<ApiResponseOffset<Series>> {
    const response = await http.get<ApiResponseOffset<Series>>(this.BASE_URL, {
      params,
    });
    return response.data;
  }

  /**
   * Get series list with cursor pagination
   */
  static async getSeriesCursor(
    params?: QueryParamsWithCursor & QuerySeriesDto,
  ): Promise<ApiResponseCursor<Series>> {
    const response = await http.get<ApiResponseCursor<Series>>(
      `${this.BASE_URL}/cursor`,
      { params },
    );
    return response.data;
  }

  /**
   * Get AniList media list
   * Fetches paginated list from AniList API
   */
  static async getAniListMediaList(
    page?: number,
    perPage?: number,
  ): Promise<ApiResponse<unknown>> {
    const params: Record<string, string> = {};
    if (page !== undefined) params.page = page.toString();
    if (perPage !== undefined) params.perPage = perPage.toString();
    const response = await http.get<ApiResponse<unknown>>(
      `${this.BASE_URL}/anilist`,
      { params },
    );
    return response.data;
  }

  /**
   * Get AniList media by AniList ID
   */
  static async getAniListMediaById(
    anilistId: number,
  ): Promise<ApiResponse<unknown>> {
    const response = await http.get<ApiResponse<unknown>>(
      `${this.BASE_URL}/anilist/${anilistId}`,
    );
    return response.data;
  }

  /**
   * Save AniList media by AniList ID
   */
  static async saveAniListMediaById(
    anilistId: number,
  ): Promise<ApiResponse<Series>> {
    const response = await http.get<ApiResponse<Series>>(
      `${this.BASE_URL}/anilist/${anilistId}/save`,
    );
    return response.data;
  }

  /**
   * Trigger AniList crawl job
   */
  static async triggerAniListCrawl(
    type?: SeriesType,
  ): Promise<ApiResponse<{ jobId: string; type: string }>> {
    const params = type ? { type } : {};
    const response = await http.get<
      ApiResponse<{ jobId: string; type: string }>
    >(`${this.BASE_URL}/anilist/crawl`, { params });
    return response.data;
  }

  // ==================== Segments (Chapters/Episodes) ====================

  /**
   * Create a new segment for a series
   * Requires authentication
   */
  static async createSegment(
    seriesId: string,
    data: CreateSegmentDto,
  ): Promise<SeriesSegment> {
    const response = await http.post<ApiResponse<SeriesSegment>>(
      `${this.BASE_URL}/${seriesId}/segments`,
      data,
    );
    return response.data.data;
  }

  /**
   * Get all segments for a series
   */
  static async getSegments(
    seriesId: string,
    params?: AdvancedQueryParams,
  ): Promise<ApiResponseOffset<SeriesSegment>> {
    const response = await http.get<ApiResponseOffset<SeriesSegment>>(
      `${this.BASE_URL}/${seriesId}/segments`,
      { params },
    );
    return response.data;
  }

  /**
   * Get a segment by ID
   */
  static async getSegment(
    seriesId: string,
    segmentId: string,
  ): Promise<SeriesSegment> {
    const response = await http.get<ApiResponse<SeriesSegment>>(
      `${this.BASE_URL}/${seriesId}/segments/${segmentId}`,
    );
    return response.data.data;
  }

  /**
   * Update a segment
   * Requires authentication
   */
  static async updateSegment(
    seriesId: string,
    segmentId: string,
    data: UpdateSegmentDto,
  ): Promise<SeriesSegment> {
    const response = await http.patch<ApiResponse<SeriesSegment>>(
      `${this.BASE_URL}/${seriesId}/segments/${segmentId}`,
      data,
    );
    return response.data.data;
  }

  /**
   * Delete a segment (soft delete)
   * Requires authentication
   */
  static async deleteSegment(
    seriesId: string,
    segmentId: string,
  ): Promise<void> {
    await http.delete<ApiResponse<void>>(
      `${this.BASE_URL}/${seriesId}/segments/${segmentId}`,
    );
  }
}
