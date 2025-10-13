/**
 * Pagination Usage Examples
 * Demonstrates how to use the new pagination types and PaginationFormatter
 */

import type {
    ApiResponseCursor,
    ApiResponseOffset,
    PaginationCursor,
    PaginationOffset
} from "@/lib/types";
import { PaginationFormatter } from "@/lib/utils/pagination";

// ============================================================================
// Example Data Types
// ============================================================================

interface Article {
  id: string;
  title: string;
  createdAt: string;
  authorId: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// ============================================================================
// Offset Pagination Examples
// ============================================================================

/**
 * Example: Get articles with offset pagination
 */
export async function getArticlesOffset(
  page: number = 1,
  limit: number = 10
): Promise<PaginationOffset<Article>> {
  // Validate parameters
  const validation = PaginationFormatter.validateOffsetParams(page, limit, 50);
  if (!validation.isValid) {
    throw new Error(`Invalid pagination parameters: ${validation.errors.join(', ')}`);
  }

  // Mock API call
  const mockArticles: Article[] = [
    { id: '1', title: 'Article 1', createdAt: '2024-01-01', authorId: 'user1' },
    { id: '2', title: 'Article 2', createdAt: '2024-01-02', authorId: 'user2' },
    // ... more articles
  ];

  const totalArticles = 100; // Mock total count

  // Format response using PaginationFormatter
  return PaginationFormatter.offset(
    mockArticles,
    totalArticles,
    validation.page,
    validation.limit
  );
}

/**
 * Example: Empty offset pagination response
 */
export function getEmptyArticlesOffset(): PaginationOffset<Article> {
  return PaginationFormatter.emptyOffset(1, 10);
}

// ============================================================================
// Cursor Pagination Examples
// ============================================================================

/**
 * Example: Get articles with offset pagination (API Response)
 */
export async function getArticlesOffsetAPI(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponseOffset<Article>> {
  // Validate parameters
  const validation = PaginationFormatter.validateOffsetParams(page, limit, 50);
  if (!validation.isValid) {
    throw new Error(`Invalid pagination parameters: ${validation.errors.join(', ')}`);
  }

  // Mock API call
  const mockArticles: Article[] = [
    { id: '1', title: 'Article 1', createdAt: '2024-01-01', authorId: 'user1' },
    { id: '2', title: 'Article 2', createdAt: '2024-01-02', authorId: 'user2' },
    // ... more articles
  ];

  const totalArticles = 100; // Mock total count

  // Format response using PaginationFormatter
  const paginatedData = PaginationFormatter.offset(
    mockArticles,
    totalArticles,
    validation.page,
    validation.limit
  );

  // Return API response format
  return {
    success: true,
    data: paginatedData,
    message: 'Articles retrieved successfully',
    metadata: {
      messageKey: 'articles.retrieved.success',
      messageArgs: {
        page: validation.page,
        limit: validation.limit,
        total: totalArticles
      }
    }
  };
}

/**
 * Example: Get articles with cursor pagination (API Response)
 */
export async function getArticlesCursorAPI(
  cursor?: string | null,
  limit: number = 10,
  sortBy: string = 'createdAt',
  order: 'ASC' | 'DESC' = 'DESC'
): Promise<ApiResponseCursor<Article>> {
  // Validate parameters
  const validation = PaginationFormatter.validateCursorParams(limit, 50);
  if (!validation.isValid) {
    throw new Error(`Invalid pagination parameters: ${validation.errors.join(', ')}`);
  }

  // Mock API call with cursor
  const mockArticles: Article[] = [
    { id: '1', title: 'Article 1', createdAt: '2024-01-01', authorId: 'user1' },
    { id: '2', title: 'Article 2', createdAt: '2024-01-02', authorId: 'user2' },
    // ... more articles
  ];

  // Format response using PaginationFormatter
  const paginatedData = PaginationFormatter.cursor(
    mockArticles,
    validation.limit,
    'id', // cursorKey
    sortBy,
    order,
    cursor
  );

  // Return API response format
  return {
    success: true,
    data: paginatedData,
    message: 'Articles retrieved successfully',
    metadata: {
      messageKey: 'articles.retrieved.success',
      messageArgs: {
        cursor,
        limit: validation.limit,
        sortBy,
        order
      }
    }
  };
}

/**
 * Example: Get users with cursor pagination
 */
export async function getUsersCursor(
  cursor?: string | null,
  limit: number = 20
): Promise<PaginationCursor<User>> {
  const validation = PaginationFormatter.validateCursorParams(limit, 100);
  if (!validation.isValid) {
    throw new Error(`Invalid pagination parameters: ${validation.errors.join(', ')}`);
  }

  const mockUsers: User[] = [
    { id: '1', username: 'user1', email: 'user1@example.com', createdAt: '2024-01-01' },
    { id: '2', username: 'user2', email: 'user2@example.com', createdAt: '2024-01-02' },
    // ... more users
  ];

  return PaginationFormatter.cursor(
    mockUsers,
    validation.limit,
    'id', // cursorKey
    'createdAt',
    'DESC',
    cursor
  );
}

/**
 * Example: Empty cursor pagination response
 */
export function getEmptyArticlesCursor(): PaginationCursor<Article> {
  return PaginationFormatter.emptyCursor(10, 'createdAt', 'DESC');
}

// ============================================================================
// Migration Examples
// ============================================================================

/**
 * Example: Convert offset pagination to cursor pagination metadata
 */
export function migrateOffsetToCursor(
  offsetResponse: PaginationOffset<Article>
): PaginationCursorMeta {
  return PaginationFormatter.offsetToCursorMeta(
    offsetResponse.metaData,
    'createdAt',
    'DESC'
  );
}

// ============================================================================
// API Response Examples
// ============================================================================

/**
 * Example: Complete API response with offset pagination
 */
export interface ArticlesOffsetResponse {
  success: true;
  data: PaginationOffset<Article>;
  message: string;
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}

/**
 * Example: Complete API response with cursor pagination
 */
export interface ArticlesCursorResponse {
  success: true;
  data: PaginationCursor<Article>;
  message: string;
  metadata: {
    messageKey: string;
    messageArgs: Record<string, unknown>;
  };
}

// ============================================================================
// Usage in Components/Hooks
// ============================================================================

/**
 * Example: React hook for offset pagination
 */
export function useArticlesOffset(page: number, limit: number) {
  // Implementation would use React Query or SWR
  // return useQuery(['articles', 'offset', page, limit], () => getArticlesOffset(page, limit));
}

/**
 * Example: React hook for cursor pagination
 */
export function useArticlesCursor(cursor?: string | null, limit: number = 10) {
  // Implementation would use React Query or SWR
  // return useQuery(['articles', 'cursor', cursor, limit], () => getArticlesCursor(cursor, limit));
}

/**
 * Example: Infinite scroll with cursor pagination
 */
export function useInfiniteArticlesCursor() {
  // Implementation would use React Query's useInfiniteQuery
  // return useInfiniteQuery(
  //   ['articles', 'infinite'],
  //   ({ pageParam }) => getArticlesCursor(pageParam, 10),
  //   {
  //     getNextPageParam: (lastPage) => lastPage.metaData.nextCursor,
  //   }
  // );
}
