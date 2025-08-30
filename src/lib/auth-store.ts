"use client"

import { atom } from "jotai"
import { http, setAccessToken, clearTokens, setRefreshTokenFallback, clearRefreshTokenFallback } from "@/lib/http"

// User type definition
export type User = { 
  id: string
  email: string
  name?: string
  avatarUrl?: string 
}

// Jotai atoms for state management
export const accessTokenAtom = atom<string | null>(null)
export const currentUserAtom = atom<User | null>(null)
export const authLoadingAtom = atom<boolean>(false)

// Login action: handles both cookie-based and fallback refresh token scenarios
export async function loginAction(email: string, password: string): Promise<User> {
  const response = await http.post("/auth/login", { email, password })
  const { accessToken, refreshToken, user } = response.data || {}

  if (!accessToken) {
    throw new Error("No access token returned from server")
  }

  // Store access token in memory (secure, not persisted)
  setAccessToken(accessToken)
  
  // Store refresh token in localStorage only if backend doesn't set HttpOnly cookies
  // This is a fallback mechanism and should be avoided in production
  if (refreshToken) {
    setRefreshTokenFallback(refreshToken)
    console.warn("⚠️ Using fallback refresh token storage - not secure for production")
  }

  return user as User
}

// Fetch current user information
export async function fetchMeAction(): Promise<User> {
  const response = await http.get("/me")
  return response.data as User
}

// Logout action: clears all tokens and user state
export async function logoutAction() {
  try {
    // Attempt to call logout endpoint (best effort)
    await http.post("/auth/logout")
  } catch {
    // Ignore logout errors - still clear local state
    console.warn("Logout endpoint failed, but clearing local state")
  }
  
  // Clear all tokens from memory and localStorage
  clearTokens()
  clearRefreshTokenFallback()
}
