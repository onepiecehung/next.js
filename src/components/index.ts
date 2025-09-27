/**
 * Main Components Index
 * Central export file for all components organized by category
 * 
 * Usage:
 * - Import UI components: import { Button, Dialog } from "@/components/ui";
 * - Import features: import { LoginForm, SignupForm } from "@/components/features/auth";
 * - Import providers: import { AuthProvider, ThemeProvider } from "@/components/providers";
 * - Import utilities: import { Skeletonize, ContentRenderer } from "@/components/utilities";
 */

// UI Components (Pure, reusable)
export * from "./ui";

// Feature Components (Business-specific)
export * from "./features/auth";
export * from "./features/navigation";
export * from "./features/text-editor";

// Providers (Context and state management)
export * from "./providers";

// Utilities (Helper components)
export * from "./utilities";

// Legacy exports for backward compatibility (deprecated)
// These will be removed in future versions
export { LoginDialog } from "./features/auth";
export { SignupForm } from "./features/auth";