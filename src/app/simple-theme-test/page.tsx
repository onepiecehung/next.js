"use client";

import { useTheme } from "@/components/providers/theme-provider";

export default function SimpleThemeTestPage() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Simple Theme Test</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === themeOption.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-card-foreground hover:bg-accent"
              }`}
            >
              <div className="font-semibold">{themeOption.label}</div>
              <div className="text-sm opacity-70">
                {themeOption.description}
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Color Test</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary text-primary-foreground rounded">
              <div className="font-semibold">Primary</div>
              <div className="text-sm">bg-primary</div>
            </div>

            <div className="p-4 bg-secondary text-secondary-foreground rounded">
              <div className="font-semibold">Secondary</div>
              <div className="text-sm">bg-secondary</div>
            </div>

            <div className="p-4 bg-accent text-accent-foreground rounded">
              <div className="font-semibold">Accent</div>
              <div className="text-sm">bg-accent</div>
            </div>

            <div className="p-4 bg-muted text-muted-foreground rounded">
              <div className="font-semibold">Muted</div>
              <div className="text-sm">bg-muted</div>
            </div>

            <div className="p-4 bg-destructive text-destructive-foreground rounded">
              <div className="font-semibold">Destructive</div>
              <div className="text-sm">bg-destructive</div>
            </div>

            <div className="p-4 bg-card text-card-foreground border border-border rounded">
              <div className="font-semibold">Card</div>
              <div className="text-sm">bg-card</div>
            </div>

            <div className="p-4 bg-popover text-popover-foreground rounded">
              <div className="font-semibold">Popover</div>
              <div className="text-sm">bg-popover</div>
            </div>

            <div className="p-4 bg-background text-foreground border border-border rounded">
              <div className="font-semibold">Background</div>
              <div className="text-sm">bg-background</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Current Theme Info</h2>
          <div className="p-4 bg-card border border-border rounded">
            <div className="space-y-2 text-sm font-mono">
              <div>
                Current Theme: <span className="text-primary">{theme}</span>
              </div>
              <div>
                Data Theme Attribute:{" "}
                <span className="text-primary">
                  {typeof window !== "undefined"
                    ? document.documentElement.getAttribute("data-theme")
                    : "N/A"}
                </span>
              </div>
              <div>
                Dark Class:{" "}
                <span className="text-primary">
                  {typeof window !== "undefined"
                    ? document.documentElement.classList.contains("dark")
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
