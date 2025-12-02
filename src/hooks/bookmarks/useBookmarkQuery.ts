import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { BookmarksAPI } from "@/lib/api/bookmarks";
import type {
  Bookmark,
  BookmarkFolder,
  CreateBookmarkDto,
  CreateBookmarkFolderDto,
  QueryBookmarkFoldersDto,
  QueryBookmarksDto,
  UpdateBookmarkDto,
  UpdateBookmarkFolderDto,
} from "@/lib/api/bookmarks";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for fetching user's bookmarks
 */
export function useBookmarks(params?: QueryBookmarksDto) {
  return useQuery({
    queryKey: queryKeys.bookmarks.list(params),
    queryFn: () => BookmarksAPI.getUserBookmarks(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching a single bookmark
 */
export function useBookmark(bookmarkId: string) {
  return useQuery({
    queryKey: queryKeys.bookmarks.detail(bookmarkId),
    queryFn: () => BookmarksAPI.getBookmark(bookmarkId),
    enabled: !!bookmarkId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching bookmark statistics
 */
export function useBookmarkStats() {
  return useQuery({
    queryKey: queryKeys.bookmarks.stats(),
    queryFn: () => BookmarksAPI.getBookmarkStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating a bookmark
 */
export function useCreateBookmark() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookmarkDto) => BookmarksAPI.createBookmark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.stats(),
      });
      toast.success(
        t("bookmarkCreated", "bookmarks") || "Bookmark created successfully",
      );
    },
    onError: (error) => {
      console.error("Create bookmark error:", error);
      toast.error(
        t("bookmarkCreateError", "bookmarks") || "Failed to create bookmark",
      );
    },
  });
}

/**
 * Hook for updating a bookmark
 */
export function useUpdateBookmark() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookmarkId,
      data,
    }: {
      bookmarkId: string;
      data: UpdateBookmarkDto;
    }) => BookmarksAPI.updateBookmark(bookmarkId, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.bookmarks.detail(variables.bookmarkId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all(),
      });
      toast.success(
        t("bookmarkUpdated", "bookmarks") || "Bookmark updated successfully",
      );
    },
    onError: (error) => {
      console.error("Update bookmark error:", error);
      toast.error(
        t("bookmarkUpdateError", "bookmarks") || "Failed to update bookmark",
      );
    },
  });
}

/**
 * Hook for deleting a bookmark
 */
export function useDeleteBookmark() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmarkId: string) => BookmarksAPI.removeBookmark(bookmarkId),
    onSuccess: (_, bookmarkId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.bookmarks.detail(bookmarkId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.stats(),
      });
      toast.success(
        t("bookmarkDeleted", "bookmarks") || "Bookmark deleted successfully",
      );
    },
    onError: (error) => {
      console.error("Delete bookmark error:", error);
      toast.error(
        t("bookmarkDeleteError", "bookmarks") || "Failed to delete bookmark",
      );
    },
  });
}

// Folder hooks

/**
 * Hook for fetching user's bookmark folders
 */
export function useBookmarkFolders(params?: QueryBookmarkFoldersDto) {
  return useQuery({
    queryKey: queryKeys.bookmarks.folders.list(params),
    queryFn: () => BookmarksAPI.getUserFolders(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching a single bookmark folder
 */
export function useBookmarkFolder(folderId: string) {
  return useQuery({
    queryKey: queryKeys.bookmarks.folders.detail(folderId),
    queryFn: () => BookmarksAPI.getFolder(folderId),
    enabled: !!folderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating a bookmark folder
 */
export function useCreateBookmarkFolder() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookmarkFolderDto) =>
      BookmarksAPI.createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.folders.all(),
      });
      toast.success(
        t("folderCreated", "bookmarks") || "Folder created successfully",
      );
    },
    onError: (error) => {
      console.error("Create folder error:", error);
      toast.error(
        t("folderCreateError", "bookmarks") || "Failed to create folder",
      );
    },
  });
}

/**
 * Hook for updating a bookmark folder
 */
export function useUpdateBookmarkFolder() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      folderId,
      data,
    }: {
      folderId: string;
      data: UpdateBookmarkFolderDto;
    }) => BookmarksAPI.updateFolder(folderId, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.bookmarks.folders.detail(variables.folderId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.folders.all(),
      });
      toast.success(
        t("folderUpdated", "bookmarks") || "Folder updated successfully",
      );
    },
    onError: (error) => {
      console.error("Update folder error:", error);
      toast.error(
        t("folderUpdateError", "bookmarks") || "Failed to update folder",
      );
    },
  });
}

/**
 * Hook for deleting a bookmark folder
 */
export function useDeleteBookmarkFolder() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderId: string) => BookmarksAPI.deleteFolder(folderId),
    onSuccess: (_, folderId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.bookmarks.folders.detail(folderId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.folders.all(),
      });
      toast.success(
        t("folderDeleted", "bookmarks") || "Folder deleted successfully",
      );
    },
    onError: (error) => {
      console.error("Delete folder error:", error);
      toast.error(
        t("folderDeleteError", "bookmarks") || "Failed to delete folder",
      );
    },
  });
}
