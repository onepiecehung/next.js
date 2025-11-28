/**
 * Series utility functions
 * Helper functions for transforming and formatting series data
 */

import type {
  BackendSeries,
  Series,
  SeriesLanguage,
} from "@/lib/interface/series.interface";

/**
 * Extract title from backend series title object
 */
function extractTitle(backendSeries: BackendSeries): string {
  if (!backendSeries.title) {
    return "Untitled";
  }
  return (
    backendSeries.title.userPreferred ||
    backendSeries.title.romaji ||
    backendSeries.title.english ||
    backendSeries.title.native ||
    "Untitled"
  );
}

/**
 * Extract cover URL from backend series
 */
function extractCoverUrl(backendSeries: BackendSeries): string {
  // Priority: coverImage.url > coverImageUrls.large > coverImageUrls.medium > default
  if (backendSeries.coverImage?.url) {
    return backendSeries.coverImage.url;
  }
  if (backendSeries.coverImageUrls?.large) {
    return backendSeries.coverImageUrls.large;
  }
  if (backendSeries.coverImageUrls?.medium) {
    return backendSeries.coverImageUrls.medium;
  }
  // Default placeholder
  return "/default-article-cover.jpg";
}

/**
 * Extract language from backend series
 */
function extractLanguage(backendSeries: BackendSeries): SeriesLanguage {
  // Map country codes to language codes
  const countryToLanguage: Record<string, SeriesLanguage> = {
    JP: "ja",
    US: "en",
    GB: "en",
    VN: "vi",
    CN: "zh",
    KR: "ko",
    PT: "pt",
    BR: "pt",
    FR: "fr",
  };

  if (backendSeries.countryOfOrigin) {
    const lang = countryToLanguage[backendSeries.countryOfOrigin];
    if (lang) return lang;
  }

  // Default to Japanese for anime/manga
  return "ja";
}

/**
 * Extract tags from backend series
 */
function extractTags(backendSeries: BackendSeries): string[] {
  if (!backendSeries.tags || backendSeries.tags.length === 0) {
    return [];
  }
  return backendSeries.tags.map((tag) => tag.name);
}

/**
 * Extract author from backend series
 */
function extractAuthor(backendSeries: BackendSeries): string {
  if (!backendSeries.authorRoles || backendSeries.authorRoles.length === 0) {
    return "Unknown";
  }

  // Get main author first, or first author
  const mainAuthor = backendSeries.authorRoles.find((ar) => ar.isMain);
  const author = mainAuthor || backendSeries.authorRoles[0];

  return author.author?.name || "Unknown";
}

/**
 * Extract additional links from backend series
 */
function extractAdditionalLinks(
  backendSeries: BackendSeries,
): Array<{ label: string; url: string }> {
  if (!backendSeries.externalLinks) {
    return [];
  }

  return Object.entries(backendSeries.externalLinks).map(([label, url]) => ({
    label,
    url,
  }));
}

/**
 * Transform backend series to frontend series format
 */
export function transformBackendSeries(backendSeries: BackendSeries): Series {
  return {
    id: backendSeries.id,
    title: extractTitle(backendSeries),
    coverUrl: extractCoverUrl(backendSeries),
    language: extractLanguage(backendSeries),
    tags: extractTags(backendSeries),
    description: backendSeries.description || "",
    author: extractAuthor(backendSeries),
    additionalLinks: extractAdditionalLinks(backendSeries),
    timestamp: backendSeries.updatedAt || backendSeries.createdAt,
    // Additional fields
    type: backendSeries.type,
    format: backendSeries.format,
    status: backendSeries.status,
    averageScore: backendSeries.averageScore,
    popularity: backendSeries.popularity,
    trending: backendSeries.trending,
    isNsfw: backendSeries.isNsfw,
    isLicensed: backendSeries.isLicensed,
    season: backendSeries.season,
    seasonYear: backendSeries.seasonYear,
  };
}

/**
 * Transform array of backend series to frontend series format
 */
export function transformBackendSeriesList(
  backendSeriesList: BackendSeries[],
): Series[] {
  return backendSeriesList.map(transformBackendSeries);
}

/**
 * Transform backend series to popular series format
 */
export function transformToPopularSeries(
  backendSeries: BackendSeries,
): Series & {
  views?: number;
  likes?: number;
  rating?: number;
} {
  const base = transformBackendSeries(backendSeries);
  return {
    ...base,
    views: backendSeries.popularity
      ? Math.floor(backendSeries.popularity)
      : undefined,
    likes: backendSeries.favoriteCount,
    rating: backendSeries.averageScore,
  };
}
