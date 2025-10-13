import { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  createRateLimitError,
  emitRateLimitEvent,
  handleRateLimitError,
  isRateLimited,
} from "./rate-limit-handler";
import { getAccessToken } from "./token-manager";
import {
  addToQueue,
  getIsRefreshing,
  processQueue,
  refreshAccessToken,
  setIsRefreshing,
} from "./token-refresh";

/**
 * HTTP Interceptors
 * Request and response interceptors for axios instance
 */

/**
 * Request interceptor
 * Attaches access token to requests and blocks during rate limit cooldown
 */
export function requestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig | Promise<never> {
  // Check if currently in rate limit cooldown
  if (isRateLimited()) {
    // Emit event so global dialog shows (in case it was dismissed)
    emitRateLimitEvent();
    return Promise.reject(createRateLimitError());
  }

  // Attach access token to request headers if available
  const accessToken = getAccessToken();
  if (accessToken) {
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${accessToken}`;
  }

  return config;
}

/**
 * Response error interceptor
 * Handles 401 (unauthorized) and 429 (rate limit) errors
 */
export async function responseErrorInterceptor(
  error: AxiosError,
): Promise<never> {
  const originalRequest = error.config as
    | InternalAxiosRequestConfig
    | undefined;
  const status = error?.response?.status;

  // Handle 429 Too Many Requests (rate limiting)
  if (status === 429) {
    handleRateLimitError(error);
    return Promise.reject(error);
  }

  // Handle 401 Unauthorized errors with automatic token refresh
  type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };
  const req = originalRequest as RetryableConfig | undefined;

  if (status === 401 && req && !req._retry) {
    // If already refreshing, add request to queue
    if (getIsRefreshing()) {
      try {
        const token = await addToQueue();
        if (req) {
          (req.headers as Record<string, string>).Authorization =
            `Bearer ${token}`;
          // Import http dynamically to avoid circular dependency
          const { http } = await import("./client");
          return http(req);
        }
        return Promise.reject(new Error("Original request not available"));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    // Start refresh process
    req._retry = true;
    setIsRefreshing(true);

    try {
      const newAccessToken = await refreshAccessToken();
      processQueue(null, newAccessToken);

      // Update the original request with new token
      if (req) {
        (req.headers as Record<string, string>).Authorization =
          `Bearer ${newAccessToken}`;
        // Import http dynamically to avoid circular dependency
        const { http } = await import("./client");
        return http(req);
      }
      return Promise.reject(new Error("Original request not available"));
    } catch (refreshError) {
      processQueue(refreshError, null);
      return Promise.reject(
        refreshError instanceof Error
          ? refreshError
          : new Error("Token refresh failed"),
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  return Promise.reject(
    error instanceof Error ? error : new Error("Request failed"),
  );
}
