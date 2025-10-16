"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Badge } from "@/components/ui/core/badge";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { ThemeColorIndicator } from "@/components/ui/theme/theme-color-indicator";

export default function ThemeColorComparisonPage() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Theme Color Comparison</h1>
            <p className="text-lg text-muted-foreground">
              Click on any theme to see the color change. Each theme now has
              distinct colors!
            </p>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Current: {theme}
            </Badge>
          </div>

          {/* All Themes Grid */}
          <Card>
            <CardHeader>
              <CardTitle>All Theme Colors</CardTitle>
              <CardDescription>
                Click on any theme to see the color change. Notice how each
                theme has distinct colors now!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((themeOption) => (
                  <Button
                    key={themeOption.value}
                    variant={
                      theme === themeOption.value ? "default" : "outline"
                    }
                    onClick={() => setTheme(themeOption.value)}
                    className="h-auto p-4 flex items-center gap-3 justify-start"
                  >
                    <ThemeColorIndicator theme={themeOption.value} size="lg" />
                    <div className="text-left">
                      <div className="font-semibold">{themeOption.label}</div>
                      <div className="text-xs opacity-70">
                        {themeOption.description}
                      </div>
                      <div className="text-xs opacity-50 capitalize">
                        {themeOption.value}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Palette Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Current Theme Color Palette</CardTitle>
              <CardDescription>
                See how your selected theme looks across different UI elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Primary Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Primary Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-primary text-primary-foreground rounded-lg">
                      <div className="font-semibold">Primary</div>
                      <div className="text-sm opacity-80">Main brand color</div>
                    </div>
                    <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
                      <div className="font-semibold">Secondary</div>
                      <div className="text-sm opacity-80">Supporting color</div>
                    </div>
                    <div className="p-4 bg-accent text-accent-foreground rounded-lg">
                      <div className="font-semibold">Accent</div>
                      <div className="text-sm opacity-80">Highlight color</div>
                    </div>
                    <div className="p-4 bg-muted text-muted-foreground rounded-lg">
                      <div className="font-semibold">Muted</div>
                      <div className="text-sm opacity-80">Subtle color</div>
                    </div>
                  </div>
                </div>

                {/* Surface Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Surface Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-background text-foreground border border-border rounded-lg">
                      <div className="font-semibold">Background</div>
                      <div className="text-sm opacity-80">Main background</div>
                    </div>
                    <div className="p-4 bg-card text-card-foreground border border-border rounded-lg">
                      <div className="font-semibold">Card</div>
                      <div className="text-sm opacity-80">Card background</div>
                    </div>
                    <div className="p-4 bg-popover text-popover-foreground border border-border rounded-lg">
                      <div className="font-semibold">Popover</div>
                      <div className="text-sm opacity-80">
                        Overlay background
                      </div>
                    </div>
                    <div className="p-4 bg-destructive text-destructive-foreground rounded-lg">
                      <div className="font-semibold">Destructive</div>
                      <div className="text-sm opacity-80">Error color</div>
                    </div>
                  </div>
                </div>

                {/* Interactive Elements */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Interactive Elements
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                    <Button variant="link">Link Button</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Neutral Themes Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Neutral Themes Comparison</CardTitle>
              <CardDescription>
                These themes now have distinct colors - no more gray confusion!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes
                  .filter((t) => t.value === "neutral")
                  .map((themeOption) => (
                    <div
                      key={themeOption.value}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        theme === themeOption.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setTheme(themeOption.value)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <ThemeColorIndicator
                          theme={themeOption.value}
                          size="lg"
                        />
                        <div>
                          <div className="font-semibold">
                            {themeOption.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {themeOption.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Click to see this theme in action
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Debug Info */}
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
              <CardDescription>
                Technical details about the current theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Current Theme</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <ThemeColorIndicator theme={theme} size="sm" />
                      <span className="font-mono">{theme}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {themes.find((t) => t.value === theme)?.description}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">CSS Variables</h4>
                  <div className="text-sm space-y-1 font-mono">
                    <div>
                      --primary:{" "}
                      <span className="text-primary">
                        {typeof window !== "undefined"
                          ? getComputedStyle(
                              document.documentElement,
                            ).getPropertyValue("--primary")
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      --background:{" "}
                      <span className="text-primary">
                        {typeof window !== "undefined"
                          ? getComputedStyle(
                              document.documentElement,
                            ).getPropertyValue("--background")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
