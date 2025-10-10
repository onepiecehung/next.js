import axios from "axios";
import {
  clearAllTokens,
  getRefreshToken,
  setAccessToken,
} from "./token-manager";

/**
 * Token Refresh Manager
 * Handles automatic token refresh on 401 errors
 */

// Track if a refresh is currently in progress
let isRefreshing = false;

// Queue of requests waiting for token refresh
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (error?: unknown) => void;
}> = [];

/**
 * Process all queued requests after token refresh
 * @param error - Error if refresh failed, null if successful
 * @param token - New access token if refresh successful
 */
export function processQueue(
  error: unknown,
  token: string | null = null,
): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
}

/**
 * Add a request to the queue waiting for token refresh
 * @returns Promise that resolves when token is refreshed
 */
export function addToQueue(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
}

/**
 * Check if a token refresh is currently in progress
 */
export function getIsRefreshing(): boolean {
  return isRefreshing;
}

/**
 * Set the refreshing state
 */
export function setIsRefreshing(value: boolean): void {
  isRefreshing = value;
}

/**
 * Refresh the access token using the refresh token
 * @returns Promise with the new access token
 * @throws Error if refresh fails
 */
export async function refreshAccessToken(): Promise<string> {
  try {
    // Get refresh token from localStorage
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Create a new axios instance for refresh to avoid interceptors
    // This prevents infinite loops when the main http instance tries to refresh
    const refreshHttp = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
      withCredentials: false,
    });

    // Send refresh token in Authorization header (not in body)
    // This follows JWT standards where refresh tokens are sent in headers
    const response = await refreshHttp.post(
      "/auth/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    // Check if response contains valid access token
    if (response.data?.success && response.data.data?.accessToken) {
      const newAccessToken = response.data.data.accessToken;
      setAccessToken(newAccessToken);
      return newAccessToken;
    }

    throw new Error("Failed to obtain access token from refresh");
  } catch (error) {
    // Clear all tokens on refresh failure
    clearAllTokens();
    throw error;
  }
}
