"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { headerVariants, shouldAnimate } from "@/lib/utils/animations";

interface AnimatedHeaderProps extends HTMLMotionProps<"div"> {
  /**
   * Whether the header is currently loading
   * Animation will only play when loading is false
   */
  loading?: boolean;
  /**
   * Data to check for existence
   * Animation will only play when data exists
   */
  data?: unknown;
  /**
   * Custom animation variants
   * Defaults to headerVariants if not provided
   */
  variants?: Variants;
  /**
   * Whether to use scroll-triggered animation (whileInView)
   * Defaults to false (uses animate prop based on loading/data)
   */
  scrollTriggered?: boolean;
  /**
   * Viewport options for scroll-triggered animations
   */
  viewport?: {
    once?: boolean;
    margin?: string;
  };
}

/**
 * AnimatedHeader Component
 * Wrapper for section headers with fade + slide down animation
 * Prevents animation conflicts with Skeletonize component
 *
 * @example
 * ```tsx
 * <AnimatedHeader loading={isLoading} data={data}>
 *   <h2>Section Title</h2>
 * </AnimatedHeader>
 * ```
 */
export function AnimatedHeader({
  loading = false,
  data,
  variants = headerVariants,
  scrollTriggered = false,
  viewport = { once: true },
  children,
  className,
  ...props
}: AnimatedHeaderProps) {
  const shouldShow = shouldAnimate(loading, data);
  const animateState = shouldShow ? "visible" : "hidden";

  if (scrollTriggered) {
    return (
      <motion.div
        initial="hidden"
        whileInView={shouldShow ? "visible" : "hidden"}
        viewport={viewport}
        variants={variants}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate={animateState}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

