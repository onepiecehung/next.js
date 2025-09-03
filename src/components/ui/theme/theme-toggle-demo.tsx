"use client"

import { Card } from "@/components/ui/core/card"
import { Badge } from "@/components/ui/core"
import { useTheme } from "@/components/providers/theme-provider"
import {
  ThemeToggle,
  FullThemeToggle,
  SimpleThemeToggle,
  DraculaModeToggle,
} from "./theme-toggle"

/**
 * Theme Toggle Demo Component
 * Showcases all available theme toggle variants
 */
export function ThemeToggleDemo() {
  const { theme, colorScheme } = useTheme()

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Theme Toggle Variants</h3>
        <p className="text-sm text-muted-foreground">
          Different variants of theme toggle components
        </p>
        <div className="flex items-center gap-4">
          <Badge variant="outline">Theme: {theme}</Badge>
          <Badge variant="outline">Mode: {colorScheme}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Theme Toggle */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">Full Theme Toggle</h4>
            <p className="text-sm text-muted-foreground">
              Complete theme and color scheme selector
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FullThemeToggle showLabels={true} />
            <span className="text-sm text-muted-foreground">
              Shows all themes and color schemes
            </span>
          </div>
        </div>

        {/* Default Theme Toggle */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">Default Theme Toggle</h4>
            <p className="text-sm text-muted-foreground">
              Legacy dropdown with light/dark/system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle variant="default" showLabels={true} />
            <span className="text-sm text-muted-foreground">
              Classic theme switcher
            </span>
          </div>
        </div>

        {/* Simple Theme Toggle */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">Simple Theme Toggle</h4>
            <p className="text-sm text-muted-foreground">
              Quick light/dark toggle button
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SimpleThemeToggle />
            <span className="text-sm text-muted-foreground">
              One-click theme switching
            </span>
          </div>
        </div>

        {/* Dracula Mode Toggle */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">Dracula Mode Toggle</h4>
            <p className="text-sm text-muted-foreground">
              Special Dracula theme toggle
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DraculaModeToggle />
            <span className="text-sm text-muted-foreground">
              Vampire-themed toggle
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium mb-3">Usage Examples</h4>
        <div className="space-y-2 text-sm">
          <div className="p-3 bg-muted rounded-md">
            <code className="text-primary">
              {`<FullThemeToggle showLabels={true} />`}
            </code>
            <p className="text-muted-foreground mt-1">
              Complete theme selector with labels
            </p>
          </div>
          <div className="p-3 bg-muted rounded-md">
            <code className="text-primary">
              {`<SimpleThemeToggle />`}
            </code>
            <p className="text-muted-foreground mt-1">
              Quick light/dark toggle
            </p>
          </div>
          <div className="p-3 bg-muted rounded-md">
            <code className="text-primary">
              {`<ThemeToggle variant="dracula" />`}
            </code>
            <p className="text-muted-foreground mt-1">
              Dracula-themed toggle
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
