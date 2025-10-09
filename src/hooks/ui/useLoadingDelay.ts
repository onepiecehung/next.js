import { useState, useEffect } from "react";

/**
 * Hook that returns true for the first N milliseconds to avoid flicker
 * on very fast requests. Useful for skeleton loading states.
 *
 * @param delayMs - Duration in milliseconds to show loading state (default: 300ms)
 * @returns Boolean indicating if loading delay is still active
 */
export function useLoadingDelay(delayMs: number = 300): boolean {
  const [isDelaying, setIsDelaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelaying(false);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return isDelaying;
}
