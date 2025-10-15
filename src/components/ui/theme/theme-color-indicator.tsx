"use client";

import { Theme } from "@/components/providers/theme-provider";

interface ThemeColorIndicatorProps {
  readonly theme: Theme;
  readonly size?: "sm" | "md" | "lg";
  readonly className?: string;
}

/**
 * Theme Color Indicator Component
 * Displays the actual primary color of a theme
 */
export function ThemeColorIndicator({
  theme,
  size = "md",
  className = "",
}: ThemeColorIndicatorProps) {
  // Define the actual primary colors for each theme (light mode)
  const themeColors: Record<Theme, string> = {
    // Primary Color Themes
    neutral: "oklch(0.708 0 0)", // Neutral gray
    red: "oklch(0.577 0.245 27.325)", // Red
    rose: "oklch(0.577 0.245 27.325)", // Rose (similar to red)
    orange: "oklch(0.646 0.222 41.116)", // Orange
    green: "oklch(0.6 0.118 184.704)", // Green
    blue: "oklch(0.398 0.07 227.392)", // Blue
    yellow: "oklch(0.828 0.189 84.429)", // Yellow
    violet: "oklch(0.627 0.265 303.9)", // Violet

    // Neutral Themes - these have distinct color variations
    stone: "oklch(0.65 0.05 45)", // Stone - warm brownish gray
    zinc: "oklch(0.72 0.02 240)", // Zinc - cool blue-gray
    gray: "oklch(0.68 0 0)", // Gray - pure neutral gray
    slate: "oklch(0.66 0.03 210)", // Slate - blue-gray

    // Special Themes
    dracula: "oklch(0.627 0.265 303.9)", // Dracula purple
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border border-border/20 ${className}`}
      style={{
        backgroundColor: themeColors[theme] || "var(--primary)",
      }}
      title={`${theme} theme color`}
    />
  );
}
