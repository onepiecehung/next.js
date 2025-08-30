"use client"

import Link from "next/link"
import { useAtom } from "jotai"
import { currentUserAtom, logoutAction } from "@/lib/auth-store"
import LoginDialog from "@/components/auth/login-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"

export default function SiteNav() {
  const [user] = useAtom(currentUserAtom)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logoutAction()
      toast.success("Successfully logged out")
    } catch {
      toast.error("Logout failed")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-xl text-gray-900">
          Medium-ish
        </Link>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Hi, {user.name || user.email}
              </span>
              <Link href="/write">
                <Button size="sm">Write</Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <LoginDialog />
          )}
        </div>
      </div>
    </header>
  )
}
