import axios from "axios"

// In-memory storage for access token (not persisted to localStorage for security)
let ACCESS_TOKEN: string | null = null

// Helper functions for token management
export function setAccessToken(token: string | null) { 
  ACCESS_TOKEN = token 
}

export function getAccessToken() { 
  return ACCESS_TOKEN 
}

export function clearTokens() { 
  ACCESS_TOKEN = null 
}

// Fallback functions for refresh token (only used when backend doesn't set HttpOnly cookies)
export function getRefreshTokenFallback(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("rt")
}

export function setRefreshTokenFallback(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("rt", token)
}

export function clearRefreshTokenFallback() {
  if (typeof window === "undefined") return
  localStorage.removeItem("rt")
}

// Create axios instance with base URL from environment
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  withCredentials: true, // Required for cookie-based refresh tokens
})

// Request interceptor: automatically attach Authorization header if access token exists
http.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response interceptor: handle 401 errors and automatically refresh tokens
let isRefreshing = false
let queue: Array<() => void> = []

async function refreshAccessToken() {
  try {
    // Priority: Cookie-based refresh (backend sets HttpOnly cookie)
    const res = await http.post("/auth/refresh")
    if (res.data?.accessToken) {
      setAccessToken(res.data.accessToken)
      return res.data.accessToken
    }
    
    // Fallback: Body-based refresh (when backend doesn't set cookies)
    const refreshToken = getRefreshTokenFallback()
    if (!refreshToken) throw new Error("No refresh token available")
    
    const fallbackRes = await http.post("/auth/refresh", { refreshToken })
    if (fallbackRes.data?.accessToken) {
      setAccessToken(fallbackRes.data.accessToken)
      return fallbackRes.data.accessToken
    }
    
    throw new Error("Failed to obtain access token from refresh")
  } catch (error) {
    // Clear all tokens on refresh failure
    clearTokens()
    clearRefreshTokenFallback()
    throw error
  }
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error?.response?.status
    
    // Handle 401 Unauthorized errors
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for the current refresh to complete
        await new Promise<void>((resolve) => queue.push(resolve))
      } else {
        // Start refresh process
        isRefreshing = true
        try {
          await refreshAccessToken()
        } finally {
          isRefreshing = false
          // Execute all queued requests
          queue.forEach((resolve) => resolve())
          queue = []
        }
      }
      
      // Mark request as retried and retry with new token
      originalRequest._retry = true
      originalRequest.headers = originalRequest.headers || {}
      const newAccessToken = getAccessToken()
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      }
      
      // Retry the original request
      return http(originalRequest)
    }
    
    return Promise.reject(error)
  }
)
