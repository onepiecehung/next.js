"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { cn } from "@/lib/utils";

/**
 * Search bar component with keyboard shortcut support
 */
interface SearchBarProps {
  placeholder?: string;
  showKeyboardShortcut?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder,
  showKeyboardShortcut = true,
  onSearch,
  className,
}: SearchBarProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(false);

  // Detect Mac for keyboard shortcut display
  useEffect(() => {
    // More reliable Mac detection
    const platform = navigator.platform.toUpperCase();
    const userAgent = navigator.userAgent.toUpperCase();
    setIsMac(
      platform.indexOf("MAC") >= 0 ||
        platform.indexOf("IPHONE") >= 0 ||
        platform.indexOf("IPAD") >= 0 ||
        userAgent.indexOf("MAC OS X") >= 0,
    );
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.querySelector(
          'input[type="search"]',
        ) as HTMLInputElement;
        input?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMac]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative w-full max-w-2xl", className)}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
        <Input
          type="search"
          placeholder={placeholder || t("searchPlaceholder", "series")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "w-full pl-10",
            showKeyboardShortcut ? "pr-28 sm:pr-32" : "pr-12",
          )}
        />
        {/* Search Button - Always visible */}
        <Button
          type="submit"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 z-10"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
        {/* Keyboard Shortcut Badge - Only on larger screens */}
        {showKeyboardShortcut && (
          <div className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2 z-10">
            <kbd className="pointer-events-none hidden h-8 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium opacity-100 sm:flex">
              <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>
              <span className="text-xs">K</span>
            </kbd>
          </div>
        )}
      </div>
    </form>
  );
}
