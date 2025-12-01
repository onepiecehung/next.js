import { http } from "@/lib/http";
import type {
  AdvancedQueryParams,
  ApiResponse,
  ApiResponseOffset,
} from "@/lib/types";

/**
 * Bookmark interfaces based on backend DTOs
 */
export interface Bookmark {
  id: string;
  userId: string;
  bookmarkableType: string;
  bookmarkableId: string;
  folderId?: string;
  note?: string;
  tags?: string[];
  isFavorite?: boolean;
  isReadLater?: boolean;
  sortOrder?: number;
  status?: string;
  createdAt: string;
  updatedAt: string;
  folder?: BookmarkFolder;
  bookmarkable?: unknown; // The actual bookmarked content (article, series, etc.)
}

export interface BookmarkFolder {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type?: string;
  visibility?: string;
  sortOrder?: number;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookmarks: number;
  };
}

export interface CreateBookmarkDto {
  bookmarkableType: string;
  bookmarkableId: string;
  folderId?: string;
  note?: string;
  tags?: string[];
  isFavorite?: boolean;
  isReadLater?: boolean;
  sortOrder?: number;
}

export interface UpdateBookmarkDto {
  folderId?: string;
  note?: string;
  tags?: string[];
  isFavorite?: boolean;
  isReadLater?: boolean;
  sortOrder?: number;
  status?: string;
}

export interface CreateBookmarkFolderDto {
  name: string;
  description?: string;
  type?: string;
  visibility?: string;
  sortOrder?: number;
  color?: string;
  icon?: string;
}

export interface UpdateBookmarkFolderDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  isDefault?: boolean;
}

export interface QueryBookmarksDto extends AdvancedQueryParams {
  bookmarkableType?: string;
  folderId?: string;
  status?: string;
  tags?: string;
  isFavorite?: boolean;
  isReadLater?: boolean;
  search?: string;
}

export interface QueryBookmarkFoldersDto extends AdvancedQueryParams {
  includeBookmarks?: boolean;
}

export interface BookmarkStats {
  totalBookmarks: number;
  activeBookmarks: number;
  archivedBookmarks: number;
  favoriteBookmarks: number;
  readLaterBookmarks: number;
  totalFolders: number;
  bookmarksByType: Record<string, number>;
  topTags: Array<{ tag: string; count: number }>;
  foldersWithCounts: Array<{
    folderId: string;
    folderName: string;
    bookmarkCount: number;
  }>;
}

/**
 * Bookmarks API wrapper
 * Handles all bookmark-related API calls
 */
export class BookmarksAPI {
  private static readonly BASE_URL = "/bookmarks";

  /**
   * Create a new bookmark
   */
  static async createBookmark(
    data: CreateBookmarkDto,
  ): Promise<ApiResponse<Bookmark>> {
    const response = await http.post<ApiResponse<Bookmark>>(
      this.BASE_URL,
      data,
    );
    return response.data;
  }

  /**
   * Get user's bookmarks with filtering and pagination
   */
  static async getUserBookmarks(
    params?: QueryBookmarksDto,
  ): Promise<ApiResponseOffset<Bookmark>> {
    const response = await http.get<ApiResponseOffset<Bookmark>>(
      this.BASE_URL,
      { params },
    );
    return response.data;
  }

  /**
   * Get a specific bookmark
   */
  static async getBookmark(bookmarkId: string): Promise<ApiResponse<Bookmark>> {
    const response = await http.get<ApiResponse<Bookmark>>(
      `${this.BASE_URL}/${bookmarkId}`,
    );
    return response.data;
  }

  /**
   * Update a bookmark
   */
  static async updateBookmark(
    bookmarkId: string,
    data: UpdateBookmarkDto,
  ): Promise<ApiResponse<Bookmark>> {
    const response = await http.put<ApiResponse<Bookmark>>(
      `${this.BASE_URL}/${bookmarkId}`,
      data,
    );
    return response.data;
  }

  /**
   * Remove a bookmark
   */
  static async removeBookmark(bookmarkId: string): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(
      `${this.BASE_URL}/${bookmarkId}`,
    );
    return response.data;
  }

  /**
   * Get bookmark statistics
   */
  static async getBookmarkStats(): Promise<ApiResponse<BookmarkStats>> {
    const response = await http.get<ApiResponse<BookmarkStats>>(
      `${this.BASE_URL}/stats/overview`,
    );
    return response.data;
  }

  // Folder endpoints

  /**
   * Create a new bookmark folder
   */
  static async createFolder(
    data: CreateBookmarkFolderDto,
  ): Promise<ApiResponse<BookmarkFolder>> {
    const response = await http.post<ApiResponse<BookmarkFolder>>(
      `${this.BASE_URL}/folders`,
      data,
    );
    return response.data;
  }

  /**
   * Get user's bookmark folders
   */
  static async getUserFolders(
    params?: QueryBookmarkFoldersDto,
  ): Promise<ApiResponseOffset<BookmarkFolder>> {
    const response = await http.get<ApiResponseOffset<BookmarkFolder>>(
      `${this.BASE_URL}/folders`,
      { params },
    );
    return response.data;
  }

  /**
   * Get a specific folder
   */
  static async getFolder(
    folderId: string,
  ): Promise<ApiResponse<BookmarkFolder>> {
    const response = await http.get<ApiResponse<BookmarkFolder>>(
      `${this.BASE_URL}/folders/${folderId}`,
    );
    return response.data;
  }

  /**
   * Update a folder
   */
  static async updateFolder(
    folderId: string,
    data: UpdateBookmarkFolderDto,
  ): Promise<ApiResponse<BookmarkFolder>> {
    const response = await http.put<ApiResponse<BookmarkFolder>>(
      `${this.BASE_URL}/folders/${folderId}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete a folder
   */
  static async deleteFolder(folderId: string): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(
      `${this.BASE_URL}/folders/${folderId}`,
    );
    return response.data;
  }
}

