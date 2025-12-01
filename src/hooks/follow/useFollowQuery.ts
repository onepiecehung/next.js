import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { FollowAPI } from "@/lib/api/follow";
import type {
  FollowSuggestionsDto,
  MutualFriendsDto,
  PaginationDto,
} from "@/lib/api/follow";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for following a user
 */
export function useFollow() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) => FollowAPI.followUser(targetUserId),
    onSuccess: (_, targetUserId) => {
      // Invalidate follow status and counters
      queryClient.invalidateQueries({
        queryKey: queryKeys.follow.status("", targetUserId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.follow.counters(targetUserId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.follow.following("", {}),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.follow.followers(targetUserId, {}),
      });
      toast.success(t("followSuccess", "follow") || "Successfully followed user");
    },
    onError: (error) => {
      console.error("Follow error:", error);
      toast.error(t("followError", "follow") || "Failed to follow user");
    },
  });
}

/**
 * Hook for unfollowing a user
 */
export function useUnfollow() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) => FollowAPI.unfollowUser(targetUserId),
    onSuccess: (_, targetUserId) => {
      // Invalidate follow status and counters
      queryClient.invalidateQueries({
        queryKey: queryKeys.follow.status("", targetUserId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.follow.counters(targetUserId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.follow.following("", {}),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.follow.followers(targetUserId, {}),
      });
      toast.success(
        t("unfollowSuccess", "follow") || "Successfully unfollowed user",
      );
    },
    onError: (error) => {
      console.error("Unfollow error:", error);
      toast.error(t("unfollowError", "follow") || "Failed to unfollow user");
    },
  });
}

/**
 * Hook for fetching following list
 */
export function useFollowing(userId: string, params?: PaginationDto) {
  return useQuery({
    queryKey: queryKeys.follow.following(userId, params),
    queryFn: () => FollowAPI.getFollowing(userId, params),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for fetching followers list
 */
export function useFollowers(userId: string, params?: PaginationDto) {
  return useQuery({
    queryKey: queryKeys.follow.followers(userId, params),
    queryFn: () => FollowAPI.getFollowers(userId, params),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for fetching mutual friends
 */
export function useMutualFriends(params: MutualFriendsDto) {
  return useQuery({
    queryKey: queryKeys.follow.mutuals(params.userA, params.userB),
    queryFn: () => FollowAPI.getMutualFriends(params),
    enabled: !!params.userA && !!params.userB,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching follow suggestions
 */
export function useFollowSuggestions(
  userId: string,
  params?: FollowSuggestionsDto,
) {
  return useQuery({
    queryKey: queryKeys.follow.suggestions(userId, params),
    queryFn: () => FollowAPI.getSuggestions(userId, params),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching follow status between two users
 */
export function useFollowStatus(followerId: string, followeeId: string) {
  return useQuery({
    queryKey: queryKeys.follow.status(followerId, followeeId),
    queryFn: () => FollowAPI.getFollowStatus(followerId, followeeId),
    enabled: !!followerId && !!followeeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for fetching follow counters
 */
export function useFollowCounters(userId: string) {
  return useQuery({
    queryKey: queryKeys.follow.counters(userId),
    queryFn: () => FollowAPI.getCounters(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for fetching news feed
 */
export function useNewsFeed(userId: string, params?: PaginationDto) {
  return useQuery({
    queryKey: queryKeys.follow.feed(userId, params),
    queryFn: () => FollowAPI.getNewsFeed(userId, params),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook for fetching trending content
 */
export function useTrendingContent(limit?: number) {
  return useQuery({
    queryKey: queryKeys.follow.trending(),
    queryFn: () => FollowAPI.getTrendingContent(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching content recommendations
 */
export function useRecommendations(userId: string, limit?: number) {
  return useQuery({
    queryKey: queryKeys.follow.recommendations(userId),
    queryFn: () => FollowAPI.getContentRecommendations(userId, limit),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching feed statistics
 */
export function useFeedStats(userId: string) {
  return useQuery({
    queryKey: queryKeys.follow.feedStats(userId),
    queryFn: () => FollowAPI.getFeedStats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

