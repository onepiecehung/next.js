"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { useIsMounted } from "@/components/providers/no-ssr";
import { Check, Globe } from "lucide-react";
import { Button } from "../core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../layout/dropdown-menu";

interface LanguageSwitcherProps {
  readonly variant?: "default" | "compact" | "full";
  readonly size?: "default" | "sm" | "lg" | "icon";
  readonly showLabels?: boolean;
  readonly className?: string;
}

/**
 * Advanced Language Switcher Component
 * Allows users to switch between supported languages
 * Changes locale without changing URL
 * Follows the same pattern as ThemeSelector
 */
export function LanguageSwitcher({
  variant = "default",
  size = "sm",
  showLabels = true,
  className = "",
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const isMounted = useIsMounted();

  // Supported languages configuration
  const languages = [
    {
      value: "en",
      label: "English",
      description: "English language",
    },
    {
      value: "vi",
      label: "Tiếng Việt",
      description: "Vietnamese language",
    },
  ];

  // Get current language info
  const currentLanguage =
    languages.find((lang) => lang.value === locale) || languages[0];

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
            <Globe className="h-4 w-4 text-primary" />
            <span className="sr-only">Select Language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-primary/30 bg-card/95 backdrop-blur-sm min-w-32 sm:min-w-40 max-w-[calc(100vw-2rem)]"
        >
          {/* Current Selection Display */}
          <div className="px-3 py-2 border-b border-border">
            <div className="text-sm font-medium text-foreground">
              {currentLanguage.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentLanguage.description}
            </div>
          </div>

          {/* Language Options */}
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.value}
              onClick={() => setLocale(language.value)}
              className={`hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary ${
                locale === language.value ? "bg-primary/10 text-primary" : ""
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span>{language.label}</span>
                </div>
                {locale === language.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Full variant with labels
  if (variant === "full") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={`px-3 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 ${className}`}
          >
            <Globe className="mr-2 h-4 w-4 text-primary" />
            {showLabels && <span>{currentLanguage.label}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-primary/30 bg-card/95 backdrop-blur-sm min-w-32 sm:min-w-40 max-w-[calc(100vw-2rem)]"
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.value}
              onClick={() => setLocale(language.value)}
              className={`hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary ${
                locale === language.value ? "bg-primary/10 text-primary" : ""
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span>{language.label}</span>
                </div>
                {locale === language.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant (compact with labels on larger screens)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={`flex items-center gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 ${className}`}
        >
          <Globe className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">{currentLanguage.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-primary/30 bg-card/95 backdrop-blur-sm min-w-32"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => setLocale(language.value)}
            className={`hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary ${
              locale === language.value ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span>{language.label}</span>
              </div>
              {locale === language.value && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export variants for easy use
export const CompactLanguageSwitcher = (
  props: Omit<LanguageSwitcherProps, "variant">,
) => <LanguageSwitcher {...props} variant="compact" />;

export const FullLanguageSwitcher = (
  props: Omit<LanguageSwitcherProps, "variant">,
) => <LanguageSwitcher {...props} variant="full" />;
