"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Zap } from "lucide-react";
import { useIsMounted } from "@/components/providers/no-ssr";

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  variant?: "default" | "dracula" | "simple";
  size?: "sm" | "md";
  showLabels?: boolean;
  className?: string;
}

/**
 * Unified Theme Toggle component
 * Supports multiple variants: default, dracula, and simple
 * Eliminates code duplication and provides consistent theming
 * Uses enhanced theme hook for better management
 */
export function ThemeToggle({ 
  variant = "default", 
  size = "sm", 
  showLabels = true,
  className = ""
}: ThemeToggleProps) {
  const { 
    theme, 
    setTheme, 
    mounted, 
    isDark, 
    toggleTheme, 
    setDarkTheme, 
    setLightTheme, 
    setSystemTheme 
  } = useTheme();
  const isMounted = useIsMounted();

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted || !mounted) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`w-10 px-0 border-purple-500/30 ${className}`}
        disabled
      >
        <div className="h-4 w-4" />
      </Button>
    );
  }

  // Simple toggle variant (just light/dark)
  if (variant === "simple") {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={toggleTheme}
        className={`w-10 px-0 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 ${className}`}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-purple-400" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  // Dracula variant with vampire icon
  if (variant === "dracula") {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={toggleTheme}
        className={`w-10 px-0 transition-all duration-300 ${className} ${
          isDark
            ? "border-purple-500 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        {isDark ? (
          <Zap className="h-4 w-4 text-purple-400" />
        ) : (
          <Moon className="h-4 w-4 text-gray-600" />
        )}
        <span className="sr-only">Toggle Dracula mode</span>
      </Button>
    );
  }

  // Default variant (full dropdown with all themes)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={`w-10 px-0 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 ${className}`}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-purple-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-purple-500/30 bg-card/95 backdrop-blur-sm w-48"
      >
        {/* Light Theme */}
        <DropdownMenuItem
          onClick={setLightTheme}
          className="hover:bg-yellow-500/10 hover:text-yellow-500 focus:bg-yellow-500/10 focus:text-yellow-500"
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
          {showLabels && <span>Light</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-purple-500/20" />

        {/* Dark Theme */}
        <DropdownMenuItem
          onClick={setDarkTheme}
          className="hover:bg-purple-500/10 hover:text-purple-400 focus:bg-purple-500/10 focus:text-purple-400"
        >
          <Zap className="mr-2 h-4 w-4 text-purple-400" />
          {showLabels && <span>Dracula</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-purple-500/20" />

        {/* System Theme */}
        <DropdownMenuItem
          onClick={setSystemTheme}
          className="hover:bg-cyan-500/10 hover:text-cyan-400 focus:bg-cyan-500/10 focus:text-cyan-400"
        >
          <Monitor className="mr-2 h-4 w-4 text-cyan-400" />
          {showLabels && <span>System</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Legacy exports for backward compatibility
export const DraculaThemeToggleButton = (props: Omit<ThemeToggleProps, 'variant'>) => (
  <ThemeToggle {...props} variant="simple" />
);

export const DraculaModeToggle = (props: Omit<ThemeToggleProps, 'variant'>) => (
  <ThemeToggle {...props} variant="dracula" />
);
