"use client";

import type { User } from "@/lib/interface";
import { useAtom } from "jotai";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { LoginDialog } from "@/components/features/auth";
import { SearchBar } from "@/components/features/series";
import { useI18n } from "@/components/providers/i18n-provider";
import { ThemeSelector, UserDropdown } from "@/components/ui";
import { LanguageSwitcher } from "@/components/ui/navigation";
import {
  authLoadingAtom,
  clearUserState,
  currentUserAtom,
  logoutAction,
} from "@/lib/auth";

/**
 * Internationalized Site Navigation Component
 * Main navigation bar with language switcher, theme toggle, and user authentication
 * Uses custom i18n hook for multi-language support
 */
export default function SiteNav() {
  const { t } = useI18n();
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
      toast.success(t("toastLogoutSuccess", "toast"));
    } catch {
      toast.error(t("toastLogoutError", "toast"));
      // Even if logout API fails, clear local state
      setUser(null);
      clearUserState();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/50 shadow-sm">
      <div className="container mx-auto px-4 py-3.5 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-semibold text-lg md:text-xl text-foreground shrink-0"
          >
            {t("appName", "common")}
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-xl lg:max-w-2xl hidden md:block mx-4">
            <SearchBar className="w-full" />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Mobile search - show on small screens */}
            <div className="md:hidden">
              <SearchBar
                className="w-48 sm:w-64"
                showKeyboardShortcut={false}
              />
            </div>
            <LanguageSwitcher />
            <ThemeSelector variant="compact" />
            {(() => {
              if (authLoading)
                return (
                  <div className="h-8 w-20 animate-pulse bg-muted rounded" />
                );
              if (user?.id)
                return (
                  <UserDropdown
                    user={user as User & { id: string }}
                    onLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                  />
                );
              return <LoginDialog />;
            })()}
          </div>
        </div>
      </div>
    </header>
  );
}
