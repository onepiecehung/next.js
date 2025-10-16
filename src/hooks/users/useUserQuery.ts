import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { UserAPI, type UserProfile } from "@/lib/api/users";

/**
 * Hook for fetching user profile by ID
 */
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => UserAPI.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

/**
 * Hook for fetching current user profile
 */
export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: () => UserAPI.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry auth failures
  });
}

/**
 * Hook for updating user profile
 */
export function useUpdateUserProfile() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<UserProfile> }) =>
      UserAPI.updateUserProfile(userId, data),
    onSuccess: (user) => {
      // Update user in cache
      queryClient.setQueryData(["user", user.id], user);
      
      // Update current user if it's the same user
      queryClient.setQueryData(["currentUserProfile"], user);
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      toast.success(t("profileUpdateSuccess", "profile") || "Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast.error(t("profileUpdateError", "profile") || "Failed to update profile");
    },
  });
}

/**
 * Hook for user management operations
 */
export function useUserManagement() {
  const updateProfileMutation = useUpdateUserProfile();

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
}
