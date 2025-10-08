"use client";

import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { CustomImageContentRenderer } from "../components/ui/utilities/custom-image-content-renderer";

/**
 * Hook to process custom-image tags in content renderer
 * Converts custom-image tags to Next.js Image components
 */
export function useCustomImageRenderer(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!containerRef.current) return;

    // Store roots for cleanup
    const roots = new Map<Element, ReturnType<typeof createRoot>>();

    const processCustomImages = () => {
      const customImageWrappers = containerRef.current?.querySelectorAll(
        ".custom-image-next-wrapper[data-custom-image-src]",
      );

      if (!customImageWrappers) return;

      customImageWrappers.forEach((wrapper) => {
        // Skip if already processed
        if (wrapper.getAttribute("data-processed") === "true") return;

        const src = wrapper.getAttribute("data-custom-image-src");
        const alt = wrapper.getAttribute("data-custom-image-alt") || "";
        const title = wrapper.getAttribute("data-custom-image-title") || "";
        const width = parseInt(
          wrapper.getAttribute("data-custom-image-width") || "800",
        );
        const height = parseInt(
          wrapper.getAttribute("data-custom-image-height") || "600",
        );

        if (!src) return;

        // Create a React root and render the Image component
        const root = createRoot(wrapper);
        roots.set(wrapper, root);

        root.render(
          <CustomImageContentRenderer
            src={src}
            alt={alt}
            title={title}
            width={width}
            height={height}
          />,
        );

        // Mark as processed
        wrapper.setAttribute("data-processed", "true");
      });
    };

    // Process immediately
    processCustomImages();

    // Also process when new content is added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          processCustomImages();
        }
      });
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      // Cleanup all roots - defer to avoid unmounting during render
      queueMicrotask(() => {
        roots.forEach((root) => {
          try {
            root.unmount();
          } catch (error) {
            console.warn("Failed to unmount root:", error);
          }
        });
        roots.clear();
      });
    };
  }, [containerRef]);
}
