"use client";

import {
  ThemeSelector,
  FullThemeSelector,
  CompactThemeSelector,
} from "@/components/ui/theme";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { useTheme } from "@/components/providers/theme-provider";

/**
 * Theme Colors Demo Page
 * Demonstrates all shadcn/ui color themes with live preview
 * Shows how each color theme affects the UI components
 */
export default function ThemeColorsDemoPage() {
  const { t } = useI18n();
  const { theme, colorScheme, setTheme, themes } = useTheme();

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Shadcn/ui Color Themes Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience all the beautiful color themes from shadcn/ui. Each theme
            provides a unique color palette that affects buttons, cards, text,
            and more.
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">
              Current theme:
            </span>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
              {t(`theme.${theme}`, "common")} •{" "}
              {t(`theme.${colorScheme}`, "common")}
            </span>
          </div>
        </div>

        {/* Theme Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Selector</CardTitle>
            <CardDescription>
              Choose your preferred color scheme and theme color combination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <FullThemeSelector />
              <CompactThemeSelector />
              <ThemeSelector />
            </div>
          </CardContent>
        </Card>

        {/* Color Theme Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {themes.map((themeOption) => (
            <Card
              key={themeOption.value}
              className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                theme === themeOption.value ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setTheme(themeOption.value)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{themeOption.label}</CardTitle>
                  {theme === themeOption.value && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                <CardDescription className="text-sm">
                  {themeOption.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Color Preview */}
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded bg-primary" />
                  <div className="w-4 h-4 rounded bg-secondary" />
                  <div className="w-4 h-4 rounded bg-accent" />
                  <div className="w-4 h-4 rounded bg-muted" />
                </div>

                {/* Sample Button */}
                <Button
                  size="sm"
                  className="w-full"
                  variant={theme === themeOption.value ? "default" : "outline"}
                >
                  {theme === themeOption.value ? "Active" : "Preview"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Preview Components */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              See how the current theme affects different UI components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Buttons */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Cards</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Card</CardTitle>
                    <CardDescription>
                      This is a sample card with the current theme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      The card background, text, and borders all use theme
                      colors.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Another Card</CardTitle>
                    <CardDescription>
                      Demonstrating theme consistency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Action Button
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Theme Info</CardTitle>
                    <CardDescription>Current theme details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Theme:</span>{" "}
                      {t(`theme.${theme}`, "common")}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Mode:</span>{" "}
                      {t(`theme.${colorScheme}`, "common")}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form Elements */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Form Elements</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input Field</label>
                  <input
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md"
                    placeholder="Type something..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select</label>
                  <select className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Status & Indicators</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <span className="text-sm">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-secondary rounded-full" />
                  <span className="text-sm">Secondary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  <span className="text-sm">Accent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded-full" />
                  <span className="text-sm">Muted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded-full" />
                  <span className="text-sm">Destructive</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Information */}
        <Card>
          <CardHeader>
            <CardTitle>About Shadcn/ui Themes</CardTitle>
            <CardDescription>
              Learn more about the theming system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p>
                This demo showcases all the color themes available in shadcn/ui.
                Each theme provides a carefully crafted color palette that
                ensures:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Consistent visual hierarchy</li>
                <li>Proper contrast ratios for accessibility</li>
                <li>Beautiful color combinations</li>
                <li>Support for both light and dark modes</li>
                <li>Seamless integration with TailwindCSS</li>
              </ul>
              <p>
                The themes use CSS custom properties (CSS variables) that
                automatically update when you switch themes, providing instant
                visual feedback.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
