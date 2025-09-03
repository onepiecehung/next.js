"use client"

import { Card } from "@/components/ui/core/card"
import { Button } from "@/components/ui/core/button"
import { Badge } from "@/components/ui/core"
import { useTheme } from "@/components/providers/theme-provider"

/**
 * Theme Differences Component
 * Shows the actual color values and differences between themes
 */
export function ThemeDifferences() {
  const { theme, setTheme, themes } = useTheme()

  const themeColors = {
    neutral: {
      primary: "oklch(0.205 0 0)",
      secondary: "oklch(0.97 0 0)",
      muted: "oklch(0.97 0 0)",
      border: "oklch(0.922 0 0)",
      description: "Pure grayscale - no color saturation"
    },
    stone: {
      primary: "oklch(0.216 0.006 56.043)",
      secondary: "oklch(0.97 0.001 106.424)",
      muted: "oklch(0.97 0.001 106.424)",
      border: "oklch(0.923 0.003 48.717)",
      description: "Warm undertone - brownish tint"
    },
    zinc: {
      primary: "oklch(0.21 0.006 285.885)",
      secondary: "oklch(0.967 0.001 286.375)",
      muted: "oklch(0.967 0.001 286.375)",
      border: "oklch(0.92 0.004 286.32)",
      description: "Cool undertone - bluish tint"
    },
    gray: {
      primary: "oklch(0.21 0.034 264.665)",
      secondary: "oklch(0.967 0.003 264.542)",
      muted: "oklch(0.967 0.003 264.542)",
      border: "oklch(0.928 0.006 264.531)",
      description: "Balanced with subtle blue tint"
    },
    slate: {
      primary: "oklch(0.208 0.042 265.755)",
      secondary: "oklch(0.968 0.007 247.896)",
      muted: "oklch(0.968 0.007 247.896)",
      border: "oklch(0.929 0.013 255.508)",
      description: "Pronounced blue undertone"
    },
    dracula: {
      primary: "#bd93f9",
      secondary: "#6272a4",
      muted: "#44475a",
      border: "#6272a4",
      description: "Completely different color palette"
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Theme Color Differences</h3>
        <p className="text-sm text-muted-foreground">
          The actual color values and subtle differences between themes
        </p>
        <Badge variant="outline">Current: {theme}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Theme Details */}
        <div className="space-y-4">
          <h4 className="font-medium">Current Theme: {theme}</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: `var(--primary)` }}
              ></div>
              <div>
                <div className="text-sm font-medium">Primary</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {themeColors[theme as keyof typeof themeColors]?.primary}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: `var(--secondary)` }}
              ></div>
              <div>
                <div className="text-sm font-medium">Secondary</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {themeColors[theme as keyof typeof themeColors]?.secondary}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: `var(--muted)` }}
              ></div>
              <div>
                <div className="text-sm font-medium">Muted</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {themeColors[theme as keyof typeof themeColors]?.muted}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: `var(--border)` }}
              ></div>
              <div>
                <div className="text-sm font-medium">Border</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {themeColors[theme as keyof typeof themeColors]?.border}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              {themeColors[theme as keyof typeof themeColors]?.description}
            </p>
          </div>
        </div>

        {/* Theme Switcher */}
        <div className="space-y-4">
          <h4 className="font-medium">Switch Theme</h4>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((themeOption) => (
              <Button
                key={themeOption.value}
                variant={theme === themeOption.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme(themeOption.value)}
                className="justify-start"
              >
                {themeOption.label}
              </Button>
            ))}
          </div>
          
          <div className="p-3 bg-muted rounded-md">
            <h5 className="text-sm font-medium mb-2">Why differences are subtle:</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Light mode uses very low color saturation</li>
              <li>• Differences are in hue (color temperature)</li>
              <li>• OKLCH format allows precise color control</li>
              <li>• Dracula is the only theme with high saturation</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium mb-3">Color Temperature Comparison</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {themes.map((themeOption) => {
            const colors = themeColors[themeOption.value as keyof typeof themeColors]
            return (
              <div key={themeOption.value} className="space-y-2">
                <h5 className="text-sm font-medium">{themeOption.label}</h5>
                <div className="flex gap-1">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: colors.primary }}
                    title={`Primary: ${colors.primary}`}
                  ></div>
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: colors.secondary }}
                    title={`Secondary: ${colors.secondary}`}
                  ></div>
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: colors.muted }}
                    title={`Muted: ${colors.muted}`}
                  ></div>
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: colors.border }}
                    title={`Border: ${colors.border}`}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {colors.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
