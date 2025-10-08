import { http } from "../http";
import { ApiResponse } from "../types/api";

export type UploadedMedia = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
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
        data: [],
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
    for (const file of files) {
      form.append("files", file);
    }

    const response = await http.post<ApiResponse<UploadedMedia[]>>(
      this.BASE_URL,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  }
}
