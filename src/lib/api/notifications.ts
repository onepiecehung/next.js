import { http } from "@/lib/http";
import type {
  AdvancedQueryParams,
  ApiResponse,
  ApiResponseOffset,
} from "@/lib/types";

/**
 * Notification interfaces based on backend DTOs
 */
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: string;
  channel?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  actionUrl?: string;
  status?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateNotificationDto {
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: string;
  channel?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  actionUrl?: string;
  emailTemplate?: string;
  emailTemplateData?: Record<string, unknown>;
  pushData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  scheduledFor?: string;
  maxRetries?: number;
}

export interface CreateBulkNotificationDto {
  userIds: string[];
  type: string;
  title: string;
  message: string;
  priority?: string;
  channel?: string;
  actionUrl?: string;
  emailTemplate?: string;
  emailTemplateData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  scheduledFor?: string;
}

export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  priority?: string;
  channel?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  isRead?: boolean;
}

export interface QueryNotificationsDto extends AdvancedQueryParams {
  type?: string;
  status?: string;
  priority?: string;
  channel?: string;
  isRead?: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface MarkAsReadDto {
  readAt?: string;
}

export interface NotificationStatsDto {
  total: number;
  unread: number;
  byType: Array<{
    type: string;
    count: number;
    unread: number;
  }>;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  type: string;
  enabled: boolean;
  channels: {
    email?: boolean;
    push?: boolean;
    inApp?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationPreferenceDto {
  type: string;
  enabled: boolean;
  channels: {
    email?: boolean;
    push?: boolean;
    inApp?: boolean;
  };
}

export interface UpdateNotificationPreferenceDto {
  enabled?: boolean;
  channels?: {
    email?: boolean;
    push?: boolean;
    inApp?: boolean;
  };
}

export interface BulkUpdateNotificationPreferencesDto {
  preferences: Array<{
    type: string;
    enabled?: boolean;
    channels?: {
      email?: boolean;
      push?: boolean;
      inApp?: boolean;
    };
  }>;
}

/**
 * Notifications API wrapper
 * Handles all notification-related API calls
 */
export class NotificationsAPI {
  private static readonly BASE_URL = "/notifications";

  /**
   * Create a notification
   */
  static async createNotification(
    data: CreateNotificationDto,
  ): Promise<ApiResponse<Notification>> {
    const response = await http.post<ApiResponse<Notification>>(
      this.BASE_URL,
      data,
    );
    return response.data;
  }

  /**
   * Create bulk notifications
   */
  static async createBulkNotifications(
    data: CreateBulkNotificationDto,
  ): Promise<ApiResponse<{ count: number; notifications: Notification[] }>> {
    const response = await http.post<
      ApiResponse<{ count: number; notifications: Notification[] }>
    >(`${this.BASE_URL}/bulk`, data);
    return response.data;
  }

  /**
   * Get user notifications
   */
  static async getUserNotifications(
    params?: QueryNotificationsDto,
  ): Promise<ApiResponseOffset<Notification>> {
    const response = await http.get<ApiResponseOffset<Notification>>(
      this.BASE_URL,
      { params },
    );
    return response.data;
  }

  /**
   * Get user notifications with broadcasts
   */
  static async getUserNotificationsWithBroadcasts(
    params?: QueryNotificationsDto,
  ): Promise<ApiResponseOffset<Notification>> {
    const response = await http.get<ApiResponseOffset<Notification>>(
      `${this.BASE_URL}/with-broadcasts`,
      { params },
    );
    return response.data;
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats(): Promise<
    ApiResponse<NotificationStatsDto>
  > {
    const response = await http.get<ApiResponse<NotificationStatsDto>>(
      `${this.BASE_URL}/stats`,
    );
    return response.data;
  }

  /**
   * Get a single notification by ID
   */
  static async getNotification(
    notificationId: string,
  ): Promise<ApiResponse<Notification>> {
    const response = await http.get<ApiResponse<Notification>>(
      `${this.BASE_URL}/${notificationId}`,
    );
    return response.data;
  }

  /**
   * Update a notification
   */
  static async updateNotification(
    notificationId: string,
    data: UpdateNotificationDto,
  ): Promise<ApiResponse<Notification>> {
    const response = await http.put<ApiResponse<Notification>>(
      `${this.BASE_URL}/${notificationId}`,
      data,
    );
    return response.data;
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(
    notificationId: string,
    data?: MarkAsReadDto,
  ): Promise<ApiResponse<Notification>> {
    const response = await http.put<ApiResponse<Notification>>(
      `${this.BASE_URL}/${notificationId}/read`,
      data,
    );
    return response.data;
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<
    ApiResponse<{ count: number; message: string }>
  > {
    const response = await http.put<
      ApiResponse<{ count: number; message: string }>
    >(`${this.BASE_URL}/read-all`);
    return response.data;
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(
    notificationId: string,
  ): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(
      `${this.BASE_URL}/${notificationId}`,
    );
    return response.data;
  }

  // Notification Preferences endpoints

  /**
   * Get user notification preferences
   */
  static async getUserPreferences(): Promise<
    ApiResponse<NotificationPreference[]>
  > {
    const response = await http.get<ApiResponse<NotificationPreference[]>>(
      `${this.BASE_URL}/preferences`,
    );
    return response.data;
  }

  /**
   * Create a notification preference
   */
  static async createPreference(
    data: CreateNotificationPreferenceDto,
  ): Promise<ApiResponse<NotificationPreference>> {
    const response = await http.post<ApiResponse<NotificationPreference>>(
      `${this.BASE_URL}/preferences`,
      data,
    );
    return response.data;
  }

  /**
   * Update a notification preference
   */
  static async updatePreference(
    preferenceId: string,
    data: UpdateNotificationPreferenceDto,
  ): Promise<ApiResponse<NotificationPreference>> {
    const response = await http.put<ApiResponse<NotificationPreference>>(
      `${this.BASE_URL}/preferences/${preferenceId}`,
      data,
    );
    return response.data;
  }

  /**
   * Bulk update notification preferences
   */
  static async bulkUpdatePreferences(
    data: BulkUpdateNotificationPreferencesDto,
  ): Promise<
    ApiResponse<{ count: number; preferences: NotificationPreference[] }>
  > {
    const response = await http.put<
      ApiResponse<{ count: number; preferences: NotificationPreference[] }>
    >(`${this.BASE_URL}/preferences/bulk`, data);
    return response.data;
  }

  /**
   * Delete a notification preference
   */
  static async deletePreference(
    preferenceId: string,
  ): Promise<ApiResponse<void>> {
    const response = await http.delete<ApiResponse<void>>(
      `${this.BASE_URL}/preferences/${preferenceId}`,
    );
    return response.data;
  }
}
