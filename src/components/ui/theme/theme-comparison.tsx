"use client";

import { Card } from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { Badge } from "@/components/ui/core";
import { useTheme } from "@/components/providers/theme-provider";

/**
 * Theme Comparison Component
 * Shows the subtle differences between themes in light mode
 */
export function ThemeComparison() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Theme Comparison</h3>
        <p className="text-sm text-muted-foreground">
          Notice the subtle differences between themes in light mode
        </p>
        <Badge variant="outline">Current: {theme}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((themeOption) => (
          <Card
            key={themeOption.value}
            className={`p-4 cursor-pointer transition-all ${
              theme === themeOption.value
                ? "ring-2 ring-primary bg-primary/5"
                : "hover:ring-1 hover:ring-border"
            }`}
            onClick={() => setTheme(themeOption.value)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{themeOption.label}</h4>
                {theme === themeOption.value && (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {themeOption.description}
              </p>

              {/* Color Palette Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary"></div>
                  <span className="text-xs">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-secondary"></div>
                  <span className="text-xs">Secondary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted"></div>
                  <span className="text-xs">Muted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-border"></div>
                  <span className="text-xs">Border</span>
                </div>
              </div>

              {/* Sample Components */}
              <div className="space-y-2">
                <Button size="sm" className="w-full">
                  Sample Button
                </Button>
                <div className="p-2 bg-muted rounded text-xs">
                  Sample text in muted background
                </div>
                <div className="h-1 bg-primary rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium mb-3">
          Why the differences are subtle in light mode:
        </h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            • <strong>Neutral:</strong> Pure grayscale (no color saturation)
          </p>
          <p>
            • <strong>Stone:</strong> Slight warm undertone (brownish)
          </p>
          <p>
            • <strong>Zinc:</strong> Slight cool undertone (bluish)
          </p>
          <p>
            • <strong>Gray:</strong> Balanced with subtle blue tint
          </p>
          <p>
            • <strong>Slate:</strong> More pronounced blue undertone
          </p>
          <p>
            • <strong>Dracula:</strong> Completely different color palette
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          <strong>Tip:</strong> Switch to dark mode to see more dramatic
          differences between themes!
        </p>
      </div>
    </Card>
  );
}
