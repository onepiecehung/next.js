import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useI18n } from "@/components/providers/i18n-provider";
import { NotificationsAPI } from "@/lib/api/notifications";
import type {
  CreateBulkNotificationDto,
  CreateNotificationDto,
  CreateNotificationPreferenceDto,
  QueryNotificationsDto,
  UpdateNotificationDto,
  UpdateNotificationPreferenceDto,
  BulkUpdateNotificationPreferencesDto,
  MarkAsReadDto,
} from "@/lib/api/notifications";
import { queryKeys } from "@/lib/utils/query-keys";

/**
 * Hook for fetching user notifications
 */
export function useNotifications(params?: QueryNotificationsDto) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => NotificationsAPI.getUserNotifications(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching user notifications with broadcasts
 */
export function useNotificationsWithBroadcasts(params?: QueryNotificationsDto) {
  return useQuery({
    queryKey: [...queryKeys.notifications.list(params), "broadcasts"],
    queryFn: () => NotificationsAPI.getUserNotificationsWithBroadcasts(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching a single notification
 */
export function useNotification(notificationId: string) {
  return useQuery({
    queryKey: queryKeys.notifications.detail(notificationId),
    queryFn: () => NotificationsAPI.getNotification(notificationId),
    enabled: !!notificationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching notification statistics
 */
export function useNotificationStats() {
  return useQuery({
    queryKey: queryKeys.notifications.stats(),
    queryFn: () => NotificationsAPI.getNotificationStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating a notification
 */
export function useCreateNotification() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationDto) =>
      NotificationsAPI.createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.stats(),
      });
      toast.success(
        t("notificationCreated", "notifications") ||
          "Notification created successfully",
      );
    },
    onError: (error) => {
      console.error("Create notification error:", error);
      toast.error(
        t("notificationCreateError", "notifications") ||
          "Failed to create notification",
      );
    },
  });
}

/**
 * Hook for creating bulk notifications
 */
export function useCreateBulkNotifications() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBulkNotificationDto) =>
      NotificationsAPI.createBulkNotifications(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.stats(),
      });
      toast.success(
        t("notificationsCreated", "notifications") ||
          "Notifications created successfully",
      );
    },
    onError: (error) => {
      console.error("Create bulk notifications error:", error);
      toast.error(
        t("notificationsCreateError", "notifications") ||
          "Failed to create notifications",
      );
    },
  });
}

/**
 * Hook for updating a notification
 */
export function useUpdateNotification() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      notificationId,
      data,
    }: {
      notificationId: string;
      data: UpdateNotificationDto;
    }) => NotificationsAPI.updateNotification(notificationId, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.notifications.detail(variables.notificationId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
      toast.success(
        t("notificationUpdated", "notifications") ||
          "Notification updated successfully",
      );
    },
    onError: (error) => {
      console.error("Update notification error:", error);
      toast.error(
        t("notificationUpdateError", "notifications") ||
          "Failed to update notification",
      );
    },
  });
}

/**
 * Hook for deleting a notification
 */
export function useDeleteNotification() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      NotificationsAPI.deleteNotification(notificationId),
    onSuccess: (_, notificationId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.notifications.detail(notificationId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.stats(),
      });
      toast.success(
        t("notificationDeleted", "notifications") ||
          "Notification deleted successfully",
      );
    },
    onError: (error) => {
      console.error("Delete notification error:", error);
      toast.error(
        t("notificationDeleteError", "notifications") ||
          "Failed to delete notification",
      );
    },
  });
}

/**
 * Hook for marking a notification as read
 */
export function useMarkAsRead() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      notificationId,
      data,
    }: {
      notificationId: string;
      data?: MarkAsReadDto;
    }) => NotificationsAPI.markAsRead(notificationId, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.notifications.detail(variables.notificationId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.stats(),
      });
    },
    onError: (error) => {
      console.error("Mark as read error:", error);
      toast.error(
        t("markAsReadError", "notifications") ||
          "Failed to mark notification as read",
      );
    },
  });
}

/**
 * Hook for marking all notifications as read
 */
export function useMarkAllAsRead() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => NotificationsAPI.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.stats(),
      });
      toast.success(
        t("allMarkedAsRead", "notifications") ||
          "All notifications marked as read",
      );
    },
    onError: (error) => {
      console.error("Mark all as read error:", error);
      toast.error(
        t("markAllAsReadError", "notifications") ||
          "Failed to mark all notifications as read",
      );
    },
  });
}

// Notification Preferences hooks

/**
 * Hook for fetching user notification preferences
 */
export function useNotificationPreferences() {
  return useQuery({
    queryKey: queryKeys.notifications.preferences.all(),
    queryFn: () => NotificationsAPI.getUserPreferences(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for creating a notification preference
 */
export function useCreateNotificationPreference() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationPreferenceDto) =>
      NotificationsAPI.createPreference(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.preferences.all(),
      });
      toast.success(
        t("preferenceCreated", "notifications") ||
          "Preference created successfully",
      );
    },
    onError: (error) => {
      console.error("Create preference error:", error);
      toast.error(
        t("preferenceCreateError", "notifications") ||
          "Failed to create preference",
      );
    },
  });
}

/**
 * Hook for updating a notification preference
 */
export function useUpdateNotificationPreference() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      preferenceId,
      data,
    }: {
      preferenceId: string;
      data: UpdateNotificationPreferenceDto;
    }) => NotificationsAPI.updatePreference(preferenceId, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        queryKeys.notifications.preferences.detail(variables.preferenceId),
        response.data,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.preferences.all(),
      });
      toast.success(
        t("preferenceUpdated", "notifications") ||
          "Preference updated successfully",
      );
    },
    onError: (error) => {
      console.error("Update preference error:", error);
      toast.error(
        t("preferenceUpdateError", "notifications") ||
          "Failed to update preference",
      );
    },
  });
}

/**
 * Hook for bulk updating notification preferences
 */
export function useBulkUpdateNotificationPreferences() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUpdateNotificationPreferencesDto) =>
      NotificationsAPI.bulkUpdatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.preferences.all(),
      });
      toast.success(
        t("preferencesUpdated", "notifications") ||
          "Preferences updated successfully",
      );
    },
    onError: (error) => {
      console.error("Bulk update preferences error:", error);
      toast.error(
        t("preferencesUpdateError", "notifications") ||
          "Failed to update preferences",
      );
    },
  });
}

/**
 * Hook for deleting a notification preference
 */
export function useDeleteNotificationPreference() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferenceId: string) =>
      NotificationsAPI.deletePreference(preferenceId),
    onSuccess: (_, preferenceId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.notifications.preferences.detail(preferenceId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.preferences.all(),
      });
      toast.success(
        t("preferenceDeleted", "notifications") ||
          "Preference deleted successfully",
      );
    },
    onError: (error) => {
      console.error("Delete preference error:", error);
      toast.error(
        t("preferenceDeleteError", "notifications") ||
          "Failed to delete preference",
      );
    },
  });
}
