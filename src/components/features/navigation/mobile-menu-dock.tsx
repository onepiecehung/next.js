"use client";

import { useAtom } from "jotai";
import {
  Home,
  LogIn,
  LogOut,
  Search,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { SearchBar } from "@/components/features/series";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ThemeSelector,
} from "@/components/ui";
import { Button } from "@/components/ui/core/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog";
import { Separator } from "@/components/ui/layout/separator";
import { LanguageSwitcher } from "@/components/ui/navigation";
import {
  MenuDock,
  type MenuDockItem,
} from "@/components/ui/shadcn-io/menu-dock";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn-io/popover";
import { authLoadingAtom, currentUserAtom } from "@/lib/auth";

interface MobileMenuDockProps {
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

/**
 * Mobile Menu Dock Navigation
 * Horizontal navigation bar at the bottom of mobile screens
 * Replaces the FAB button with a dock-style navigation
 */
export default function MobileMenuDock({
  onLogout,
  isLoggingOut,
}: MobileMenuDockProps) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useAtom(currentUserAtom);
  const [authLoading] = useAtom(authLoadingAtom);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userSelectedIndex, setUserSelectedIndex] = useState<number | null>(
    null,
  );

  // Calculate menu items based on auth state
  const menuItems = useMemo<MenuDockItem[]>(() => {
    const items: MenuDockItem[] = [
      {
        label: t("nav.home", "common") || "Home",
        icon: Home,
        onClick: () => {
          router.push("/");
        },
      },
      {
        label: t("actions.search", "common") || "Search",
        icon: Search,
        onClick: () => {
          setIsSearchOpen(true);
        },
      },
    ];

    // Add Profile item if user is authenticated, otherwise add Login button
    // Write button is hidden per requirements
    if (user?.id) {
      items.push({
        label: t("nav.profile", "common") || "Profile",
        icon: UserIcon,
        onClick: () => {
          setIsSettingsOpen(true);
        },
      });
    } else {
      // Add Login button when user is not authenticated
      // Find the index where Login will be inserted
      const loginIndex = items.length;
      items.push({
        label: t("login.button", "auth") || "Login",
        icon: LogIn,
        onClick: () => {
          // Set active index immediately before navigation
          setUserSelectedIndex(loginIndex);
          // Get current path to redirect back after login
          const currentPath = window.location.pathname;
          const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
          router.push(loginUrl);
        },
      });
    }

    // Always add Settings as last item
    items.push({
      label: t("nav.settings", "common") || "Settings",
      icon: Settings,
      onClick: () => {
        router.push("/settings");
      },
    });

    return items;
  }, [user, t, router]);

  // Calculate active index based on current pathname
  const pathnameBasedIndex = useMemo(() => {
    if (pathname === "/") {
      return 0;
    }
    // Check for Search - this is index 1, but we don't have a specific route for it
    // So we'll handle it via user click only

    // Check for Login route (when not authenticated)
    if (pathname.startsWith("/auth/login") && !user?.id) {
      const loginIndex = menuItems.findIndex(
        (item) => item.label === (t("login.button", "auth") || "Login"),
      );
      if (loginIndex !== -1) {
        return loginIndex;
      }
    }

    if (pathname.startsWith("/user/") && user?.id) {
      // Find Profile item by checking if onClick navigates to user profile
      const profileIndex = menuItems.findIndex(
        (item) => item.label === (t("nav.profile", "common") || "Profile"),
      );
      if (profileIndex !== -1) {
        return profileIndex;
      }
    }
    if (pathname.startsWith("/settings")) {
      // Settings is always the last item
      return menuItems.length - 1;
    }
    // For other routes, default to home
    return 0;
  }, [pathname, menuItems, user?.id, t]);

  // Determine final active index: use user selection if available and valid, otherwise use pathname-based
  const finalActiveIndex = useMemo(() => {
    // If user has selected an index and it's valid, use it
    if (
      userSelectedIndex !== null &&
      userSelectedIndex >= 0 &&
      userSelectedIndex < menuItems.length
    ) {
      return userSelectedIndex;
    }
    // Otherwise, use pathname-based index
    // Ensure it's within bounds
    if (
      pathnameBasedIndex >= 0 &&
      pathnameBasedIndex < menuItems.length &&
      menuItems.length > 0
    ) {
      return pathnameBasedIndex;
    }
    // Fallback to 0
    return 0;
  }, [userSelectedIndex, pathnameBasedIndex, menuItems.length]);

  // Track previous pathname to detect changes
  const prevPathnameRef = useRef(pathname);

  // Reset user selection when pathname changes (navigation happened)
  // This allows pathname to take precedence after navigation
  // This is a legitimate use of useEffect to sync with router (external system)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      // Pathname changed, so clear user selection to use pathname-based index
      // eslint-disable-next-line -- Syncing with router state (external system)
      setUserSelectedIndex(null);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  // Handle navigation and close sheet
  const handleNavigate = (path: string) => {
    router.push(path);
    setIsSettingsOpen(false);
  };

  const handleLoginClick = () => {
    // Get current path to redirect back after login
    const currentPath = window.location.pathname;
    const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
    router.push(loginUrl);
    setIsSettingsOpen(false);
  };

  const handleLogout = async () => {
    await onLogout();
    setIsSettingsOpen(false);
  };

  return (
    <>
      {/* Settings Popover */}
      <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        {/* Menu Dock Navigation Container - serves as anchor */}
        <PopoverAnchor asChild>
          <div className="w-full flex justify-center">
            <MenuDock
              items={menuItems}
              variant="compact"
              orientation="horizontal"
              showLabels={true}
              animated={true}
              activeIndex={finalActiveIndex}
              onActiveIndexChange={setUserSelectedIndex}
              // className="w-full max-w-md"
            />
          </div>
        </PopoverAnchor>
        {/* Hidden trigger - controlled by Profile button click */}
        <PopoverTrigger asChild>
          <button
            className="sr-only"
            aria-label={t("nav.menu", "common") || "Menu"}
            aria-hidden="true"
            tabIndex={-1}
          />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="center"
          sideOffset={12}
          className="w-80 max-w-[calc(100vw-2rem)] max-h-[85vh] overflow-y-auto p-0"
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <h3 className="text-base font-semibold text-foreground">
              {t("nav.menu", "common") || "Menu"}
            </h3>
          </div>

          <div className="p-4 space-y-6">
            {/* Language Switcher Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("nav.language", "common")}
              </label>
              <LanguageSwitcher
                variant="full"
                size="sm"
                className="w-full justify-start h-9"
              />
            </div>

            {/* Theme Selector Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("nav.theme", "common")}
              </label>
              <ThemeSelector
                variant="full"
                size="sm"
                className="w-full justify-start h-9"
              />
            </div>

            <Separator />

            {/* Auth Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("nav.account", "common")}
              </label>
              {authLoading ? (
                <div className="h-9 w-full animate-pulse bg-muted rounded-lg" />
              ) : user?.id ? (
                <div className="space-y-2">
                  {/* User summary card */}
                  <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card/50 px-3 py-2.5 backdrop-blur-sm">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                      {user.avatar?.url && (
                        <AvatarImage
                          src={user.avatar.url}
                          alt={`${user.name || user.username || user.email || "User"} avatar`}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
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
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {user.name ||
                          user.username ||
                          user.email?.split("@")[0] ||
                          "User"}
                      </span>
                      {user.email && (
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2.5 h-9 text-sm px-2"
                      onClick={() => handleNavigate(`/user/${user.id}`)}
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>{t("userDropdownProfile", "user")}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2.5 h-9 text-sm px-2"
                      onClick={() => handleNavigate("/settings")}
                    >
                      <Settings className="h-4 w-4" />
                      <span>{t("userDropdownSettings", "user")}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2.5 h-9 text-sm px-2 text-red-600 hover:text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:text-red-400"
                      onClick={handleLogout}
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
                <Button
                  className="w-full h-9 text-sm font-medium"
                  onClick={handleLoginClick}
                >
                  {t("login.button", "auth") || "Login"}
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[90vw] max-w-[95vw] p-0 gap-0 top-[20%] translate-y-0">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle>
              {t("actions.search", "common") || "Search"}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4">
            <SearchBar
              className="w-full"
              showKeyboardShortcut={false}
              onSearch={(query) => {
                // Handle search if needed
                console.log("Search query:", query);
              }}
              onResultClick={() => {
                // Close search dialog when a result is clicked
                setIsSearchOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
