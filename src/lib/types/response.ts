/**
 * API Response Type Definitions
 * Contains generic API response structures, error handling, and pagination types
 */

// ============================================================================
// Base API Response Structure
// ============================================================================

/**
 * Base API Response structure used across all endpoints
 * All API responses follow this consistent format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}

// ============================================================================
// Error Response Types
// ============================================================================

/**
 * Generic error response structure
 * Used for all API error responses
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: Record<string, unknown>;
  };
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Pagination metadata structure
 * Used in list responses for pagination information
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response structure
 * Generic wrapper for paginated list responses
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
 */
export interface SuccessResponse {
  success: true;
  message: string;
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}

