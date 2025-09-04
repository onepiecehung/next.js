"use client";

import { Button } from "@/components/ui/core/button";
import { Card } from "@/components/ui/core/card";
import { useTheme } from "@/components/providers/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { Palette } from "lucide-react";

interface ThemeSwitcherProps {
  readonly className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, colorScheme, setTheme, setColorScheme, themes, colorSchemes } =
    useTheme();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Theme Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Palette className="h-4 w-4 mr-2" />
            {themes.find((t) => t.value === theme)?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {themes.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className="flex flex-col items-start gap-1"
            >
              <div className="font-medium">{themeOption.label}</div>
              <div className="text-xs text-muted-foreground">
                {themeOption.description}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Color Scheme Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {colorSchemes.find((cs) => cs.value === colorScheme)?.icon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {colorSchemes.map((scheme) => (
            <DropdownMenuItem
              key={scheme.value}
              onClick={() => setColorScheme(scheme.value)}
              className="flex items-center gap-2"
            >
              {scheme.icon}
              {scheme.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Theme Preview Component
export function ThemePreview() {
  const { setTheme, themes } = useTheme();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {themes.map((themeOption) => (
        <Card
          key={themeOption.value}
          className="p-4 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          onClick={() => setTheme(themeOption.value)}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{themeOption.label}</h3>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <div className="w-3 h-3 rounded-full bg-accent"></div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {themeOption.description}
            </p>
            <div className="space-y-2">
              <div className="h-2 bg-primary rounded"></div>
              <div className="h-2 bg-secondary rounded"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Re-export types and hooks from theme provider
export type { Theme, ColorScheme } from "@/components/providers/theme-provider";
export {
  useTheme,
  useCurrentTheme,
} from "@/components/providers/theme-provider";
