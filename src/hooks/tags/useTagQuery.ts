import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { TagsAPI } from "@/lib/api/tags";
import type {
  CreateTagDto,
  QueryTagsDto,
  UpdateTagDto,
} from "@/lib/api/tags";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for fetching tags with pagination and filtering
 */
export function useTags(params?: QueryTagsDto) {
  return useQuery({
    queryKey: queryKeys.tags.list(params),
    queryFn: () => TagsAPI.getTags(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching a single tag by ID
 */
export function useTag(tagId: string) {
  return useQuery({
    queryKey: queryKeys.tags.detail(tagId),
    queryFn: () => TagsAPI.getTagById(tagId),
    enabled: !!tagId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a tag by slug
 */
export function useTagBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.tags.bySlug(slug),
    queryFn: () => TagsAPI.getTagBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching popular tags
 */
export function usePopularTags(limit?: number) {
  return useQuery({
    queryKey: queryKeys.tags.popular(),
    queryFn: () => TagsAPI.getPopularTags(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching trending tags
 */
export function useTrendingTags(limit?: number) {
  return useQuery({
    queryKey: queryKeys.tags.trending(),
    queryFn: () => TagsAPI.getTrendingTags(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching featured tags
 */
export function useFeaturedTags(limit?: number) {
  return useQuery({
    queryKey: queryKeys.tags.featured(),
    queryFn: () => TagsAPI.getFeaturedTags(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching tag suggestions based on content
 */
export function useTagSuggestions(content: string) {
  return useQuery({
    queryKey: queryKeys.tags.suggestions(content),
    queryFn: () => TagsAPI.getContentSuggestions(content),
    enabled: !!content && content.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching tag statistics
 */
export function useTagStats() {
  return useQuery({
    queryKey: queryKeys.tags.stats(),
    queryFn: () => TagsAPI.getTagStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for creating a tag
 */
export function useCreateTag() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagDto) => TagsAPI.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags.stats(),
      });
      toast.success(t("tagCreated", "tags") || "Tag created successfully");
    },
    onError: (error) => {
      console.error("Create tag error:", error);
      toast.error(t("tagCreateError", "tags") || "Failed to create tag");
    },
  });
}

/**
 * Hook for updating a tag
 */
export function useUpdateTag() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tagId, data }: { tagId: string; data: UpdateTagDto }) =>
      TagsAPI.updateTag(tagId, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.tags.detail(variables.tagId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags.all(),
      });
      toast.success(t("tagUpdated", "tags") || "Tag updated successfully");
    },
    onError: (error) => {
      console.error("Update tag error:", error);
      toast.error(t("tagUpdateError", "tags") || "Failed to update tag");
    },
  });
}

/**
 * Hook for deleting a tag
 */
export function useDeleteTag() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: string) => TagsAPI.deleteTag(tagId),
    onSuccess: (_, tagId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.tags.detail(tagId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags.stats(),
      });
      toast.success(t("tagDeleted", "tags") || "Tag deleted successfully");
    },
    onError: (error) => {
      console.error("Delete tag error:", error);
      toast.error(t("tagDeleteError", "tags") || "Failed to delete tag");
    },
  });
}

/**
 * Hook for bulk creating tags
 */
export function useBulkCreateTags() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (names: string[]) => TagsAPI.bulkCreateTags(names),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags.stats(),
      });
      toast.success(
        t("tagsCreated", "tags") || "Tags created successfully",
      );
    },
    onError: (error) => {
      console.error("Bulk create tags error:", error);
      toast.error(
        t("tagsCreateError", "tags") || "Failed to create tags",
      );
    },
  });
}

