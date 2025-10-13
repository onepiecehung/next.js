import type {
  PaginationCursor,
  PaginationCursorMeta,
  PaginationOffset,
  PaginationOffsetMeta,
} from "../types/response";

/**
 * Pagination Formatter Utility
 * Provides static methods to format pagination data for both offset and cursor-based pagination
 */
export class PaginationFormatter {
  /**
   * Format data for offset-based pagination
   * @param data - Array of data items
   * @param total - Total number of records
   * @param page - Current page number (1-based)
   * @param limit - Number of items per page
   * @returns Formatted pagination response
   */
  static offset<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginationOffset<T> {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;

    return {
      result: data,
      metaData: {
        currentPage: page,
        pageSize: limit,
        totalRecords: total,
        totalPages,
        hasNextPage,
        nextCursor: hasNextPage ? String(page + 1) : null,
      },
    };
  }

  /**
   * Format data for cursor-based pagination
   * @param data - Array of data items
   * @param limit - Number of items per page
   * @param cursorKey - Key to use for cursor generation
   * @param sortBy - Field name to sort by
   * @param order - Sort order (ASC or DESC)
   * @param prevCursor - Previous cursor (optional)
   * @returns Formatted cursor pagination response
   */
  static cursor<T>(
    data: T[],
    limit: number,
    cursorKey: keyof T,
    sortBy: string,
    order: "ASC" | "DESC" = "DESC",
    prevCursor?: string | null,
  ): PaginationCursor<T> {
    const hasNextPage = data.length === limit;
    const nextCursor =
      hasNextPage && data.length > 0
        ? String(data[data.length - 1][cursorKey])
        : null;

    return {
      result: data,
      metaData: {
        nextCursor,
        prevCursor: prevCursor || null,
        take: limit,
        sortBy,
        order,
      },
    };
  }

  /**
   * Create empty pagination response for offset-based pagination
   * @param page - Current page number
   * @param limit - Number of items per page
   * @returns Empty pagination response
   */
  static emptyOffset<T>(page: number, limit: number): PaginationOffset<T> {
    return {
      result: [],
      metaData: {
        currentPage: page,
        pageSize: limit,
        totalRecords: 0,
        totalPages: 0,
        hasNextPage: false,
        nextCursor: null,
      },
    };
  }

  /**
   * Create empty pagination response for cursor-based pagination
   * @param limit - Number of items per page
   * @param sortBy - Field name to sort by
   * @param order - Sort order (ASC or DESC)
   * @param prevCursor - Previous cursor (optional)
   * @returns Empty cursor pagination response
   */
  static emptyCursor<T>(
    limit: number,
    sortBy: string,
    order: "ASC" | "DESC" = "DESC",
    prevCursor?: string | null,
  ): PaginationCursor<T> {
    return {
      result: [],
      metaData: {
        nextCursor: null,
        prevCursor: prevCursor || null,
        take: limit,
        sortBy,
        order,
      },
    };
  }

  /**
   * Convert offset pagination to cursor pagination metadata
   * Useful for migration or when you need to switch pagination types
   * @param offsetMeta - Offset pagination metadata
   * @param sortBy - Field name to sort by
   * @param order - Sort order (ASC or DESC)
   * @returns Cursor pagination metadata
   */
  static offsetToCursorMeta(
    offsetMeta: PaginationOffsetMeta,
    sortBy: string,
    order: "ASC" | "DESC" = "DESC",
  ): PaginationCursorMeta {
    return {
      nextCursor: offsetMeta.nextCursor,
      prevCursor: null, // Offset doesn't have prev cursor concept
      take: offsetMeta.pageSize,
      sortBy,
      order,
    };
  }

  /**
   * Validate pagination parameters
   * @param page - Page number (for offset pagination)
   * @param limit - Number of items per page
   * @param maxLimit - Maximum allowed limit
   * @returns Validation result with normalized values
   */
  static validateOffsetParams(
    page?: number,
    limit?: number,
    maxLimit: number = 100,
  ): { page: number; limit: number; isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Normalize page (1-based)
    const normalizedPage = Math.max(1, page || 1);

    // Normalize limit
    const normalizedLimit = Math.min(Math.max(1, limit || 10), maxLimit);

    // Validation
    if (page !== undefined && page < 1) {
      errors.push("Page must be greater than 0");
    }

    if (limit !== undefined && limit < 1) {
      errors.push("Limit must be greater than 0");
    }

    if (limit !== undefined && limit > maxLimit) {
      errors.push(`Limit cannot exceed ${maxLimit}`);
    }

    return {
      page: normalizedPage,
      limit: normalizedLimit,
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate cursor pagination parameters
   * @param limit - Number of items per page
   * @param maxLimit - Maximum allowed limit
   * @returns Validation result with normalized values
   */
  static validateCursorParams(
    limit?: number,
    maxLimit: number = 100,
  ): { limit: number; isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Normalize limit
    const normalizedLimit = Math.min(Math.max(1, limit || 10), maxLimit);

    // Validation
    if (limit !== undefined && limit < 1) {
      errors.push("Limit must be greater than 0");
    }

    if (limit !== undefined && limit > maxLimit) {
      errors.push(`Limit cannot exceed ${maxLimit}`);
    }

    return {
      limit: normalizedLimit,
      isValid: errors.length === 0,
      errors,
    };
  }
}
