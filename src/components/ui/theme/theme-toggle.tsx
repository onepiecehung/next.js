"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Zap, Palette } from "lucide-react";
import { useIsMounted } from "@/components/providers/no-ssr";
import { useTheme } from "@/components/providers/theme-provider";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui";

interface ThemeToggleProps {
  readonly variant?: "default" | "dracula" | "simple" | "full";
  readonly size?: "default" | "sm" | "lg" | "icon";
  readonly showLabels?: boolean;
  readonly className?: string;
}

/**
 * Unified Theme Toggle component
 * Supports multiple variants: default, dracula, simple, and full
 * Integrates with the new theme provider system
 * Provides comprehensive theming functionality
 */
export function ThemeToggle({
  variant = "default",
  size = "sm",
  showLabels = true,
  className = "",
}: ThemeToggleProps) {
  const {
    theme,
    colorScheme,
    setTheme,
    setColorScheme,
    themes,
    colorSchemes,
  } = useTheme();
  const isMounted = useIsMounted();

  // Helper functions for backward compatibility
  const isDark = colorScheme === "dark" || (colorScheme === "system" && 
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  const toggleTheme = () => {
    if (isDark) {
      setColorScheme("light");
    } else {
      setColorScheme("dark");
    }
  };

  const setDarkTheme = () => setColorScheme("dark");
  const setLightTheme = () => setColorScheme("light");
  const setSystemTheme = () => setColorScheme("system");

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
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

  // Full variant (complete theme and color scheme selector)
  if (variant === "full") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={`px-3 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 ${className}`}
          >
            <Palette className="mr-2 h-4 w-4" />
            {showLabels && <span>{themes.find(t => t.value === theme)?.label}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-purple-500/30 bg-card/95 backdrop-blur-sm w-64"
        >
          {/* Theme Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Themes
          </div>
          {themes.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary ${
                theme === themeOption.value ? "bg-primary/10 text-primary" : ""
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2" />
                  <span>{themeOption.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {themeOption.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className="bg-purple-500/20" />

          {/* Color Scheme Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Color Scheme
          </div>
          {colorSchemes.map((scheme) => (
            <DropdownMenuItem
              key={scheme.value}
              onClick={() => setColorScheme(scheme.value)}
              className={`hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary ${
                colorScheme === scheme.value ? "bg-primary/10 text-primary" : ""
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">{scheme.icon}</span>
                <span>{scheme.label}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant (legacy dropdown with light/dark/system)
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
export const DraculaThemeToggleButton = (
  props: Omit<ThemeToggleProps, "variant">,
) => <ThemeToggle {...props} variant="simple" />;

export const DraculaModeToggle = (props: Omit<ThemeToggleProps, "variant">) => (
  <ThemeToggle {...props} variant="dracula" />
);

// New comprehensive theme toggle
export const FullThemeToggle = (props: Omit<ThemeToggleProps, "variant">) => (
  <ThemeToggle {...props} variant="full" />
);

// Simple theme toggle for quick switching
export const SimpleThemeToggle = (props: Omit<ThemeToggleProps, "variant">) => (
  <ThemeToggle {...props} variant="simple" />
);
