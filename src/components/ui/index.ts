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
export * from "./input-otp";

// Re-export commonly used components for convenience
export { Button, buttonVariants } from "./core";
export { Avatar, AvatarImage, AvatarFallback } from "./core";
export { Input } from "./core";
export { Label } from "./core";
export { Dialog, DialogContent, DialogTrigger } from "./layout";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./layout";
export { ThemeToggle } from "./theme";
export { XIcon } from "./icons";
export { UserDropdown, LanguageSwitcher } from "./navigation";
export { ContentRenderer } from "./utilities";
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./input-otp";
