/**
 * Main UI Components Index
 * Central export file for all UI components organized by category
 * 
 * Usage:
 * - Import specific components: import { Button } from "@/components/ui/primitives";
 * - Import all from category: import * as Primitives from "@/components/ui/primitives";
 * - Import everything: import * as UI from "@/components/ui";
 */

// Primitives (Basic building blocks)
export * from "./primitives";

// Layout Components
export * from "./layout";

// Forms
export * from "./forms";

// Icons
export * from "./icons";

// Theme Components
export * from "./theme";

// Dracula Theme Components
export * from "./dracula";

// Re-export commonly used components for convenience
export { Button, buttonVariants } from "./primitives";
export { Avatar, AvatarImage, AvatarFallback } from "./primitives";
export { Input } from "./primitives";
export { Label } from "./primitives";
export { Dialog, DialogContent, DialogTrigger } from "./layout";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./layout";
export { ThemeToggle } from "./theme";
export { XIcon, GitHubIcon, GoogleIcon } from "./icons";