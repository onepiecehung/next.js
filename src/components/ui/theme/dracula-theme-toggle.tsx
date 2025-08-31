"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsMounted } from "@/components/providers/no-ssr";

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";

/**
 * Dracula-themed Theme Toggle component
 * Features Dracula color scheme and vampire-inspired icons
 */
export function DraculaThemeToggle() {
  const { setTheme, theme } = useTheme();
  const isMounted = useIsMounted();

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-10 px-0 border-purple-500/30"
        disabled
      >
        <div className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-10 px-0 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-purple-400" />
          <span className="sr-only">Toggle Dracula theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-purple-500/30 bg-card/95 backdrop-blur-sm"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-yellow-500/10 hover:text-yellow-500 focus:bg-yellow-500/10 focus:text-yellow-500"
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-purple-500/10 hover:text-purple-400 focus:bg-purple-500/10 focus:text-purple-400"
        >
          <Moon className="mr-2 h-4 w-4 text-purple-400" />
          <span>Dracula</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-cyan-500/10 hover:text-cyan-400 focus:bg-cyan-500/10 focus:text-cyan-400"
        >
          <Monitor className="mr-2 h-4 w-4 text-cyan-400" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Simple Dracula theme toggle button
 */
export function DraculaThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-10 px-0 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-purple-400" />
      <span className="sr-only">Toggle Dracula theme</span>
    </Button>
  );
}

/**
 * Special Dracula mode toggle with vampire icon
 */
export function DraculaModeToggle() {
  const { setTheme, theme } = useTheme();

  const isDracula = theme === "dark";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDracula ? "light" : "dark")}
      className={`w-10 px-0 transition-all duration-300 ${
        isDracula
          ? "border-purple-500 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      {isDracula ? (
        <Zap className="h-4 w-4 text-purple-400" />
      ) : (
        <Moon className="h-4 w-4 text-gray-600" />
      )}
      <span className="sr-only">Toggle Dracula mode</span>
    </Button>
  );
}
