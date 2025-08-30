import axios from "axios";
import type { ApiResponse, RefreshTokenResponse } from "@/lib/types";

// In-memory storage for access token (not persisted to localStorage for security)
let ACCESS_TOKEN: string | null = null;

// Helper functions for token management
export function setAccessToken(token: string | null) {
  ACCESS_TOKEN = token;
}

export function getAccessToken() {
  return ACCESS_TOKEN;
}

export function clearTokens() {
  ACCESS_TOKEN = null;
}

// Fallback functions for refresh token (only used when backend doesn't set HttpOnly cookies)
export function getRefreshTokenFallback(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rt");
}

export function setRefreshTokenFallback(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("rt", token);
}

export function clearRefreshTokenFallback() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rt");
}

// Create axios instance with base URL from environment
export const http = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
  withCredentials: false, // Temporarily disabled due to CORS issue
});

// Request interceptor: automatically attach Authorization header if access token exists
http.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: handle 401 errors and automatically refresh tokens
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

async function refreshAccessToken() {
  try {
    // Get refresh token from localStorage
    const refreshToken = getRefreshTokenFallback();
    if (!refreshToken) throw new Error("No refresh token available");

    // Create a new axios instance for refresh to avoid interceptors
    // This prevents infinite loops when the main http instance tries to refresh
    const refreshHttp = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
      withCredentials: false,
    });

    // Send refresh token in Authorization header (not in body)
    // This follows JWT standards where refresh tokens are sent in headers
    const res = await refreshHttp.post(
      "/auth/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    if (res.data?.success && res.data.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
      return res.data.data.accessToken;
    }

    throw new Error("Failed to obtain access token from refresh");
  } catch (error) {
    // Clear all tokens on refresh failure
    clearTokens();
    clearRefreshTokenFallback();
    throw error;
  }
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Handle 401 Unauthorized errors
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for the current refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return http(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Start refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return http(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
