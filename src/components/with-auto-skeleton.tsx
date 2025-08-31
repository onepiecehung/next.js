"use client";

import React from "react";

/**
 * WithAutoSkeleton HOC that recursively replaces common DOM elements
 * with shimmering placeholders when loading is true.
 *
 * This component walks through React children and transforms:
 * - Text/number nodes into shimmering spans
 * - Images into shimmering divs
 * - Buttons into shimmering divs
 * - Recursively processes nested children
 *
 * @param loading - Boolean flag to enable/disable skeleton mode
 * @param children - React nodes to be processed
 */
export function WithAutoSkeleton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  if (!loading) {
    return <>{children}</>;
  }

  /**
   * Recursively process React children and replace them with skeleton placeholders
   */
  const processChildren = (child: React.ReactNode): React.ReactNode => {
    if (typeof child === "string" || typeof child === "number") {
      // Replace text/number nodes with shimmering spans
      return (
        <span className="inline-block h-4 w-[8ch] rounded bg-gray-200 animate-pulse" />
      );
    }

    if (React.isValidElement(child)) {
      const { type, props } = child;

      // Handle images and elements with img role
      if (
        type === "img" ||
        (props &&
          typeof props === "object" &&
          "role" in props &&
          props.role === "img")
      ) {
        return (
          <div className="h-24 w-full rounded bg-gray-200 animate-pulse" />
        );
      }

      // Handle buttons and elements with button role
      if (
        type === "button" ||
        (props &&
          typeof props === "object" &&
          "role" in props &&
          props.role === "button")
      ) {
        return <div className="h-10 w-28 rounded bg-gray-200 animate-pulse" />;
      }

      // Recursively process nested children
      if (props && typeof props === "object" && "children" in props) {
        const children = props.children as React.ReactNode;
        if (children !== undefined && children !== null) {
          const processedChildren = React.Children.map(
            children,
            processChildren,
          );
          return React.cloneElement(
            child,
            props as Record<string, unknown>,
            processedChildren,
          );
        }
      }
    }

    return child;
  };

  // Process all children and return skeletonized version
  const skeletonizedChildren = React.Children.map(children, processChildren);

  return <>{skeletonizedChildren}</>;
}
