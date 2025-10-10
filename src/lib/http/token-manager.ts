/**
 * Token Manager
 * Handles access and refresh token storage and management
 */

// In-memory storage for access token (not persisted to localStorage for security)
let ACCESS_TOKEN: string | null = null;

/**
 * Set the access token in memory
 * @param token - The access token to store
 */
export function setAccessToken(token: string | null): void {
  ACCESS_TOKEN = token;
}

/**
 * Get the current access token from memory
 * @returns The current access token or null
 */
export function getAccessToken(): string | null {
  return ACCESS_TOKEN;
}

/**
 * Clear the access token from memory
 */
export function clearAccessToken(): void {
  ACCESS_TOKEN = null;
}

/**
 * Get refresh token from localStorage (fallback method)
 * Only used when backend doesn't set HttpOnly cookies
 * @returns The refresh token or null
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rt");
}

/**
 * Set refresh token in localStorage (fallback method)
 * @param token - The refresh token to store
 */
export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rt", token);
}

/**
 * Clear refresh token from localStorage
 */
export function clearRefreshToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rt");
}

/**
 * Clear all tokens (both access and refresh)
 */
export function clearAllTokens(): void {
  clearAccessToken();
  clearRefreshToken();
}

/**
 * Check if user has valid tokens
 * @returns True if access token exists
 */
export function hasValidToken(): boolean {
  return ACCESS_TOKEN !== null;
}
