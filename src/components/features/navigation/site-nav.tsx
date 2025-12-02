"use client";

import type { User } from "@/lib/interface";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { LoginDialog } from "@/components/features/auth";
import { SearchBar } from "@/components/features/series";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ThemeSelector,
  UserDropdown,
} from "@/components/ui";
import { Button } from "@/components/ui/core/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LanguageSwitcher } from "@/components/ui/navigation";
import { VisuallyHidden } from "@/components/ui/utilities/visually-hidden";
import {
  authLoadingAtom,
  clearUserState,
  currentUserAtom,
  logoutAction,
} from "@/lib/auth";
import { LogOut, PenTool, Settings, User as UserIcon } from "lucide-react";

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
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  // Use ref to track animation state to avoid stale closure in onAnimationComplete
  const isAnimatingOutRef = useRef(false);

  // Handle navigation inside the mobile menu and trigger closing animation
  const handleNavigate = (path: string) => {
    router.push(path);
    handleCloseMenu();
  };

  const handleLoginClick = () => {
    router.push("/auth/login");
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    if (!isAnimatingOutRef.current) {
      setIsAnimatingOut(true);
      isAnimatingOutRef.current = true;
      // Dialog will be closed when animation completes (via onAnimationComplete)
    }
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
      <Dialog
        open={isMobileMenuOpen || isAnimatingOut}
        onOpenChange={(open) => {
          if (!open && !isAnimatingOutRef.current) {
            // Only handle close if not already animating out
            handleCloseMenu();
          } else if (open) {
            setIsMobileMenuOpen(true);
            setIsAnimatingOut(false);
            isAnimatingOutRef.current = false;
          }
        }}
      >
        <DialogContent
          className="!fixed !inset-0 !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !p-0 md:!hidden !animate-none data-[state=open]:!animate-none data-[state=closed]:!animate-none [&>div[data-slot='dialog-overlay']]:!animate-none [&>div[data-slot='dialog-overlay']]:data-[state=open]:!animate-none [&>div[data-slot='dialog-overlay']]:data-[state=closed]:!animate-none"
          showCloseButton={false}
        >
          <VisuallyHidden>
            <DialogTitle>{t("appName", "common")} - Menu</DialogTitle>
          </VisuallyHidden>

          {/* Custom overlay with synchronized animation - replaces default overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isAnimatingOut ? { opacity: 0 } : { opacity: 1 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="fixed inset-0 z-40 bg-black/50"
            style={{ pointerEvents: isAnimatingOut ? "none" : "auto" }}
            onClick={handleCloseMenu}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={isAnimatingOut ? { x: "100%" } : { x: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.4,
            }}
            onAnimationComplete={() => {
              // Use ref to check current state, avoiding stale closure
              if (isAnimatingOutRef.current) {
                // Small delay to ensure smooth transition before unmounting
                setTimeout(() => {
                  setIsMobileMenuOpen(false);
                  setIsAnimatingOut(false);
                  isAnimatingOutRef.current = false;
                }, 100);
              }
            }}
            className="relative z-50 flex h-full w-full flex-col bg-background"
          >
            {/* Header with close button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={
                isAnimatingOut ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }
              }
              transition={{ delay: isAnimatingOut ? 0 : 0.1, duration: 0.2 }}
              className="flex items-center justify-between border-b border-border bg-background p-4"
            >
              <h2 className="text-lg font-semibold text-foreground">
                {t("appName", "common")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseMenu}
                aria-label="Close menu"
                className="h-10 w-10 shrink-0"
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>

            {/* Content area with stagger animation */}
            <motion.div
              initial="closed"
              animate={isAnimatingOut ? "closed" : "open"}
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
                  <div className="flex flex-col gap-3">
                    {/* User summary card for mobile view */}
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                      <Avatar className="h-10 w-10">
                        {user.avatar?.url && (
                          <AvatarImage
                            src={user.avatar.url}
                            alt={`${user.name || user.username || user.email || "User"} avatar`}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="bg-purple-500/20 text-purple-600 dark:bg-purple-400/20 dark:text-purple-300">
                          {(
                            user.name ||
                            user.username ||
                            user.email?.split("@")[0] ||
                            "US"
                          )
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {user.name ||
                            user.username ||
                            user.email?.split("@")[0] ||
                            "User"}
                        </span>
                        {user.email && (
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Primary account actions optimized for touch on mobile */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => handleNavigate("/write")}
                      >
                        <PenTool className="h-4 w-4" />
                        <span>{t("userDropdownWrite", "user")}</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => handleNavigate(`/user/${user.id}`)}
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>{t("userDropdownProfile", "user")}</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => handleNavigate("/settings")}
                      >
                        <Settings className="h-4 w-4" />
                        <span>{t("userDropdownSettings", "user")}</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-red-600 hover:text-red-600 hover:bg-red-500/5 dark:text-red-400 dark:hover:text-red-400"
                        onClick={() => {
                          handleLogout();
                          handleCloseMenu();
                        }}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>
                          {isLoggingOut
                            ? t("userDropdownLoggingOut", "user")
                            : t("userDropdownLogout", "user")}
                        </span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button className="w-full" onClick={handleLoginClick}>
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
