"use client";

import { Button } from "./core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./layout/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

/**
 * Simple Language Switcher Component
 * Allows users to switch between supported languages
 * Changes locale without changing URL
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const getCurrentLanguageName = () => {
    switch (locale) {
      case "en":
        return "English";
      case "vi":
        return "Tiếng Việt";
      default:
        return "English";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{getCurrentLanguageName()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-purple-500/30 bg-card/95 backdrop-blur-sm w-48"
      >
        <DropdownMenuItem
          onClick={() => setLocale("en")}
          className="flex items-center justify-between hover:bg-purple-500/10 hover:text-purple-400 focus:bg-purple-500/10 focus:text-purple-400"
        >
          <span>English</span>
          {locale === "en" && <Check className="h-4 w-4 text-purple-400" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("vi")}
          className="flex items-center justify-between hover:bg-purple-500/10 hover:text-purple-400 focus:bg-purple-500/10 focus:text-purple-400"
        >
          <span>Tiếng Việt</span>
          {locale === "vi" && <Check className="h-4 w-4 text-purple-400" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
