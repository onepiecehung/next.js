import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { MediaAPI } from "@/lib/api/media";

/**
 * Hook for uploading images
 */
export function useImageUpload() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => MediaAPI.uploadImage(file),
    onSuccess: (media) => {
      // Invalidate media queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["media"] });

      toast.success(
        t("imageUploadSuccess", "media") || "Image uploaded successfully!",
      );
      return media;
    },
    onError: (error) => {
      console.error("Image upload error:", error);
      toast.error(t("imageUploadError", "media") || "Failed to upload image");
    },
  });
}

/**
 * Hook for uploading multiple images
 */
export function useMultipleImageUpload() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => MediaAPI.uploadMultipleImages(files),
    onSuccess: (mediaList) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });

      toast.success(
        t("multipleImageUploadSuccess", "media") ||
          `${mediaList.length} images uploaded successfully!`,
      );
      return mediaList;
    },
    onError: (error) => {
      console.error("Multiple image upload error:", error);
      toast.error(
        t("multipleImageUploadError", "media") || "Failed to upload images",
      );
    },
  });
}

/**
 * Hook for deleting media
 */
export function useDeleteMedia() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId: string) => MediaAPI.deleteMedia(mediaId),
    onSuccess: (_, mediaId) => {
      // Remove media from cache
      queryClient.removeQueries({ queryKey: ["media", mediaId] });

      // Invalidate media list
      queryClient.invalidateQueries({ queryKey: ["media"] });

      toast.success(
        t("mediaDeleteSuccess", "media") || "Media deleted successfully!",
      );
    },
    onError: (error) => {
      console.error("Media deletion error:", error);
      toast.error(t("mediaDeleteError", "media") || "Failed to delete media");
    },
  });
}

/**
 * Hook for fetching user's media
 */
export function useUserMedia(userId?: string) {
  return useQuery({
    queryKey: ["media", "user", userId],
    queryFn: () => MediaAPI.getUserMedia(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for media management
 */
export function useMediaManagement() {
  const uploadMutation = useImageUpload();
  const multipleUploadMutation = useMultipleImageUpload();
  const deleteMutation = useDeleteMedia();

  return {
    uploadImage: uploadMutation.mutateAsync,
    uploadMultipleImages: multipleUploadMutation.mutateAsync,
    deleteMedia: deleteMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    isUploadingMultiple: multipleUploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isLoading:
      uploadMutation.isPending ||
      multipleUploadMutation.isPending ||
      deleteMutation.isPending,
  };
}
