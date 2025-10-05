"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * VisuallyHidden component for accessibility
 * Hides content visually while keeping it accessible to screen readers
 * Useful for providing context to screen reader users without visual clutter
 */
interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  readonly as?: keyof React.JSX.IntrinsicElements;
  readonly children: React.ReactNode;
}

export function VisuallyHidden({
  as: Component = "span",
  className,
  children,
  ...props
}: VisuallyHiddenProps) {
  return (
    <Component
      className={cn(
        "absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 clip-[rect(0,0,0,0)]",
        className,
      )}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </Component>
  );
}
