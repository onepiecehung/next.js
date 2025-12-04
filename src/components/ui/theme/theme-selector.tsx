"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { useIsMounted } from "@/components/providers/no-ssr";
import { useTheme } from "@/components/providers/theme-provider";
import { ChevronRight, Monitor, Moon, Palette, Sun } from "lucide-react";
import { ThemeColorIndicator } from "./theme-color-indicator";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
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
          sideOffset={8}
          className="border-primary/30 bg-card/95 backdrop-blur-sm w-[calc(100vw-2rem)] sm:w-72 md:w-80 max-w-sm p-0 flex flex-col max-h-[calc(100vh*3/5)] sm:max-h-[80vh]"
        >
          {/* Current Selection Display - Fixed Header */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border shrink-0">
            <div className="text-sm sm:text-base font-medium text-foreground">
              {t(`theme.${currentColorScheme?.value}`, "common")} •{" "}
              {t(`theme.${currentTheme?.value}`, "common")}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              {currentTheme?.description}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
            {/* Color Scheme Section */}
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-muted-foreground sticky top-0 bg-card/95 backdrop-blur-sm z-10">
              {t("theme.colorScheme", "common")}
            </div>
            {colorSchemes.map((scheme) => (
              <DropdownMenuItem
                key={scheme.value}
                onClick={() => setColorScheme(scheme.value)}
                className={`min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 ${
                  colorScheme === scheme.value
                    ? "bg-primary/10 text-primary"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 sm:gap-0">
                    <span className="text-base sm:text-sm">{scheme.icon}</span>
                    <span className="text-sm sm:text-sm font-medium">
                      {t(`theme.${scheme.value}`, "common")}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {scheme.value}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="bg-border my-1" />

            {/* Theme Colors Section */}
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-muted-foreground sticky top-0 bg-card/95 backdrop-blur-sm z-10">
              {t("theme.themeColors", "common")}
            </div>
            {themes.map((themeOption) => (
              <DropdownMenuItem
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={`min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 ${
                  theme === themeOption.value
                    ? "bg-primary/10 text-primary"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2 sm:gap-0">
                    <ThemeColorIndicator
                      theme={themeOption.value}
                      size="md"
                      className="mr-2 shrink-0"
                    />
                    <span className="text-sm sm:text-sm font-medium">
                      {t(`theme.${themeOption.value}`, "common")}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[120px]">
                    {themeOption.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
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
          sideOffset={8}
          className="border-purple-500/30 bg-card/95 backdrop-blur-sm w-[calc(100vw-2rem)] sm:w-64 md:w-72 max-w-sm p-0 flex flex-col max-h-[calc(100vh*3/5)] sm:max-h-[80vh]"
        >
          {/* Scrollable Content Area */}
          <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
            {/* Color Scheme Section */}
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-muted-foreground sticky top-0 bg-card/95 backdrop-blur-sm z-10">
              {t("theme.colorScheme", "common")}
            </div>
            {colorSchemes.map((scheme) => (
              <DropdownMenuItem
                key={scheme.value}
                onClick={() => setColorScheme(scheme.value)}
                className={`min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 ${
                  colorScheme === scheme.value
                    ? "bg-primary/10 text-primary"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-0">
                  <span className="text-base sm:text-sm">{scheme.icon}</span>
                  <span className="text-sm sm:text-sm font-medium">
                    {t(`theme.${scheme.value}`, "common")}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="bg-purple-500/20 my-1" />

            {/* Theme Colors Section */}
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-muted-foreground sticky top-0 bg-card/95 backdrop-blur-sm z-10">
              {t("theme.themeColors", "common")}
            </div>
            {themes.map((themeOption) => (
              <DropdownMenuItem
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={`min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 ${
                  theme === themeOption.value
                    ? "bg-primary/10 text-primary"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2 sm:gap-0">
                    <ThemeColorIndicator
                      theme={themeOption.value}
                      size="md"
                      className="mr-2 shrink-0"
                    />
                    <span className="text-sm sm:text-sm font-medium">
                      {t(`theme.${themeOption.value}`, "common")}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[120px]">
                    {themeOption.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
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
        sideOffset={8}
        className="border-purple-500/30 bg-card/95 backdrop-blur-sm w-[calc(100vw-2rem)] sm:w-56 max-w-sm p-0 flex flex-col max-h-[calc(100vh*3/5)] sm:max-h-[80vh]"
      >
        {/* Scrollable Content Area */}
        <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
          {/* Light Theme with submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-yellow-500/10 hover:text-yellow-500 focus:bg-yellow-500/10 focus:text-yellow-500 active:bg-yellow-500/20">
              <Sun className="mr-2 h-4 w-4 sm:h-4 sm:w-4 text-yellow-500" />
              {showLabels && (
                <span className="text-sm sm:text-sm font-medium">
                  {t("theme.light", "common")}
                </span>
              )}
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              sideOffset={8}
              className="w-[calc(100vw-4rem)] sm:w-48 max-w-xs p-0 flex flex-col max-h-[calc(100vh*3/5)] sm:max-h-[70vh]"
            >
              <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
                {themes.map((themeOption) => (
                  <DropdownMenuItem
                    key={`light-${themeOption.value}`}
                    onClick={() => {
                      setColorScheme("light");
                      setTheme(themeOption.value);
                    }}
                    className="min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20"
                  >
                    <div className="flex items-center gap-2 sm:gap-0">
                      <ThemeColorIndicator
                        theme={themeOption.value}
                        size="md"
                        className="mr-2 shrink-0"
                      />
                      <span className="text-sm sm:text-sm font-medium">
                        {t(`theme.${themeOption.value}`, "common")}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="bg-purple-500/20 my-1" />

          {/* Dark Theme with submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-purple-500/10 hover:text-purple-400 focus:bg-purple-500/10 focus:text-purple-400 active:bg-purple-500/20">
              <Moon className="mr-2 h-4 w-4 sm:h-4 sm:w-4 text-purple-400" />
              {showLabels && (
                <span className="text-sm sm:text-sm font-medium">
                  {t("theme.dark", "common")}
                </span>
              )}
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              sideOffset={8}
              className="w-[calc(100vw-4rem)] sm:w-48 max-w-xs p-0 flex flex-col max-h-[calc(100vh*3/5)] sm:max-h-[70vh]"
            >
              <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
                {themes.map((themeOption) => (
                  <DropdownMenuItem
                    key={`dark-${themeOption.value}`}
                    onClick={() => {
                      setColorScheme("dark");
                      setTheme(themeOption.value);
                    }}
                    className="min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20"
                  >
                    <div className="flex items-center gap-2 sm:gap-0">
                      <ThemeColorIndicator
                        theme={themeOption.value}
                        size="md"
                        className="mr-2 shrink-0"
                      />
                      <span className="text-sm sm:text-sm font-medium">
                        {t(`theme.${themeOption.value}`, "common")}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="bg-purple-500/20 my-1" />

          {/* System Theme with submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-cyan-500/10 hover:text-cyan-400 focus:bg-cyan-500/10 focus:text-cyan-400 active:bg-cyan-500/20">
              <Monitor className="mr-2 h-4 w-4 sm:h-4 sm:w-4 text-cyan-400" />
              {showLabels && (
                <span className="text-sm sm:text-sm font-medium">
                  {t("theme.system", "common")}
                </span>
              )}
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              sideOffset={8}
              className="w-[calc(100vw-4rem)] sm:w-48 max-w-xs p-0 flex flex-col max-h-[calc(100vh*3/5)] sm:max-h-[70vh]"
            >
              <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
                {themes.map((themeOption) => (
                  <DropdownMenuItem
                    key={`system-${themeOption.value}`}
                    onClick={() => {
                      setColorScheme("system");
                      setTheme(themeOption.value);
                    }}
                    className="min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20"
                  >
                    <div className="flex items-center gap-2 sm:gap-0">
                      <ThemeColorIndicator
                        theme={themeOption.value}
                        size="md"
                        className="mr-2 shrink-0"
                      />
                      <span className="text-sm sm:text-sm font-medium">
                        {t(`theme.${themeOption.value}`, "common")}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </div>
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
