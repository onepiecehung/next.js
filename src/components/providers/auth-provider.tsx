"use client"

import { useEffect } from "react"
import { useAtom } from "jotai"
import { currentUserAtom, fetchMeAction } from "@/lib/auth-store"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [, setUser] = useAtom(currentUserAtom)

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        // Try to fetch current user data
        const user = await fetchMeAction()
        setUser(user)
      } catch {
        // User is not authenticated, clear state
        setUser(null)
      }
    }

    checkAuth()
  }, [setUser])

  return <>{children}</>
}
