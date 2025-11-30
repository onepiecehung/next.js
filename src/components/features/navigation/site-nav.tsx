"use client";

import type { User } from "@/lib/interface";
import { useAtom } from "jotai";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

      {/* Mobile Sidebar - Full Screen with Smooth Animation */}
      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent
          className="!fixed !inset-0 !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !p-0 md:!hidden"
          showCloseButton={false}
        >
          <VisuallyHidden>
            <DialogTitle>{t("appName", "common")} - Menu</DialogTitle>
          </VisuallyHidden>
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              mass: 0.5,
            }}
            className="flex h-full w-full flex-col bg-background"
          >
            {/* Header with close button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="flex items-center justify-between border-b border-border bg-background p-4"
            >
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
            </motion.div>

            {/* Content area with stagger animation */}
            <motion.div
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.15,
                  },
                },
                closed: {
                  transition: {
                    staggerChildren: 0.03,
                    staggerDirection: -1,
                  },
                },
              }}
              className="flex flex-1 flex-col gap-4 sm:gap-5 overflow-y-auto p-4 sm:p-5"
            >
              {/* Language Switcher */}
              <motion.div
                variants={{
                  open: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      type: "spring",
                      damping: 20,
                      stiffness: 300,
                    },
                  },
                  closed: {
                    opacity: 0,
                    x: 20,
                    transition: {
                      duration: 0.2,
                    },
                  },
                }}
                className="flex flex-col gap-2 sm:gap-3"
              >
                <label className="text-sm font-medium text-foreground">
                  {t("nav.language", "common")}
                </label>
                <div className="w-full">
                  <LanguageSwitcher 
                    variant="full" 
                    size="default" 
                    className="w-full justify-start"
                  />
                </div>
              </motion.div>

              {/* Theme Selector */}
              <motion.div
                variants={{
                  open: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      type: "spring",
                      damping: 20,
                      stiffness: 300,
                    },
                  },
                  closed: {
                    opacity: 0,
                    x: 20,
                    transition: {
                      duration: 0.2,
                    },
                  },
                }}
                className="flex flex-col gap-2 sm:gap-3"
              >
                <label className="text-sm font-medium text-foreground">
                  {t("nav.theme", "common")}
                </label>
                <div className="w-full">
                  <ThemeSelector 
                    variant="full" 
                    size="default" 
                    className="w-full justify-start"
                  />
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div
                variants={{
                  open: {
                    opacity: 1,
                    scaleX: 1,
                    transition: {
                      delay: 0.2,
                      duration: 0.3,
                    },
                  },
                  closed: {
                    opacity: 0,
                    scaleX: 0,
                    transition: {
                      duration: 0.2,
                    },
                  },
                }}
                className="border-t border-border my-1 origin-left"
              />

              {/* Auth Section */}
              <motion.div
                variants={{
                  open: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      type: "spring",
                      damping: 20,
                      stiffness: 300,
                    },
                  },
                  closed: {
                    opacity: 0,
                    x: 20,
                    transition: {
                      duration: 0.2,
                    },
                  },
                }}
                className="flex flex-col gap-2 sm:gap-3"
              >
                <label className="text-sm font-medium text-foreground">
                  {t("nav.account", "common")}
                </label>
                {authLoading ? (
                  <div className="h-10 w-full animate-pulse bg-muted rounded" />
                ) : user?.id ? (
                  <UserDropdown
                    user={user as User & { id: string }}
                    onLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                  />
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleLoginClick}
                  >
                    {t("login.button", "auth") || "Login"}
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
