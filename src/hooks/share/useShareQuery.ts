import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { ShareAPI } from "@/lib/api/share";
import type {
  CreateShareLinkDto,
  ShareMetricsDto,
} from "@/lib/api/share";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for fetching share links for specific content
 */
export function useShareLinks(contentType: string, contentId: string) {
  return useQuery({
    queryKey: queryKeys.share.links(contentType, contentId),
    queryFn: () => ShareAPI.getShareLinksForContent(contentType, contentId),
    enabled: !!contentType && !!contentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching share links for a post (legacy endpoint)
 */
export function useShareLinksForPost(postId: string) {
  return useQuery({
    queryKey: [...queryKeys.share.links("article", postId), "legacy"],
    queryFn: () => ShareAPI.getShareLinksForPost(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating a share link
 */
export function useCreateShareLink() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShareLinkDto) => ShareAPI.createShareLink(data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.share.links(
          variables.contentType,
          variables.contentId,
        ),
      });
      toast.success(
        t("shareLinkCreated", "share") || "Share link created successfully",
      );
    },
    onError: (error) => {
      console.error("Create share link error:", error);
      toast.error(
        t("shareLinkCreateError", "share") || "Failed to create share link",
      );
    },
  });
}

/**
 * Hook for fetching share link metrics
 */
export function useShareLinkMetrics(code: string, params?: ShareMetricsDto) {
  return useQuery({
    queryKey: queryKeys.share.metrics(code, params),
    queryFn: () => ShareAPI.getShareLinkMetrics(code, params),
    enabled: !!code,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for fetching share count for specific content
 */
export function useShareCount(contentType: string, contentId: string) {
  return useQuery({
    queryKey: queryKeys.share.count(contentType, contentId),
    queryFn: () => ShareAPI.getShareCount(contentType, contentId),
    enabled: !!contentType && !!contentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

