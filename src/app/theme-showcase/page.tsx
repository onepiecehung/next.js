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
import { ThemeSelector } from "@/components/ui/theme/theme-selector";

export default function ThemeShowcasePage() {
  const { theme, colorScheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Theme Showcase
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the power of our enhanced theme system with beautiful
              color combinations
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {colorScheme} • {theme}
              </Badge>
            </div>
          </div>

          {/* Theme Selector */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Choose Your Theme</CardTitle>
              <CardDescription className="text-center">
                Select your preferred color scheme and theme colors
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ThemeSelector variant="compact" />
            </CardContent>
          </Card>

          {/* Color Palette Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Primary Colors</CardTitle>
                <CardDescription>Main brand colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>

            {/* Surface Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-secondary">Surface Colors</CardTitle>
                <CardDescription>
                  Background and container colors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  <div className="text-sm opacity-80">Overlay background</div>
                </div>
              </CardContent>
            </Card>

            {/* Utility Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-accent">Utility Colors</CardTitle>
                <CardDescription>Special purpose colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-muted text-muted-foreground rounded-lg">
                  <div className="font-semibold">Muted</div>
                  <div className="text-sm opacity-80">
                    Subtle text/background
                  </div>
                </div>
                <div className="p-4 bg-destructive text-destructive-foreground rounded-lg">
                  <div className="font-semibold">Destructive</div>
                  <div className="text-sm opacity-80">Error/danger color</div>
                </div>
                <div className="p-4 border-2 border-dashed border-border rounded-lg">
                  <div className="font-semibold text-muted-foreground">
                    Border
                  </div>
                  <div className="text-sm text-muted-foreground opacity-80">
                    Border color
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Elements Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Elements</CardTitle>
              <CardDescription>
                See how different UI components look with your selected theme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              {/* Form Elements */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Form Elements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="showcase-input"
                      className="text-sm font-medium"
                    >
                      Input Field
                    </label>
                    <input
                      id="showcase-input"
                      type="text"
                      placeholder="Type something..."
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="showcase-select"
                      className="text-sm font-medium"
                    >
                      Select
                    </label>
                    <select
                      id="showcase-select"
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Information */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Information</CardTitle>
              <CardDescription>
                Current theme configuration and technical details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">
                    Current Configuration
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Theme Color:
                      </span>
                      <span className="font-mono text-primary">{theme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Color Scheme:
                      </span>
                      <span className="font-mono text-primary">
                        {colorScheme}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Theme:</span>
                      <span className="font-mono text-primary">
                        {typeof window !== "undefined"
                          ? document.documentElement.getAttribute("data-theme")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dark Mode:</span>
                      <span className="font-mono text-primary">
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
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">CSS Variables</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">--primary:</span>
                      <span className="text-primary">
                        {typeof window !== "undefined"
                          ? getComputedStyle(
                              document.documentElement,
                            ).getPropertyValue("--primary")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        --background:
                      </span>
                      <span className="text-primary">
                        {typeof window !== "undefined"
                          ? getComputedStyle(
                              document.documentElement,
                            ).getPropertyValue("--background")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        --foreground:
                      </span>
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
