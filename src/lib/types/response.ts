/**
 * API Response Type Definitions
 * Contains generic API response structures, error handling, and pagination types
 */

// ============================================================================
// Base API Response Structure
// ============================================================================

/**
 * Common metadata structure shared across all API responses
 * Contains internationalization keys and arguments for message translation
 */
export interface ApiResponseMetadata {
  messageKey: string;
  messageArgs: Record<string, unknown>;
}

/**
 * Base API response structure containing common fields
 * Follows Single Responsibility Principle by separating common fields
 */
export interface BaseApiResponse {
  success: boolean;
  message: string;
  metadata: ApiResponseMetadata;
}

/**
 * Base API Response structure used across all endpoints
 * All API responses follow this consistent format
 */
export interface ApiResponse<T = unknown> extends BaseApiResponse {
  data: T;
}

/**
 * API Response with Offset Pagination
 * Used for endpoints that return paginated data with offset-based pagination
 */
export interface ApiResponseOffset<T = unknown> extends BaseApiResponse {
  data: PaginationOffset<T>;
}

/**
 * API Response with Cursor Pagination
 * Used for endpoints that return paginated data with cursor-based pagination
 */
export interface ApiResponseCursor<T = unknown> extends BaseApiResponse {
  data: PaginationCursor<T>;
}

/**
 * Generic API Response that can handle both pagination types
 * Use this when you need to support both offset and cursor pagination
 */
export type ApiResponsePaginated<T = unknown> =
  | ApiResponseOffset<T>
  | ApiResponseCursor<T>;

// ============================================================================
// Error Response Types
// ============================================================================

/**
 * Error details structure for API error responses
 * Contains error code and optional additional details
 */
export interface ApiErrorDetails {
  code: string;
  details?: Record<string, unknown>;
}

/**
 * Generic error response structure
 * Used for all API error responses
 * Extends BaseApiResponse but overrides success to false and adds error details
 */
export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  error?: ApiErrorDetails;
}

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Offset-based pagination metadata
 * Used for traditional page-based pagination
 */
export interface PaginationOffsetMeta {
  currentPage?: number;
  pageSize: number;
  totalRecords?: number;
  totalPages?: number;
  nextCursor?: string | null;
  hasNextPage?: boolean;
}

/**
 * Offset-based pagination response structure
 * Used for page-based pagination (page 1, 2, 3...)
 */
export interface PaginationOffset<T = unknown> {
  result: T[];
  metaData: PaginationOffsetMeta;
}

/**
 * Cursor-based pagination metadata
 * Used for cursor-based pagination (more efficient for large datasets)
 */
export interface PaginationCursorMeta {
  nextCursor?: string | null;
  prevCursor?: string | null;
  take: number;
  sortBy: string;
  order: "ASC" | "DESC";
}

/**
 * Cursor-based pagination response structure
 * Used for cursor-based pagination (more efficient for large datasets)
 */
export interface PaginationCursor<T = unknown> {
  result: T[];
  metaData: PaginationCursorMeta;
}

/**
 * Legacy pagination metadata structure (deprecated)
 * @deprecated Use PaginationOffsetMeta or PaginationCursorMeta instead
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Legacy paginated response structure (deprecated)
 * @deprecated Use PaginationOffset or PaginationCursor instead
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// ============================================================================
// Common Response Types
// ============================================================================

/**
 * Common success response structure
 * Used for simple success responses without data payload
 * Extends BaseApiResponse but ensures success is true
 */
export interface SuccessResponse extends BaseApiResponse {
  success: true;
}
