"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Enhanced Theme Provider component that wraps next-themes
 * Provides dark/light mode switching functionality with improved configuration
 * Features:
 * - Theme persistence in localStorage
 * - Smooth transitions
 * - System theme detection
 * - Theme validation
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      enableColorScheme={true}
      storageKey="app-theme"
      themes={["light", "dark", "system"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
