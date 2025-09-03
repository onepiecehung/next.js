"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { Button } from "@/components/ui/core/button"
import { Card } from "@/components/ui/core/card"
import { Badge } from "@/components/ui/core"

/**
 * Theme Test Component
 * Displays current theme state and provides quick theme switching
 */
export function ThemeTest() {
  const { theme, colorScheme, setTheme, setColorScheme, themes, colorSchemes } = useTheme()

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Theme Test Component</h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Current Theme:</span>
          <Badge variant="outline">{theme}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Color Scheme:</span>
          <Badge variant="outline">{colorScheme}</Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium mb-2">Quick Theme Switch:</h4>
          <div className="flex flex-wrap gap-2">
            {themes.map((themeOption) => (
              <Button
                key={themeOption.value}
                variant={theme === themeOption.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme(themeOption.value)}
              >
                {themeOption.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Color Scheme:</h4>
          <div className="flex gap-2">
            {colorSchemes.map((scheme) => (
              <Button
                key={scheme.value}
                variant={colorScheme === scheme.value ? "default" : "outline"}
                size="sm"
                onClick={() => setColorScheme(scheme.value)}
              >
                {scheme.icon} {scheme.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">CSS Variables Preview:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="space-y-1">
            <div>--background: <span className="text-primary">var(--background)</span></div>
            <div>--foreground: <span className="text-primary">var(--foreground)</span></div>
            <div>--primary: <span className="text-primary">var(--primary)</span></div>
            <div>--secondary: <span className="text-primary">var(--secondary)</span></div>
          </div>
          <div className="space-y-1">
            <div>--muted: <span className="text-primary">var(--muted)</span></div>
            <div>--accent: <span className="text-primary">var(--accent)</span></div>
            <div>--destructive: <span className="text-primary">var(--destructive)</span></div>
            <div>--border: <span className="text-primary">var(--border)</span></div>
          </div>
        </div>
      </div>
    </Card>
  )
}
