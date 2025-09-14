"use client";

import { atom, useAtom } from "jotai";
import {
  http,
  setAccessToken,
  clearTokens,
  setRefreshTokenFallback,
  clearRefreshTokenFallback,
} from "@/lib/http";
import type {
  User,
  ApiResponse,
  LoginResponse,
  FirebaseLoginRequest,
  OTPRequestRequest,
  OTPRequestResponse,
  OTPVerifyRequest,
  OTPVerifyResponse,
} from "@/lib/types";
import {
  signInWithGoogle,
  signInWithGithub,
  signOutFirebase,
} from "@/lib/firebase";

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

  // Also set a cookie for middleware to check
  if (typeof document !== "undefined") {
    // Set cookie with longer expiration and proper attributes
    document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
  }

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

  // Also set a cookie for middleware to check
  if (typeof document !== "undefined") {
    // Set cookie with longer expiration and proper attributes
    document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
  }

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

  // Clear the access token cookie
  if (typeof document !== "undefined") {
    document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict";
  }
}

// Check if access token is valid and refresh if needed
export async function checkAndRefreshToken(): Promise<boolean> {
  try {
    console.log("checkAndRefreshToken: Starting token check...");
    // Try to fetch user data to check if token is valid
    // The http interceptor will handle 401 and refresh automatically
    const user = await fetchMeAction();
    console.log("checkAndRefreshToken: Token is valid, user:", user);
    return true;
  } catch (error) {
    console.log("checkAndRefreshToken: Token check failed:", error);
    // If any error occurs (including 401), clear state and return false
    // The interceptor will have already tried to refresh the token
    clearUserState();
    return false;
  }
}

// Firebase Google login action
export async function loginWithGoogleAction(): Promise<User> {
  try {
    // Step 1: Sign in with Google using Firebase
    const firebaseUser = await signInWithGoogle();

    // Step 2: Get Firebase ID token
    const idToken = await firebaseUser.getIdToken();

    // Step 3: Send ID token to backend for authentication
    const requestBody: FirebaseLoginRequest = {
      idToken: idToken,
    };
    const response = await http.post<ApiResponse<LoginResponse>>(
      "/auth/firebase/login",
      requestBody,
    );

    // Check if API response is successful
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Firebase authentication failed",
      );
    }

    const { user, token } = response.data.data;
    const { accessToken, refreshToken } = token;

    if (!accessToken) {
      throw new Error("No access token returned from server");
    }

    // Step 4: Store access token in memory (secure, not persisted)
    setAccessToken(accessToken);

    // Step 5: Set cookie for middleware to check
    if (typeof document !== "undefined") {
      document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
    }

    // Step 6: Store refresh token in localStorage only if backend doesn't set HttpOnly cookies
    if (refreshToken) {
      setRefreshTokenFallback(refreshToken);
      console.warn(
        "⚠️ Using fallback refresh token storage - not secure for production",
      );
    }

    return user;
  } catch (error) {
    console.error("Firebase Google login error:", error);
    throw error;
  }
}

// Firebase GitHub login action
export async function loginWithGithubAction(): Promise<User> {
  try {
    // Step 1: Sign in with GitHub using Firebase
    const firebaseUser = await signInWithGithub();

    // Step 2: Get Firebase ID token
    const idToken = await firebaseUser.getIdToken();

    // Step 3: Send ID token to backend for authentication
    const requestBody: FirebaseLoginRequest = {
      idToken: idToken,
    };
    const response = await http.post<ApiResponse<LoginResponse>>(
      "/auth/firebase/login",
      requestBody,
    );

    // Check if API response is successful
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Firebase authentication failed",
      );
    }

    const { user, token } = response.data.data;
    const { accessToken, refreshToken } = token;

    if (!accessToken) {
      throw new Error("No access token returned from server");
    }

    // Step 4: Store access token in memory (secure, not persisted)
    setAccessToken(accessToken);

    // Step 5: Set cookie for middleware to check
    if (typeof document !== "undefined") {
      document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
    }

    // Step 6: Store refresh token in localStorage only if backend doesn't set HttpOnly cookies
    if (refreshToken) {
      setRefreshTokenFallback(refreshToken);
      console.warn(
        "⚠️ Using fallback refresh token storage - not secure for production",
      );
    }

    return user;
  } catch (error) {
    console.error("Firebase GitHub login error:", error);
    throw error;
  }
}

// OTP Request action: sends OTP to email
export async function requestOTPAction(
  email: string,
): Promise<{ requestId: string; expiresIn: number }> {
  try {
    const requestBody: OTPRequestRequest = {
      email: email,
    };

    const response = await http.post<ApiResponse<OTPRequestResponse>>(
      "/auth/otp/request",
      requestBody,
    );

    // Check if API response is successful
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to send OTP");
    }

    return {
      requestId: response.data.data.requestId,
      expiresIn: response.data.data.expiresIn,
    };
  } catch (error) {
    console.error("OTP request error:", error);
    throw error;
  }
}

// OTP Verify action: verifies OTP code
export async function verifyOTPAction(
  email: string,
  code: string,
  requestId: string,
): Promise<User> {
  try {
    const requestBody: OTPVerifyRequest = {
      email: email,
      code: code,
      requestId: requestId,
    };

    const response = await http.post<ApiResponse<OTPVerifyResponse>>(
      "/auth/otp/verify",
      requestBody,
    );

    // Check if API response is successful
    if (!response.data.success) {
      throw new Error(response.data.message || "OTP verification failed");
    }

    const { user, token } = response.data.data;
    const { accessToken, refreshToken } = token;

    if (!accessToken) {
      throw new Error("No access token returned from server");
    }

    // Store access token in memory (secure, not persisted)
    setAccessToken(accessToken);

    // Set cookie for middleware to check
    if (typeof document !== "undefined") {
      document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
    }

    // Store refresh token in localStorage only if backend doesn't set HttpOnly cookies
    if (refreshToken) {
      setRefreshTokenFallback(refreshToken);
      console.warn(
        "⚠️ Using fallback refresh token storage - not secure for production",
      );
    }

    return user;
  } catch (error) {
    console.error("OTP verification error:", error);
    throw error;
  }
}

// Logout action: clears all tokens and user state
export async function logoutAction() {
  try {
    // Sign out from Firebase if user was logged in via Firebase
    await signOutFirebase();

    // Attempt to call logout endpoint (best effort)
    await http.post("/auth/logout");
  } catch {
    // Ignore logout errors - still clear local state
    console.warn("Logout endpoint failed, but clearing local state");
  }

  // Clear all tokens from memory and localStorage
  clearUserState();
}
