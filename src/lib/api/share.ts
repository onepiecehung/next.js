import { http } from "@/lib/http";
import type { ApiResponse } from "@/lib/types";

/**
 * Share link interfaces based on backend DTOs
 */
export interface ShareLink {
  id: string;
  code: string;
  contentType: string;
  contentId: string;
  ownerUserId: string;
  channelId?: string;
  campaignId?: string;
  note?: string;
  isActive?: boolean;
  url: string;
  shortUrl?: string;
  createdAt: string;
  updatedAt: string;
  metrics?: ShareLinkMetrics;
}

export interface CreateShareLinkDto {
  contentType: string;
  contentId: string;
  ownerUserId: string;
  channelId?: string;
  campaignId?: string;
  note?: string;
  isActive?: boolean;
}

export interface ShareLinkMetrics {
  clicks: number;
  uniqueClicks: number;
  shares: number;
  lastClickedAt?: string;
  clickHistory?: Array<{
    date: string;
    count: number;
  }>;
}

export interface ShareMetricsDto {
  startDate?: string;
  endDate?: string;
  groupBy?: "day" | "week" | "month";
}

export interface ShareCountResponse {
  contentType: string;
  contentId: string;
  shareCount: number;
}

/**
 * Share API wrapper
 * Handles all share-related API calls
 */
export class ShareAPI {
  private static readonly BASE_URL = "/share-links";

  /**
   * Create a new share link
   */
  static async createShareLink(
    data: CreateShareLinkDto,
  ): Promise<ApiResponse<ShareLink>> {
    const response = await http.post<ApiResponse<ShareLink>>(
      this.BASE_URL,
      data,
    );
    return response.data;
  }

  /**
   * Get share links for specific content
   */
  static async getShareLinksForContent(
    contentType: string,
    contentId: string,
  ): Promise<ApiResponse<ShareLink[]>> {
    const response = await http.get<ApiResponse<ShareLink[]>>(
      `${this.BASE_URL}/content/${contentType}/${contentId}`,
    );
    return response.data;
  }

  /**
   * Get share links for a specific post (legacy endpoint)
   */
  static async getShareLinksForPost(
    postId: string,
  ): Promise<ApiResponse<ShareLink[]>> {
    const response = await http.get<ApiResponse<ShareLink[]>>(
      `${this.BASE_URL}/posts/${postId}`,
    );
    return response.data;
  }

  /**
   * Get metrics for a specific share link
   */
  static async getShareLinkMetrics(
    code: string,
    params?: ShareMetricsDto,
  ): Promise<ApiResponse<ShareLinkMetrics>> {
    const response = await http.get<ApiResponse<ShareLinkMetrics>>(
      `${this.BASE_URL}/${code}/metrics`,
      { params },
    );
    return response.data;
  }

  /**
   * Get share count for specific content
   */
  static async getShareCount(
    contentType: string,
    contentId: string,
  ): Promise<ApiResponse<ShareCountResponse>> {
    const response = await http.get<ApiResponse<ShareCountResponse>>(
      `${this.BASE_URL}/count/${contentType}/${contentId}`,
    );
    return response.data;
  }
}

