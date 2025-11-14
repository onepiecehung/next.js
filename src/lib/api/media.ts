import { http } from "../http";
import type { ApiResponse } from "../types";

export type UploadedMedia = {
  id: string;
  url: string;
  name?: string;
  originalName?: string;
  mimeType: string;
  size: number;
  type?: string;
  metadata?: string; // JSON string for scramble metadata
};

/**
 * Scramble key response type for image unscrambling
 */
export type ScrambleKeyResponse = {
  permutationSeed: string; // base64url encoded seed
  tileRows: number;
  tileCols: number;
  version: number;
};

/**
 * Media API wrapper
 * All media must be uploaded via /v1/media with form-data field "files"
 * The API supports up to 3 files per request.
 */
export class MediaAPI {
  private static readonly BASE_URL = "/media";
  private static readonly MAX_FILES_PER_UPLOAD = 3;

  static async upload(files: File[]): Promise<ApiResponse<UploadedMedia[]>> {
    if (!files || files.length === 0) {
      return {
        success: false,
        data: [] as UploadedMedia[],
        message: "No files provided",
        metadata: { messageKey: "no_files_provided", messageArgs: {} },
      };
    }
    if (files.length > this.MAX_FILES_PER_UPLOAD) {
      throw new Error(
        `You can upload at most ${this.MAX_FILES_PER_UPLOAD} files per request.`,
      );
    }

    const form = new FormData();
    // Backend expects single file with field name "file"
    form.append("files", files[0]);
    const response = await http.post<ApiResponse<UploadedMedia[]>>(
      this.BASE_URL,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  }

  static async getUserMedia(
    userId: string,
  ): Promise<ApiResponse<UploadedMedia[]>> {
    const response = await http.get<ApiResponse<UploadedMedia[]>>(
      `${this.BASE_URL}/user/${userId}`,
    );
    return response.data;
  }

  static async delete(mediaId: string): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(
      `${this.BASE_URL}/${mediaId}`,
    );
    return response.data;
  }

  /**
   * Fetch scramble key for unscrambling an image
   * Used for image scrambler feature to reconstruct original image from scrambled tiles
   */
  static async getScrambleKey(mediaId: string): Promise<ApiResponse<ScrambleKeyResponse>> {
    const response = await http.get<ApiResponse<ScrambleKeyResponse>>(
      `${this.BASE_URL}/${mediaId}/scramble-key`,
    );
    return response.data;
  }
}
