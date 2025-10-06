import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { rateLimitBus, setRateLimitUntil, getRateLimitUntil } from "@/lib/rate-limit";

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

// Create public axios instance for APIs that don't require authentication
export const publicHttp = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
  withCredentials: false,
});

// Request interceptor: attach token and block during rate-limit cooldown
http.interceptors.request.use((config) => {
  const now = Date.now();
  const until = getRateLimitUntil();
  if (until && until > now) {
    // Emit event so global dialog shows (in case it was dismissed)
    rateLimitBus.emit({ untilTimestampMs: until, retryAfterSeconds: Math.max(1, Math.ceil((until - now) / 1000)) });
    const err = new Error("Rate limited - cooldown active") as Error & { response?: { status?: number } };
    err.response = { status: 429 };
    return Promise.reject(err);
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    (config.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
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
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;
    const status = error?.response?.status;

    // Handle 429 Too Many Requests (rate limiting)
    if (status === 429) {
      const retryAfterHeader = (error.response?.headers?.["retry-after"] as unknown) as string | undefined;
      const retryAfterSeconds = retryAfterHeader ? Math.max(1, parseInt(String(retryAfterHeader), 10)) : 60;
      const until = Date.now() + retryAfterSeconds * 1000;
      setRateLimitUntil(until);
      rateLimitBus.emit({ untilTimestampMs: until, retryAfterSeconds });
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    // Narrow and extend to access a local _retry flag safely
    type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };
    const req = originalRequest as RetryableConfig | undefined;
    if (status === 401 && req && !req._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for the current refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (req) {
              (req.headers as Record<string, string>).Authorization = `Bearer ${token}`;
              return http(req);
            }
            return Promise.reject(new Error("Original request not available"));
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Start refresh process
      req._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken);

        // Update the original request with new token
        if (req) {
          (req.headers as Record<string, string>).Authorization = `Bearer ${newAccessToken}`;
          return http(req);
        }
        return Promise.reject(new Error("Original request not available"));
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError instanceof Error ? refreshError : new Error("Token refresh failed"));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error instanceof Error ? error : new Error("Request failed"));
  },
);
