import { BaseEntityCustom } from "./base.entity";
import { User } from "./user.entity";

export interface Media extends BaseEntityCustom {
  status?: string;
  name?: string;
  title?: string;
  altText?: string;
  path?: string;
  mimeType?: string;
  extension?: string;
  size: number;
  description?: string;
  type?: string;
  url: string;
  key?: string;
  originalName: string;
  thumbnailUrl: string;
  previewUrl: string;
  userId?: string;
  user?: User;
  metadata: string; // JSON string for additional media metadata
  storageProvider?: string;
  width?: number;
  height?: number;
  duration?: number; // For video/audio files in seconds
  downloadCount?: number;
  viewCount?: number;
  isPublic?: boolean;
  tags?: string; // JSON array of tags
}
