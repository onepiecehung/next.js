"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { useIsMounted } from "@/components/providers/no-ssr";
import { useFont } from "@/components/providers/font-provider";
import { Type } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

interface FontSelectorProps {
  readonly variant?: "default" | "compact" | "full";
  readonly size?: "default" | "sm" | "lg" | "icon";
  readonly showLabels?: boolean;
  readonly className?: string;
}

/**
 * Font Selector component
 * Provides a dropdown for selecting font family
 * Similar to ThemeSelector but for fonts
 */
export function FontSelector({
  variant = "default",
  size = "sm",
  showLabels = true,
  className = "",
}: FontSelectorProps) {
  const { fontFamily, setFontFamily, fonts, currentFont } = useFont();
  const { t } = useI18n();
  const isMounted = useIsMounted();

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`w-10 px-0 border-primary/30 ${className}`}
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
            <Type className="h-4 w-4" />
            <span className="sr-only">{t("font.selectFont", "common")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="border-primary/30 bg-card/95 backdrop-blur-sm w-[calc(100vw-2rem)] sm:w-64 md:w-72 max-w-sm p-0 flex flex-col max-h-[calc(100vh*3/5)] sm:max-h-[80vh]"
        >
          {/* Current Selection Display - Fixed Header */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border shrink-0">
            <div className="text-sm sm:text-base font-medium text-foreground">
              {currentFont?.label}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              {currentFont?.description}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
            {fonts.map((font) => (
              <DropdownMenuItem
                key={font.value}
                onClick={() => setFontFamily(font.value)}
                className={`min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 ${
                  fontFamily === font.value
                    ? "bg-primary/10 text-primary"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2 sm:gap-0">
                    <span
                      className="text-sm sm:text-sm font-medium"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {t(`font.${font.value}`, "common") || font.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[120px]">
                    {font.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={`px-3 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 ${className}`}
        >
          <Type className="mr-2 h-4 w-4" />
          {showLabels && (
            <span style={{ fontFamily: currentFont?.fontFamily }}>
              {currentFont?.label}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="border-primary/30 bg-card/95 backdrop-blur-sm w-[calc(100vw-2rem)] sm:w-64 md:w-72 max-w-sm p-0 flex flex-col max-h-[calc(100vh*3/5)] sm:max-h-[80vh]"
      >
        {/* Current Selection Display - Fixed Header */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border shrink-0">
          <div className="text-sm sm:text-base font-medium text-foreground">
            {currentFont?.label}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mt-1">
            {currentFont?.description}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
          {fonts.map((font) => (
            <DropdownMenuItem
              key={font.value}
              onClick={() => setFontFamily(font.value)}
              className={`min-h-[44px] sm:min-h-0 py-2.5 sm:py-1.5 px-3 sm:px-2 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary active:bg-primary/20 ${
                fontFamily === font.value
                  ? "bg-primary/10 text-primary"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 sm:gap-0">
                  <span
                    className="text-sm sm:text-sm font-medium"
                    style={{ fontFamily: font.fontFamily }}
                  >
                    {t(`font.${font.value}`, "common") || font.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[120px]">
                  {font.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

