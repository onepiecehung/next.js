"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Theme Provider component that wraps next-themes
 * Provides dark/light mode switching functionality
 */
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
