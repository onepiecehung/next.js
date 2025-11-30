"use client";

import { useEffect, useState } from "react";
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
 * Animation triggers after skeleton disappears
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
  const [shouldAnimateState, setShouldAnimateState] = useState(false);

  // Delay animation until skeleton is completely gone
  useEffect(() => {
    if (shouldShow && !loading) {
      // Small delay to ensure skeleton has been removed from DOM
      const timer = setTimeout(() => {
        setShouldAnimateState(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimateState(false);
    }
  }, [shouldShow, loading]);

  const animateState = shouldAnimateState ? "visible" : "hidden";

  if (scrollTriggered) {
    return (
      <motion.div
        key={shouldAnimateState ? "visible" : "hidden"}
        initial="hidden"
        whileInView={shouldAnimateState ? "visible" : "hidden"}
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
      key={shouldAnimateState ? "visible" : "hidden"}
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

