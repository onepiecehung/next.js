import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import {
  getRateLimitUntil,
  rateLimitBus,
  setRateLimitUntil,
} from "@/lib/rate-limit";

import {
  DEFAULT_RETRY_AFTER_SECONDS,
  RATE_LIMIT_HEADER,
} from "./constants";
import { http } from "./instances";
import { refreshAccessToken } from "./refresh-token";
import { getAccessToken } from "./tokens";

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type FailedRequest = {
  resolve: (token?: string | null) => void;
  reject: (error?: unknown) => void;
};

let interceptorsInitialized = false;
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
}

function attachRateLimitInterceptor() {
  http.interceptors.request.use((config) => {
    const now = Date.now();
    const until = getRateLimitUntil();

    if (until && until > now) {
      rateLimitBus.emit({
        untilTimestampMs: until,
        retryAfterSeconds: Math.max(1, Math.ceil((until - now) / 1000)),
      });

      const error = new Error("Rate limited - cooldown active") as Error & {
        response?: { status?: number };
      };
      error.response = { status: 429 };
      return Promise.reject(error);
    }

    const token = getAccessToken();
    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

function attachAuthInterceptor() {
  http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const req = error.config as RetryableConfig | undefined;
      const status = error.response?.status;

      if (status === 429) {
        const retryAfterHeader = error.response?.headers?.[
          RATE_LIMIT_HEADER
        ] as unknown as string | undefined;
        const retryAfterSeconds = retryAfterHeader
          ? Math.max(1, parseInt(String(retryAfterHeader), 10))
          : DEFAULT_RETRY_AFTER_SECONDS;
        const until = Date.now() + retryAfterSeconds * 1000;
        setRateLimitUntil(until);
        rateLimitBus.emit({ untilTimestampMs: until, retryAfterSeconds });
        return Promise.reject(error);
      }

      if (status === 401 && req && !req._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (req) {
                (req.headers as Record<string, string>).Authorization = `Bearer ${token}`;
                return http(req);
              }

              return Promise.reject(
                new Error("Original request not available after refresh"),
              );
            })
            .catch((queueError) => Promise.reject(queueError));
        }

        req._retry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await refreshAccessToken();
          processQueue(null, newAccessToken);

          if (req) {
            (req.headers as Record<string, string>).Authorization = `Bearer ${newAccessToken}`;
            return http(req);
          }

          return Promise.reject(
            new Error("Original request not available after refresh"),
          );
        } catch (refreshError) {
          processQueue(refreshError, null);
          return Promise.reject(
            refreshError instanceof Error
              ? refreshError
              : new Error("Token refresh failed"),
          );
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(
        error instanceof Error ? error : new Error("Request failed"),
      );
    },
  );
}

export function setupHttpInterceptors() {
  if (interceptorsInitialized) return;

  attachRateLimitInterceptor();
  attachAuthInterceptor();
  interceptorsInitialized = true;
}
