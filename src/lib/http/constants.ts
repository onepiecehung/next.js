export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

export const RATE_LIMIT_HEADER = "retry-after";
export const DEFAULT_RETRY_AFTER_SECONDS = 60;
