"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Palette, ChevronRight } from "lucide-react";
import { useIsMounted } from "@/components/providers/no-ssr";
import { useTheme } from "@/components/providers/theme-provider";
import { useI18n } from "@/components/providers/i18n-provider";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui";

interface ThemeSelectorProps {
  readonly variant?: "default" | "compact" | "full";
  readonly size?: "default" | "sm" | "lg" | "icon";
  readonly showLabels?: boolean;
  readonly className?: string;
}

/**
 * Advanced Theme Selector component
 * Provides a two-level dropdown for selecting both color scheme and theme color
 * - First level: Light/Dark/System color schemes
 * - Second level: Theme colors (Neutral, Stone, Zinc, Gray, Slate, Dracula)
 */
export function ThemeSelector({
  variant = "default",
  size = "sm",
  showLabels = true,
  className = "",
}: ThemeSelectorProps) {
  const { theme, colorScheme, setTheme, setColorScheme, themes, colorSchemes } =
    useTheme();
  const { t } = useI18n();
  const isMounted = useIsMounted();

  // Helper functions for backward compatibility
  // Note: isDark is not used in this component but kept for potential future use

  // Get current theme and color scheme info
  const currentTheme = themes.find((t) => t.value === theme);
  const currentColorScheme = colorSchemes.find(
    (cs) => cs.value === colorScheme,
  );

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

  // Compact variant (just icon with tooltip)
  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={`w-10 px-0 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 ${className}`}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-purple-400" />
            <span className="sr-only">{t("theme.selectTheme", "common")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-primary/30 bg-card/95 backdrop-blur-sm w-72"
        >
          {/* Current Selection Display */}
          <div className="px-3 py-2 border-b border-border">
            <div className="text-sm font-medium text-foreground">
              {t(`theme.${currentColorScheme?.value}`, "common")} •{" "}
              {t(`theme.${currentTheme?.value}`, "common")}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTheme?.description}
            </div>
          </div>

          {/* Color Scheme Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            {t("theme.colorScheme", "common")}
          </div>
          {colorSchemes.map((scheme) => (
            <DropdownMenuItem
              key={scheme.value}
              onClick={() => setColorScheme(scheme.value)}
              className={`hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary ${
                colorScheme === scheme.value ? "bg-primary/10 text-primary" : ""
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="mr-2">{scheme.icon}</span>
                  <span>{t(`theme.${scheme.value}`, "common")}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {scheme.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className="bg-border" />

          {/* Theme Colors Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            {t("theme.themeColors", "common")}
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
                  <span>{t(`theme.${themeOption.value}`, "common")}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {themeOption.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Full variant with nested submenus
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
            {showLabels && (
              <span>
                {t(`theme.${currentColorScheme?.value}`, "common")} •{" "}
                {t(`theme.${currentTheme?.value}`, "common")}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-purple-500/30 bg-card/95 backdrop-blur-sm w-64"
        >
          {/* Color Scheme Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            {t("theme.colorScheme", "common")}
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
                <span>{t(`theme.${scheme.value}`, "common")}</span>
              </div>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className="bg-purple-500/20" />

          {/* Theme Colors Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            {t("theme.themeColors", "common")}
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
                  <span>{t(`theme.${themeOption.value}`, "common")}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {themeOption.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant with nested submenus for each color scheme
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
          <span className="sr-only">{t("theme.selectTheme", "common")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-purple-500/30 bg-card/95 backdrop-blur-sm w-56"
      >
        {/* Light Theme with submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-yellow-500/10 hover:text-yellow-500 focus:bg-yellow-500/10 focus:text-yellow-500">
            <Sun className="mr-2 h-4 w-4 text-yellow-500" />
            {showLabels && <span>{t("theme.light", "common")}</span>}
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            {themes.map((themeOption) => (
              <DropdownMenuItem
                key={`light-${themeOption.value}`}
                onClick={() => {
                  setColorScheme("light");
                  setTheme(themeOption.value);
                }}
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2" />
                  <span>{t(`theme.${themeOption.value}`, "common")}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-purple-500/20" />

        {/* Dark Theme with submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-purple-500/10 hover:text-purple-400 focus:bg-purple-500/10 focus:text-purple-400">
            <Moon className="mr-2 h-4 w-4 text-purple-400" />
            {showLabels && <span>{t("theme.dark", "common")}</span>}
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            {themes.map((themeOption) => (
              <DropdownMenuItem
                key={`dark-${themeOption.value}`}
                onClick={() => {
                  setColorScheme("dark");
                  setTheme(themeOption.value);
                }}
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2" />
                  <span>{t(`theme.${themeOption.value}`, "common")}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-purple-500/20" />

        {/* System Theme with submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-cyan-500/10 hover:text-cyan-400 focus:bg-cyan-500/10 focus:text-cyan-400">
            <Monitor className="mr-2 h-4 w-4 text-cyan-400" />
            {showLabels && <span>{t("theme.system", "common")}</span>}
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            {themes.map((themeOption) => (
              <DropdownMenuItem
                key={`system-${themeOption.value}`}
                onClick={() => {
                  setColorScheme("system");
                  setTheme(themeOption.value);
                }}
                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2" />
                  <span>{t(`theme.${themeOption.value}`, "common")}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export variants for easy use
export const CompactThemeSelector = (
  props: Omit<ThemeSelectorProps, "variant">,
) => <ThemeSelector {...props} variant="compact" />;

export const FullThemeSelector = (
  props: Omit<ThemeSelectorProps, "variant">,
) => <ThemeSelector {...props} variant="full" />;
