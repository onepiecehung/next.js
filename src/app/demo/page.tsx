import { Suspense } from "react";
import { SkeletonDemo } from "./skeleton-demo";

/**
 * Demo page showcasing the automatic skeleton loading technique
 * This page demonstrates how the same DOM structure can be used
 * for both loading and loaded states without layout shifts
 */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Auto Skeleton Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            This demo shows automatic page-level skeleton loading that preserves
            the existing DOM layout. The same content is used for both loading
            and loaded states, ensuring no reflow jumps.
          </p>
        </div>

        <Suspense
          fallback={<div className="text-center py-8">Loading demo...</div>}
        >
          <SkeletonDemo />
        </Suspense>
      </div>
    </div>
  );
}
