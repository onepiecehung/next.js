import type { Variants } from "framer-motion";

/**
 * Global Animation Variants
 * Reusable animation configurations for consistent animations across the app
 * Based on Animate UI patterns with framer-motion
 */

/**
 * Section animation variants - fade + slide up
 * Use for page sections that should animate when data loads
 * Note: opacity is set to 1 in hidden state to allow skeleton to be visible
 */
export const sectionVariants: Variants = {
  hidden: {
    opacity: 1, // Keep visible for skeleton, only animate y
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      mass: 0.5,
      duration: 0.6,
    },
  },
};

/**
 * Container variants for stagger animations
 * Use for grids/lists where items should animate sequentially
 * Note: opacity is set to 1 in hidden state to allow skeleton to be visible
 */
export const containerVariants: Variants = {
  hidden: {
    opacity: 1, // Keep visible for skeleton
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Item variants for stagger animations
 * Use for individual items in grids/lists
 * Note: opacity is set to 1 in hidden state to allow skeleton to be visible
 */
export const itemVariants: Variants = {
  hidden: {
    opacity: 1, // Keep visible for skeleton, only animate y and scale
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      mass: 0.4,
    },
  },
};

/**
 * Header animation variants - fade + slide down
 * Use for section headers
 */
export const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Slide in from right variants
 * Use for sidebars, drawers, mobile menus
 */
export const slideRightVariants: Variants = {
  hidden: {
    x: "100%",
  },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      mass: 0.5,
    },
  },
  exit: {
    x: "100%",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
      mass: 0.3,
    },
  },
};

/**
 * Fade variants - simple fade in/out
 * Use for overlays, modals, tooltips
 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

/**
 * Scale variants - scale from center
 * Use for popups, cards, buttons
 */
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
};

/**
 * Helper function to determine if animation should be visible
 * Checks if data is loaded and available
 */
export function shouldAnimate<T>(
  loading: boolean,
  data: T | null | undefined,
): boolean {
  return !loading && !!data;
}

/**
 * Helper function for array data
 */
export function shouldAnimateArray<T>(
  loading: boolean,
  data: T[] | null | undefined,
): boolean {
  return !loading && !!data && data.length > 0;
}
