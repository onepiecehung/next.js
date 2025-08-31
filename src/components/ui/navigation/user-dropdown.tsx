"use client";

import * as React from "react";
import { User, LogOut, Settings, PenTool } from "lucide-react";
import Link from "next/link";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui";
import { useIsMounted } from "@/components/providers/no-ssr";
import { useI18n } from "@/components/providers/i18n-provider";

interface UserDropdownProps {
  user: {
    id: string;
    name?: string | null;
    username?: string | null;
    email: string;
    avatar?: {
      url: string;
      key: string;
    } | null;
  };
  onLogout: () => void;
  isLoggingOut: boolean;
}

/**
 * Internationalized User dropdown menu component
 * Shows user info and provides quick access to user actions
 * Uses custom i18n hook for multi-language support
 */
export function UserDropdown({
  user,
  onLogout,
  isLoggingOut,
}: Readonly<UserDropdownProps>) {
  const { t } = useI18n();
  const isMounted = useIsMounted();
  const displayName = user.name || user.username || user.email.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();
  const hasAvatar = user.avatar?.url;

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        className="relative h-8 w-8 rounded-full"
        disabled
      >
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full hover:bg-purple-500/10"
        >
          <Avatar className="h-8 w-8">
            {/* Show user avatar if available */}
            {hasAvatar && (
              <AvatarImage
                src={user.avatar?.url || ""}
                alt={`${displayName}'s avatar`}
                className="object-cover"
              />
            )}
            {/* Fallback to initials if no avatar or image fails to load */}
            <AvatarFallback className="bg-purple-500/20 text-purple-600 dark:bg-purple-400/20 dark:text-purple-300">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 border-purple-500/20 bg-card/95 backdrop-blur-sm"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">
              {displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-purple-500/20" />

        <DropdownMenuItem asChild>
          <Link href="/write" className="cursor-pointer">
            <PenTool className="mr-2 h-4 w-4" />
            <span>{t("user.dropdown.write", "user")}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/users/${user.id}`} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{t("user.dropdown.profile", "user")}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t("user.dropdown.settings", "user")}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-purple-500/20" />

        <DropdownMenuItem
          key="logout"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>
            {isLoggingOut
              ? t("userMenu.loggingOut", "common")
              : t("userMenu.logout", "common")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
