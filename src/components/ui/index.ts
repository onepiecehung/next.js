/**
 * Main UI Components Index
 * Central export file for all UI components organized by category
 *
 * Usage:
 * - Import specific components: import { Button } from "@/components/ui/core";
 * - Import all from category: import * as Core from "@/components/ui/core";
 * - Import everything: import * as UI from "@/components/ui";
 */

// Core UI Components
export * from "./core";

// Layout Components
export * from "./layout";

// Theme Components
export * from "./theme";

// Dracula Theme Components
export * from "./dracula";

// Custom Icons
export * from "./icons";

// Utility Components
export * from "./utilities";

// Navigation Components
export * from "./navigation";

// Text Editor Components - moved to features/text-editor

// Input OTP Component
export * from "./shadcn-io/input-otp";

// Re-export commonly used components for convenience
export {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
  Label,
  buttonVariants,
} from "./core";
export { XIcon } from "./icons";
export {
  Dialog,
  DialogContent,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./layout";
export {
  CompactLanguageSwitcher,
  FullLanguageSwitcher,
  LanguageSwitcher,
  UserDropdown,
} from "./navigation";
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./shadcn-io/input-otp";
export { ThemeSelector, ThemeToggle } from "./theme";
export { ContentRenderer } from "./utilities";
