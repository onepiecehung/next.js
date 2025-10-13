import { MediaAPI, UploadedMedia } from "@/lib/api/media";
import { useCallback, useState } from "react";

export interface UseImageUploadOptions {
  onSuccess?: (uploadedMedia: UploadedMedia[]) => void;
  onError?: (error: string) => void;
}

export interface UseImageUploadReturn {
  uploadImages: (files: File[]) => Promise<UploadedMedia[]>;
  isUploading: boolean;
  error: string | null;
}

/**
 * Hook for handling image uploads via MediaAPI
 * Provides upload functionality with loading states and error handling
 */
export function useImageUpload({
  onSuccess,
  onError,
}: UseImageUploadOptions = {}): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImages = useCallback(
    async (files: File[]): Promise<UploadedMedia[]> => {
      if (!files || files.length === 0) {
        const errorMsg = "No files provided for upload";
        setError(errorMsg);
        onError?.(errorMsg);
        return [];
      }

      setIsUploading(true);
      setError(null);

      try {
        const response = await MediaAPI.upload(files);

        if (response.success && response.data) {
          onSuccess?.(response.data);
          return response.data;
        } else {
          const errorMsg = response.message || "Upload failed";
          setError(errorMsg);
          onError?.(errorMsg);
          return [];
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Upload failed";
        setError(errorMsg);
        onError?.(errorMsg);
        return [];
      } finally {
        setIsUploading(false);
      }
    },
    [onSuccess, onError],
  );

  return {
    uploadImages,
    isUploading,
    error,
  };
}
