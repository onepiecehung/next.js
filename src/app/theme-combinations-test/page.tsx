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

export default function ThemeCombinationsTestPage() {
  const { theme, setTheme, colorScheme, setColorScheme, themes, colorSchemes } =
    useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Theme Combinations Test</h1>
            <p className="text-lg text-muted-foreground">
              Test all combinations of theme colors and color schemes
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-sm">
                Current: {colorScheme} • {theme}
              </Badge>
            </div>
          </div>

          {/* Color Scheme Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme (Light/Dark/System)</CardTitle>
              <CardDescription>
                Choose between light mode, dark mode, or system preference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {colorSchemes.map((scheme) => (
                  <Button
                    key={scheme.value}
                    variant={
                      colorScheme === scheme.value ? "default" : "outline"
                    }
                    onClick={() => setColorScheme(scheme.value)}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <span className="text-2xl">{scheme.icon}</span>
                    <div className="text-center">
                      <div className="font-semibold">{scheme.label}</div>
                      <div className="text-xs opacity-70">
                        {scheme.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Theme Colors Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Colors</CardTitle>
              <CardDescription>
                Choose your preferred color palette
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {themes.map((themeOption) => (
                  <Button
                    key={themeOption.value}
                    variant={
                      theme === themeOption.value ? "default" : "outline"
                    }
                    onClick={() => setTheme(themeOption.value)}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary" />
                    <div className="text-center">
                      <div className="font-semibold text-sm">
                        {themeOption.label}
                      </div>
                      <div className="text-xs opacity-70">
                        {themeOption.category}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Palette Display */}
          <Card>
            <CardHeader>
              <CardTitle>Color Palette Preview</CardTitle>
              <CardDescription>
                See how your selected theme looks in different contexts
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
                      <div className="text-sm opacity-80">bg-primary</div>
                    </div>
                    <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
                      <div className="font-semibold">Secondary</div>
                      <div className="text-sm opacity-80">bg-secondary</div>
                    </div>
                    <div className="p-4 bg-accent text-accent-foreground rounded-lg">
                      <div className="font-semibold">Accent</div>
                      <div className="text-sm opacity-80">bg-accent</div>
                    </div>
                    <div className="p-4 bg-muted text-muted-foreground rounded-lg">
                      <div className="font-semibold">Muted</div>
                      <div className="text-sm opacity-80">bg-muted</div>
                    </div>
                  </div>
                </div>

                {/* Surface Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Surface Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-background text-foreground border border-border rounded-lg">
                      <div className="font-semibold">Background</div>
                      <div className="text-sm opacity-80">bg-background</div>
                    </div>
                    <div className="p-4 bg-card text-card-foreground border border-border rounded-lg">
                      <div className="font-semibold">Card</div>
                      <div className="text-sm opacity-80">bg-card</div>
                    </div>
                    <div className="p-4 bg-popover text-popover-foreground border border-border rounded-lg">
                      <div className="font-semibold">Popover</div>
                      <div className="text-sm opacity-80">bg-popover</div>
                    </div>
                    <div className="p-4 bg-destructive text-destructive-foreground rounded-lg">
                      <div className="font-semibold">Destructive</div>
                      <div className="text-sm opacity-80">bg-destructive</div>
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

                {/* Form Elements */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Form Elements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="test-input"
                        className="text-sm font-medium"
                      >
                        Input Field
                      </label>
                      <input
                        id="test-input"
                        type="text"
                        placeholder="Enter text here..."
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="test-textarea"
                        className="text-sm font-medium"
                      >
                        Textarea
                      </label>
                      <textarea
                        id="test-textarea"
                        placeholder="Enter text here..."
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debug Information */}
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
              <CardDescription>
                Technical details about current theme state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Current State</h4>
                  <div className="text-sm space-y-1 font-mono">
                    <div>
                      Theme: <span className="text-primary">{theme}</span>
                    </div>
                    <div>
                      Color Scheme:{" "}
                      <span className="text-primary">{colorScheme}</span>
                    </div>
                    <div>
                      Data Theme:{" "}
                      <span className="text-primary">
                        {typeof window !== "undefined"
                          ? document.documentElement.getAttribute("data-theme")
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      Dark Class:{" "}
                      <span className="text-primary">
                        {(() => {
                          if (typeof window === "undefined") return "N/A";
                          return document.documentElement.classList.contains(
                            "dark",
                          )
                            ? "Yes"
                            : "No";
                        })()}
                      </span>
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
                    <div>
                      --foreground:{" "}
                      <span className="text-primary">
                        {typeof window !== "undefined"
                          ? getComputedStyle(
                              document.documentElement,
                            ).getPropertyValue("--foreground")
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
