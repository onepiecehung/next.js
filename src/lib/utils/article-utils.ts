import { ARTICLE_CONSTANTS } from "@/lib/constants";
import type { Article } from "@/lib/interface";

/**
 * Simple article utilities
 * Clean, reusable functions without over-engineering
 */

// Status helpers
export const getStatusText = (status: string) => {
  const statusMap = {
    [ARTICLE_CONSTANTS.STATUS.PUBLISHED]: "Published",
    [ARTICLE_CONSTANTS.STATUS.DRAFT]: "Draft",
    [ARTICLE_CONSTANTS.STATUS.SCHEDULED]: "Scheduled",
    [ARTICLE_CONSTANTS.STATUS.ARCHIVED]: "Archived",
  } as const;
  return statusMap[status as keyof typeof statusMap] ?? "Unknown";
};

export const getVisibilityText = (visibility: string) => {
  const visibilityMap = {
    [ARTICLE_CONSTANTS.VISIBILITY.PUBLIC]: "Public",
    [ARTICLE_CONSTANTS.VISIBILITY.UNLISTED]: "Unlisted",
    [ARTICLE_CONSTANTS.VISIBILITY.PRIVATE]: "Private",
  } as const;
  return visibilityMap[visibility as keyof typeof visibilityMap] ?? "Unknown";
};

// Color helpers
export const getStatusColor = (status: string) => {
  const colorMap = {
    [ARTICLE_CONSTANTS.STATUS.PUBLISHED]: "text-green-600 bg-green-50",
    [ARTICLE_CONSTANTS.STATUS.DRAFT]: "text-yellow-600 bg-yellow-50",
    [ARTICLE_CONSTANTS.STATUS.SCHEDULED]: "text-blue-600 bg-blue-50",
    [ARTICLE_CONSTANTS.STATUS.ARCHIVED]: "text-gray-600 bg-gray-50",
  } as const;
  return (
    colorMap[status as keyof typeof colorMap] ?? "text-gray-600 bg-gray-50"
  );
};

// Calculation helpers
export const calculateReadTime = (content: string) => {
  if (!content) return 1;
  const wordCount = content
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

export const calculateWordCount = (content: string) => {
  if (!content) return 0;
  return content.split(/\s+/).filter((word) => word.length > 0).length;
};

// Date formatting
export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString();
};

// Simple article formatting
export const formatArticle = (article: Article) => ({
  ...article,
  readTime: calculateReadTime(article.content || ""),
  wordCount: calculateWordCount(article.content || ""),
  formattedDate: formatDate(article.createdAt),
  statusText: getStatusText(article.status),
  visibilityText: getVisibilityText(article.visibility),
  statusColor: getStatusColor(article.status),
  tags: article.tags || [], // Ensure tags is always an array
});

// Form validation
export const validateArticleForm = (data: {
  title: string;
  content: string;
  tags?: string[];
}) => {
  const errors: Record<string, string> = {};

  if (!data.title?.trim()) {
    errors.title = "Title is required";
  }

  if (!data.content?.trim() || data.content.trim() === "<p></p>") {
    errors.content = "Content is required";
  }

  if (data.tags && data.tags.length > 20) {
    errors.tags = "Maximum 20 tags allowed";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
