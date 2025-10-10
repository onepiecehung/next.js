const REFRESH_TOKEN_STORAGE_KEY = "rt";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearTokens() {
  accessToken = null;
}

function isBrowserEnvironment() {
  return typeof window !== "undefined";
}

export function getRefreshTokenFallback(): string | null {
  if (!isBrowserEnvironment()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setRefreshTokenFallback(token: string) {
  if (!isBrowserEnvironment()) return;
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
}

export function clearRefreshTokenFallback() {
  if (!isBrowserEnvironment()) return;
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}
