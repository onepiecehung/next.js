"use client";

import { useEffect, useState } from "react";
import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { sectionVariants } from "@/lib/utils/animations";

interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
  /**
   * Whether the section is currently loading
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
   * Defaults to sectionVariants if not provided
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
 * AnimatedSection Component
 * Wrapper for page sections with automatic animation based on loading state
 * Prevents animation conflicts with Skeletonize component
 * Animation triggers after skeleton disappears
 *
 * @example
 * ```tsx
 * <AnimatedSection loading={isLoading} data={data}>
 *   <div>Content</div>
 * </AnimatedSection>
 * ```
 */
export function AnimatedSection({
  loading = false,
  data,
  variants = sectionVariants,
  scrollTriggered = false,
  viewport = { once: true, margin: "-100px" },
  children,
  className,
  ...props
}: AnimatedSectionProps) {
  const shouldShow = !loading && (data !== undefined ? !!data : true);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Delay animation until skeleton is completely gone
  useEffect(() => {
    if (shouldShow && !loading) {
      // Small delay to ensure skeleton has been removed from DOM
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [shouldShow, loading]);

  const animateState = shouldAnimate ? "visible" : "hidden";

  if (scrollTriggered) {
    return (
      <motion.section
        key={shouldAnimate ? "visible" : "hidden"}
        initial="hidden"
        whileInView={shouldAnimate ? "visible" : "hidden"}
        viewport={viewport}
        variants={variants}
        className={className}
        {...props}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <motion.section
      key={shouldAnimate ? "visible" : "hidden"}
      initial="hidden"
      animate={animateState}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

