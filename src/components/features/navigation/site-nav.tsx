"use client";

import type { User } from "@/lib/interface";
import { useAtom } from "jotai";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { LoginDialog } from "@/components/features/auth";
import { SearchBar } from "@/components/features/series";
import { useI18n } from "@/components/providers/i18n-provider";
import { ThemeSelector, UserDropdown } from "@/components/ui";
import { Button } from "@/components/ui/core/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { LanguageSwitcher } from "@/components/ui/navigation";
import { VisuallyHidden } from "@/components/ui/utilities/visually-hidden";
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
  const router = useRouter();
  const [user, setUser] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    router.push("/auth/login");
    setIsMobileMenuOpen(false);
  };

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
    <>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/50 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="font-semibold text-base sm:text-lg md:text-xl text-foreground shrink-0"
            >
              {t("appName", "common")}
            </Link>

            {/* Search Bar - Center (Desktop only) */}
            <div className="flex-1 max-w-xl lg:max-w-2xl hidden md:block mx-4">
              <SearchBar className="w-full" />
            </div>

            {/* Desktop actions - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 md:gap-3 shrink-0">
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

            {/* Mobile menu button - show on small screens */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar - Full Screen */}
      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent
          className="!fixed !inset-0 !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !p-0 data-[state=closed]:!slide-out-to-right data-[state=open]:!slide-in-from-right md:!hidden"
          showCloseButton={false}
        >
          <VisuallyHidden>
            <DialogTitle>{t("appName", "common")} - Menu</DialogTitle>
          </VisuallyHidden>
          <div className="flex h-full flex-col bg-background">
            {/* Header with close button */}
            <div className="flex items-center justify-between border-b border-border bg-background p-4">
              <h2 className="text-lg font-semibold text-foreground">
                {t("appName", "common")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="h-10 w-10 shrink-0"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Content area */}
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {/* Search Bar */}
            <div className="w-full">
              <SearchBar
                className="w-full"
                showKeyboardShortcut={false}
              />
            </div>

            {/* Language Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Language</span>
              <LanguageSwitcher />
            </div>

            {/* Theme Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ThemeSelector variant="compact" />
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Auth Section */}
            <div className="flex flex-col gap-3">
              {authLoading ? (
                <div className="h-10 w-full animate-pulse bg-muted rounded" />
              ) : user?.id ? (
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">Account</div>
                  <UserDropdown
                    user={user as User & { id: string }}
                    onLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">Account</div>
                  <Button
                    className="w-full"
                    onClick={handleLoginClick}
                  >
                    {t("login.title", "auth") || "Login"}
                  </Button>
                </div>
              )}
            </div>
          </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
