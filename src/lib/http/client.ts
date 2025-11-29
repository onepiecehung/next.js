import axios from "axios";
import { requestInterceptor, responseErrorInterceptor } from "./interceptors";

/**
 * HTTP Client
 * Configured axios instances for API communication
 */

/**
 * Get base URL from environment variable
 */
const getBaseURL = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
};

/**
 * Main HTTP client instance with authentication and interceptors
 * Use this for all authenticated API requests
 */
export const http = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false, // Temporarily disabled due to CORS issue
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Public HTTP client instance without authentication
 * Use this for public API endpoints that don't require authentication
 */
export const publicHttp = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Apply request interceptor
http.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error),
);

// Apply response interceptor
http.interceptors.response.use(
  (response) => response,
  responseErrorInterceptor,
);
