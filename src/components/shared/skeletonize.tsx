"use client";

import React from "react";

/**
 * Skeletonize component that wraps children with skeleton loading styles
 * when loading is true. This component does NOT alter the children structure;
 * it only applies CSS classes to create shimmering placeholders.
 *
 * @param loading - Boolean flag to enable/disable skeleton mode
 * @param children - React nodes to be wrapped
 */
export function Skeletonize({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  // Always wrap in a div, but only add the class when loading
  // This prevents DOM structure changes that can cause re-renders
  return <div className={loading ? "skeletonize" : ""}>{children}</div>;
}
