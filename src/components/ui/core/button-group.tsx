"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * ButtonGroup Component
 * Groups buttons together with proper spacing and styling
 */
export function ButtonGroup({
  children,
  className,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center",
        // Add spacing between buttons
        "[&>*:not(:first-child)]:ml-[-1px]",
        // Round corners properly
        "[&>*:first-child]:rounded-r-none",
        "[&>*:last-child]:rounded-l-none",
        "[&>*:not(:first-child):not(:last-child)]:rounded-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
