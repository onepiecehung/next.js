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
import { ThemeDebug } from "@/components/ui/theme/theme-debug";

export default function ThemeTestPage() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-foreground">Theme Test Page</h1>

        {/* Current Theme Display */}
        <Card>
          <CardHeader>
            <CardTitle>Current Theme: {theme}</CardTitle>
            <CardDescription>
              Testing if CSS variables are working properly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Test all color classes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-background border border-border rounded">
                <div className="text-foreground font-medium">Background</div>
                <div className="text-muted-foreground text-sm">
                  bg-background
                </div>
              </div>

              <div className="p-4 bg-card border border-border rounded">
                <div className="text-card-foreground font-medium">Card</div>
                <div className="text-muted-foreground text-sm">bg-card</div>
              </div>

              <div className="p-4 bg-primary border border-border rounded">
                <div className="text-primary-foreground font-medium">
                  Primary
                </div>
                <div className="text-primary-foreground text-sm">
                  bg-primary
                </div>
              </div>

              <div className="p-4 bg-secondary border border-border rounded">
                <div className="text-secondary-foreground font-medium">
                  Secondary
                </div>
                <div className="text-secondary-foreground text-sm">
                  bg-secondary
                </div>
              </div>

              <div className="p-4 bg-accent border border-border rounded">
                <div className="text-accent-foreground font-medium">Accent</div>
                <div className="text-accent-foreground text-sm">bg-accent</div>
              </div>

              <div className="p-4 bg-muted border border-border rounded">
                <div className="text-muted-foreground font-medium">Muted</div>
                <div className="text-muted-foreground text-sm">bg-muted</div>
              </div>

              <div className="p-4 bg-destructive border border-border rounded">
                <div className="text-destructive-foreground font-medium">
                  Destructive
                </div>
                <div className="text-destructive-foreground text-sm">
                  bg-destructive
                </div>
              </div>

              <div className="p-4 bg-popover border border-border rounded">
                <div className="text-popover-foreground font-medium">
                  Popover
                </div>
                <div className="text-popover-foreground text-sm">
                  bg-popover
                </div>
              </div>
            </div>

            {/* Test buttons */}
            <div className="flex flex-wrap gap-3">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Switcher */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Switcher</CardTitle>
            <CardDescription>
              Click on any theme to test color changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {themes.map((themeOption) => (
                <Button
                  key={themeOption.value}
                  variant={theme === themeOption.value ? "default" : "outline"}
                  onClick={() => setTheme(themeOption.value)}
                  className="justify-start"
                >
                  {themeOption.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CSS Variables Debug */}
        <Card>
          <CardHeader>
            <CardTitle>CSS Variables Debug</CardTitle>
            <CardDescription>
              Check if CSS variables are properly defined
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono">
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
                --secondary:{" "}
                <span className="text-primary">
                  {typeof window !== "undefined"
                    ? getComputedStyle(
                        document.documentElement,
                      ).getPropertyValue("--secondary")
                    : "N/A"}
                </span>
              </div>
              <div>
                --accent:{" "}
                <span className="text-primary">
                  {typeof window !== "undefined"
                    ? getComputedStyle(
                        document.documentElement,
                      ).getPropertyValue("--accent")
                    : "N/A"}
                </span>
              </div>
              <div>
                --muted:{" "}
                <span className="text-primary">
                  {typeof window !== "undefined"
                    ? getComputedStyle(
                        document.documentElement,
                      ).getPropertyValue("--muted")
                    : "N/A"}
                </span>
              </div>
              <div>
                --destructive:{" "}
                <span className="text-primary">
                  {typeof window !== "undefined"
                    ? getComputedStyle(
                        document.documentElement,
                      ).getPropertyValue("--destructive")
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ThemeDebug />
    </div>
  );
}
