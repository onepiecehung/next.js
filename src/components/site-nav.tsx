"use client";

import Link from "next/link";
import { useAtom } from "jotai";
import {
  currentUserAtom,
  logoutAction,
  clearUserState,
  authLoadingAtom,
} from "@/lib/auth-store";
import LoginDialog from "@/components/auth/login-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserDropdown } from "@/components/ui/user-dropdown";

export default function SiteNav() {
  const [user, setUser] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutAction();
      // Clear user state after successful logout
      setUser(null);
      clearUserState(); // Ensure all tokens are cleared
      toast.success("Successfully logged out");
    } catch {
      toast.error("Logout failed");
      // Even if logout API fails, clear local state
      setUser(null);
      clearUserState();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-xl text-foreground">
          Medium-ish
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {(() => {
            if (authLoading)
              return (
                <div className="h-8 w-20 animate-pulse bg-muted rounded" />
              );
            if (user)
              return (
                <UserDropdown
                  user={user}
                  onLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                />
              );
            return <LoginDialog />;
          })()}
        </div>
      </div>
    </header>
  );
}
