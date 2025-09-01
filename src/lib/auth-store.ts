"use client";

import { atom, useAtom } from "jotai";
import {
  http,
  setAccessToken,
  clearTokens,
  setRefreshTokenFallback,
  clearRefreshTokenFallback,
} from "@/lib/http";
import type { User, ApiResponse, LoginResponse } from "@/lib/types";

// Jotai atoms for state management
export const accessTokenAtom = atom<string | null>(null);
export const currentUserAtom = atom<User | null>(null);
export const authLoadingAtom = atom<boolean>(false);
export const userProfileLoadingAtom = atom<boolean>(false);

// Function to set user profile loading state
export function setUserProfileLoading(loading: boolean) {
  // This will be used by components to control the global loading state
  return loading;
}

// Hook for managing user profile loading state
export function useUserProfileLoading() {
  const [loading, setLoading] = useAtom(userProfileLoadingAtom);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return {
    loading,
    startLoading,
    stopLoading,
  };
}

// Login action: handles both cookie-based and fallback refresh token scenarios
export async function loginAction(
  email: string,
  password: string,
): Promise<User> {
  const response = await http.post<ApiResponse<LoginResponse>>("/auth/login", {
    email,
    password,
  });

  // Check if API response is successful
  if (!response.data.success) {
    throw new Error(response.data.message || "Login failed");
  }

  const { user, token } = response.data.data;
  const { accessToken, refreshToken } = token;

  if (!accessToken) {
    throw new Error("No access token returned from server");
  }

  // Store access token in memory (secure, not persisted)
  setAccessToken(accessToken);

  // Store refresh token in localStorage only if backend doesn't set HttpOnly cookies
  // This is a fallback mechanism and should be avoided in production
  if (refreshToken) {
    setRefreshTokenFallback(refreshToken);
    console.warn(
      "⚠️ Using fallback refresh token storage - not secure for production",
    );
  }

  return user;
}

// Signup action: handles user registration
export async function signupAction(
  username: string,
  email: string,
  password: string,
  name?: string,
  dob?: string,
  phoneNumber?: string,
): Promise<User> {
  const signupData = {
    username,
    email,
    password,
    ...(name && { name }),
    ...(dob && { dob }),
    ...(phoneNumber && { phoneNumber }),
  };

  const response = await http.post<ApiResponse<LoginResponse>>(
    "/auth/signup",
    signupData,
  );

  // Check if API response is successful
  if (!response.data.success) {
    throw new Error(response.data.message || "Signup failed");
  }

  const { user, token } = response.data.data;
  const { accessToken, refreshToken } = token;

  if (!accessToken) {
    throw new Error("No access token returned from server");
  }

  // Store access token in memory (secure, not persisted)
  setAccessToken(accessToken);

  // Store refresh token in localStorage only if backend doesn't set HttpOnly cookies
  // This is a fallback mechanism and should be avoided in production
  if (refreshToken) {
    setRefreshTokenFallback(refreshToken);
    console.warn(
      "⚠️ Using fallback refresh token storage - not secure for production",
    );
  }

  return user;
}

// Fetch current user information
export async function fetchMeAction(): Promise<User> {
  const response = await http.get<ApiResponse<User>>("/users/me");

  // Check if API response is successful
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch user data");
  }

  return response.data.data;
}

// Clear all user state and tokens
export function clearUserState() {
  clearTokens();
  clearRefreshTokenFallback();
}

// Check if access token is valid and refresh if needed
export async function checkAndRefreshToken(): Promise<boolean> {
  try {
    // Try to fetch user data to check if token is valid
    // The http interceptor will handle 401 and refresh automatically
    await fetchMeAction();
    return true;
  } catch {
    // If any error occurs (including 401), clear state and return false
    // The interceptor will have already tried to refresh the token
    clearUserState();
    return false;
  }
}

// Logout action: clears all tokens and user state
export async function logoutAction() {
  try {
    // Attempt to call logout endpoint (best effort)
    await http.post("/auth/logout");
  } catch {
    // Ignore logout errors - still clear local state
    console.warn("Logout endpoint failed, but clearing local state");
  }

  // Clear all tokens from memory and localStorage
  clearUserState();
}
