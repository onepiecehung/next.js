"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Badge } from "@/components/ui/core/badge";
import { ThemeColorIndicator } from "@/components/ui/theme/theme-color-indicator";

export default function ThemeColorsDemoPage() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Theme Colors Demo</h1>
            <p className="text-lg text-muted-foreground">
              See the actual colors of each theme with visual indicators
            </p>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Current: {theme}
            </Badge>
          </div>

          {/* Theme Color Grid */}
          <Card>
            <CardHeader>
              <CardTitle>All Theme Colors</CardTitle>
              <CardDescription>
                Click on any theme to see it in action. Each dot shows the
                actual primary color of that theme.
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
                        {themeOption.category}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Color Comparison</CardTitle>
              <CardDescription>
                Compare different theme colors side by side
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Primary Color Themes */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Primary Color Themes
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {themes
                      .filter((t) => t.category === "primary")
                      .map((themeOption) => (
                        <button
                          key={themeOption.value}
                          className={`p-3 rounded-lg border-2 transition-all cursor-pointer w-full text-left ${
                            theme === themeOption.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setTheme(themeOption.value)}
                          type="button"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <ThemeColorIndicator
                              theme={themeOption.value}
                              size="md"
                            />
                            <span className="font-medium text-sm">
                              {themeOption.label}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {themeOption.description}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Neutral Themes */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Neutral Themes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {themes
                      .filter((t) => t.category === "neutral")
                      .map((themeOption) => (
                        <button
                          key={themeOption.value}
                          className={`p-3 rounded-lg border-2 transition-all cursor-pointer w-full text-left ${
                            theme === themeOption.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setTheme(themeOption.value)}
                          type="button"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <ThemeColorIndicator
                              theme={themeOption.value}
                              size="md"
                            />
                            <span className="font-medium text-sm">
                              {themeOption.label}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {themeOption.description}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Special Themes */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Special Themes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {themes
                      .filter((t) => t.category === "special")
                      .map((themeOption) => (
                        <button
                          key={themeOption.value}
                          className={`p-3 rounded-lg border-2 transition-all cursor-pointer w-full text-left ${
                            theme === themeOption.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setTheme(themeOption.value)}
                          type="button"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <ThemeColorIndicator
                              theme={themeOption.value}
                              size="md"
                            />
                            <span className="font-medium text-sm">
                              {themeOption.label}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {themeOption.description}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Size Variations */}
          <Card>
            <CardHeader>
              <CardTitle>Size Variations</CardTitle>
              <CardDescription>
                Different sizes of theme color indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Small (sm)</h4>
                  <div className="flex items-center gap-2">
                    {themes.slice(0, 6).map((themeOption) => (
                      <div
                        key={themeOption.value}
                        className="flex items-center gap-1"
                      >
                        <ThemeColorIndicator
                          theme={themeOption.value}
                          size="sm"
                        />
                        <span className="text-xs text-muted-foreground">
                          {themeOption.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Medium (md)</h4>
                  <div className="flex items-center gap-2">
                    {themes.slice(0, 6).map((themeOption) => (
                      <div
                        key={themeOption.value}
                        className="flex items-center gap-1"
                      >
                        <ThemeColorIndicator
                          theme={themeOption.value}
                          size="md"
                        />
                        <span className="text-xs text-muted-foreground">
                          {themeOption.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Large (lg)</h4>
                  <div className="flex items-center gap-2">
                    {themes.slice(0, 6).map((themeOption) => (
                      <div
                        key={themeOption.value}
                        className="flex items-center gap-1"
                      >
                        <ThemeColorIndicator
                          theme={themeOption.value}
                          size="lg"
                        />
                        <span className="text-xs text-muted-foreground">
                          {themeOption.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Theme Info */}
          <Card>
            <CardHeader>
              <CardTitle>Current Theme Information</CardTitle>
              <CardDescription>
                Details about the currently selected theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <ThemeColorIndicator theme={theme} size="lg" />
                <div>
                  <div className="font-semibold text-lg">{theme}</div>
                  <div className="text-sm text-muted-foreground">
                    {themes.find((t) => t.value === theme)?.description}
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
