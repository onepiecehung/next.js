"use client";

import {
  ThemeSwitcher,
  ThemePreview,
  ThemeTest,
  ThemeToggleDemo,
  ThemeComparison,
  ThemeDifferences,
} from "@/components/ui/theme";
import { useTheme } from "@/components/providers/theme-provider";
import { Card } from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import { Badge } from "@/components/ui/core";
import { Separator } from "@/components/ui/layout";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
} from "lucide-react";

export default function ThemingDemoPage() {
  const { theme, colorScheme } = useTheme();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Theming System Demo</h1>
            <p className="text-muted-foreground">
              Explore all available themes and color schemes
            </p>
          </div>
          <ThemeSwitcher />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Badge variant="outline" className="flex items-center gap-2">
            <Palette className="h-3 w-3" />
            Theme: {theme}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            {colorScheme === "light" && <Sun className="h-3 w-3" />}
            {colorScheme === "dark" && <Moon className="h-3 w-3" />}
            {colorScheme === "system" && <Monitor className="h-3 w-3" />}
            Mode: {colorScheme}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Theme Test Component */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Theme Provider Test</h2>
        <p className="text-muted-foreground">
          Test the theme provider functionality with quick theme switching
        </p>
        <ThemeTest />
      </div>

      <Separator />

      {/* Theme Toggle Demo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Theme Toggle Components</h2>
        <p className="text-muted-foreground">
          Different variants of theme toggle components for various use cases
        </p>
        <ThemeToggleDemo />
      </div>

      <Separator />

      {/* Theme Comparison */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Theme Comparison</h2>
        <p className="text-muted-foreground">
          Compare the subtle differences between themes in light mode
        </p>
        <ThemeComparison />
      </div>

      <Separator />

      {/* Theme Differences */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Theme Color Differences</h2>
        <p className="text-muted-foreground">
          See the actual color values and understand why differences are subtle
          in light mode
        </p>
        <ThemeDifferences />
      </div>

      <Separator />

      {/* Theme Preview Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Available Themes</h2>
        <p className="text-muted-foreground">
          Click on any theme card to preview it instantly
        </p>
        <ThemePreview />
      </div>

      <Separator />

      {/* Component Showcase */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Component Showcase</h2>
        <p className="text-muted-foreground">
          See how different components look with the current theme
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Buttons */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Buttons</h3>
            <div className="space-y-3">
              <Button className="w-full">Primary Button</Button>
              <Button variant="secondary" className="w-full">
                Secondary Button
              </Button>
              <Button variant="outline" className="w-full">
                Outline Button
              </Button>
              <Button variant="ghost" className="w-full">
                Ghost Button
              </Button>
              <Button variant="destructive" className="w-full">
                Destructive Button
              </Button>
            </div>
          </Card>

          {/* Form Elements */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Form Elements</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="demo-input">Input Field</Label>
                <Input id="demo-input" placeholder="Type something..." />
              </div>
              <div>
                <Label htmlFor="demo-textarea">Textarea</Label>
                <textarea
                  id="demo-textarea"
                  className="w-full min-h-[80px] px-3 py-2 border border-input bg-background text-foreground rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Enter your message..."
                />
              </div>
            </div>
          </Card>

          {/* Badges & Alerts */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Badges & Alerts</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-primary/10 text-primary rounded-md">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Success message</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm">Error message</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Warning message</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Info message</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Color Palette */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Color Palette</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary"></div>
                <span className="text-sm">Primary</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-secondary"></div>
                <span className="text-sm">Secondary</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-accent"></div>
                <span className="text-sm">Accent</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-muted"></div>
                <span className="text-sm">Muted</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-destructive"></div>
                <span className="text-sm">Destructive</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-border"></div>
                <span className="text-sm">Border</span>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Typography</h3>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold">Heading 1</h1>
              <h2 className="text-xl font-semibold">Heading 2</h2>
              <h3 className="text-lg font-medium">Heading 3</h3>
              <p className="text-base">
                Regular paragraph text with normal weight.
              </p>
              <p className="text-sm text-muted-foreground">
                Small muted text for descriptions.
              </p>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                Inline code
              </code>
            </div>
          </Card>

          {/* Interactive Elements */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Interactive Elements</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="demo-checkbox" className="rounded" />
                <Label htmlFor="demo-checkbox">Checkbox option</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="demo-radio" name="demo-radio" />
                <Label htmlFor="demo-radio">Radio option</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="range" className="flex-1" />
                <span className="text-sm text-muted-foreground">50%</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="switch" className="rounded-full" />
                <Label>Toggle switch</Label>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Separator />

      {/* CSS Variables Display */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Current CSS Variables</h2>
        <p className="text-muted-foreground">
          Live CSS variable values for the current theme
        </p>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm font-mono">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Background Colors
              </div>
              <div>
                --background:{" "}
                <span className="text-primary">var(--background)</span>
              </div>
              <div>
                --foreground:{" "}
                <span className="text-primary">var(--foreground)</span>
              </div>
              <div>
                --card: <span className="text-primary">var(--card)</span>
              </div>
              <div>
                --popover: <span className="text-primary">var(--popover)</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Primary Colors
              </div>
              <div>
                --primary: <span className="text-primary">var(--primary)</span>
              </div>
              <div>
                --secondary:{" "}
                <span className="text-primary">var(--secondary)</span>
              </div>
              <div>
                --accent: <span className="text-primary">var(--accent)</span>
              </div>
              <div>
                --muted: <span className="text-primary">var(--muted)</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Utility Colors
              </div>
              <div>
                --destructive:{" "}
                <span className="text-primary">var(--destructive)</span>
              </div>
              <div>
                --border: <span className="text-primary">var(--border)</span>
              </div>
              <div>
                --input: <span className="text-primary">var(--input)</span>
              </div>
              <div>
                --ring: <span className="text-primary">var(--ring)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
