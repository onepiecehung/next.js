/**
 * Theme UI Components Index
 * Exports all theme-related UI components including theme toggles
 * All theme toggles are now unified in a single component with variants
 */

export {
  ThemeToggle,
  DraculaThemeToggleButton,
  DraculaModeToggle,
  FullThemeToggle,
  SimpleThemeToggle,
} from "./theme-toggle";

export {
  ThemeSelector,
  CompactThemeSelector,
  FullThemeSelector,
} from "./theme-selector";

export { ThemeColorIndicator } from "./theme-color-indicator";

export { ThemeSwitcher, ThemePreview } from "./theme-switcher";
export { ThemeTest } from "./theme-test";
export { ThemeToggleDemo } from "./theme-toggle-demo";
export { ThemeComparison } from "./theme-comparison";
export { ThemeDifferences } from "./theme-differences";
export {
  useTheme,
  useCurrentTheme,
} from "@/components/providers/theme-provider";
export type { Theme, ColorScheme } from "@/components/providers/theme-provider";
