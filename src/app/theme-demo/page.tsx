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
import { useI18n } from "@/components/providers/i18n-provider";

/**
 * Theme Demo Page
 * Demonstrates all variants of the ThemeSelector component
 * Shows how users can select both color scheme and theme colors
 */
export default function ThemeDemoPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Theme Selector Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test the new theme selector with nested dropdowns for color schemes
            and theme colors. Click on any theme selector below to see the
            different variants.
          </p>
        </div>

        {/* Theme Selector Variants */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Default Variant */}
          <Card>
            <CardHeader>
              <CardTitle>Default Variant</CardTitle>
              <CardDescription>
                Nested dropdowns with Light/Dark/System → Theme colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <ThemeSelector />
              </div>
              <p className="text-sm text-muted-foreground">
                Hover over Light/Dark/System to see theme color options
              </p>
            </CardContent>
          </Card>

          {/* Compact Variant */}
          <Card>
            <CardHeader>
              <CardTitle>Compact Variant</CardTitle>
              <CardDescription>
                Single dropdown with both color schemes and theme colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <CompactThemeSelector />
              </div>
              <p className="text-sm text-muted-foreground">
                All options in one dropdown for quick access
              </p>
            </CardContent>
          </Card>

          {/* Full Variant */}
          <Card>
            <CardHeader>
              <CardTitle>Full Variant</CardTitle>
              <CardDescription>
                Complete theme selector with current selection display
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <FullThemeSelector />
              </div>
              <p className="text-sm text-muted-foreground">
                Shows current color scheme and theme selection
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              Different ways to use the ThemeSelector component
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Navigation Bar Example */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Navigation Bar</h3>
              <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                <span className="font-semibold text-lg">My App</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Language
                  </span>
                  <CompactThemeSelector />
                  <span className="text-sm text-muted-foreground">User</span>
                </div>
              </div>
            </div>

            {/* Settings Panel Example */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Settings Panel</h3>
              <div className="p-4 bg-card border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Appearance</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred theme and color scheme
                    </p>
                  </div>
                  <FullThemeSelector />
                </div>
              </div>
            </div>

            {/* Mobile Example */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Mobile Layout</h3>
              <div className="flex items-center justify-between p-3 bg-background border rounded-lg max-w-sm">
                <span className="font-semibold">App</span>
                <div className="flex items-center gap-2">
                  <CompactThemeSelector size="sm" />
                  <span className="text-xs text-muted-foreground">Menu</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              What makes this theme selector special
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  Nested dropdowns for intuitive color scheme + theme selection
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Multiple variants: default, compact, and full</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Internationalization support (EN/VI)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Persistent theme storage in localStorage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>System theme detection and auto-switching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  Accessible with proper ARIA labels and keyboard navigation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Responsive design with mobile-first approach</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
