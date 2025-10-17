import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export error utilities
export {
  extractAndTranslateErrorMessage,
  extractErrorMessage,
} from "./utils/error-extractor";
