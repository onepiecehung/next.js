import {
  getRateLimitUntil,
  rateLimitBus,
  setRateLimitUntil,
} from "@/lib/rate-limit";
import { AxiosError } from "axios";

/**
 * Rate Limit Handler
 * Handles 429 Too Many Requests errors and rate limit cooldown
 */

/**
 * Check if currently in rate limit cooldown period
 * @returns True if rate limited, false otherwise
 */
export function isRateLimited(): boolean {
  const now = Date.now();
  const until = getRateLimitUntil();
  return until !== null && until > now;
}

/**
 * Get remaining cooldown time in seconds
 * @returns Seconds remaining in cooldown, or 0 if not rate limited
 */
export function getRemainingCooldown(): number {
  if (!isRateLimited()) return 0;

  const now = Date.now();
  const until = getRateLimitUntil();
  if (!until) return 0;

  return Math.max(1, Math.ceil((until - now) / 1000));
}

/**
 * Emit rate limit event to show UI notification
 */
export function emitRateLimitEvent(): void {
  const until = getRateLimitUntil();
  if (!until) return;

  rateLimitBus.emit({
    untilTimestampMs: until,
    retryAfterSeconds: getRemainingCooldown(),
  });
}

/**
 * Handle rate limit error from API response
 * @param error - Axios error with 429 status
 */
export function handleRateLimitError(error: AxiosError): void {
  const retryAfterHeader = error.response?.headers?.[
    "retry-after"
  ] as unknown as string | undefined;

  const retryAfterSeconds = retryAfterHeader
    ? Math.max(1, parseInt(String(retryAfterHeader), 10))
    : 60; // Default to 60 seconds if header not present

  const until = Date.now() + retryAfterSeconds * 1000;

  setRateLimitUntil(until);
  rateLimitBus.emit({ untilTimestampMs: until, retryAfterSeconds });
}

/**
 * Create rate limit error for request blocking
 * @returns Error object with 429 status
 */
export function createRateLimitError(): Error & {
  response?: { status?: number };
} {
  const error = new Error("Rate limited - cooldown active") as Error & {
    response?: { status?: number };
  };
  error.response = { status: 429 };
  return error;
}
