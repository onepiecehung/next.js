"use client";

import "highlight.js/styles/github.css";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ContentProcessorOptions,
  initializeMermaid,
  processCodeBlocks,
} from "../lib/utils/content-processor";
import { useCustomImageRenderer } from "./useCustomImageRenderer";

interface UseContentRendererOptions extends ContentProcessorOptions {
  /**
   * Delay before highlighting code blocks (in milliseconds)
   * @default 100
   */
  highlightDelay?: number;

  /**
   * CSS selector for the container where content will be rendered
   * @default '.content-container'
   */
  containerSelector?: string;
}

/**
 * Custom hook for rendering HTML content from database with syntax highlighting and Mermaid diagrams
 *
 * @param content - HTML content string from database
 * @param options - Configuration options for the renderer
 *
 * @returns Object containing ref and render function
 *
 * @example
 * ```tsx
 * function DisplayContent({ contentFromDB }) {
 *   const { containerRef, getContentProps } = useContentRenderer(contentFromDB);
 *
 *   return (
 *     <div ref={containerRef} className="content-container">
 *       <div {...getContentProps()} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useContentRenderer(
  content: string,
  options: UseContentRendererOptions = {},
) {
  const {
    enableSyntaxHighlighting = true,
    enableMermaidDiagrams = true,
    highlightDelay = 100,
    containerSelector = ".content-container",
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const [mermaidInitialized, setMermaidInitialized] = useState(false);

  // Use custom image renderer hook
  useCustomImageRenderer(containerRef);

  // Initialize Mermaid
  useEffect(() => {
    if (enableMermaidDiagrams && !mermaidInitialized) {
      initializeMermaid();
      setMermaidInitialized(true);
    }
  }, [enableMermaidDiagrams, mermaidInitialized]);

  // Function to process code blocks (syntax highlighting and Mermaid diagrams)
  const processCodeBlocksInContainer = useCallback(async () => {
    if (!enableSyntaxHighlighting && !enableMermaidDiagrams) return;

    const container =
      containerRef.current || document.querySelector(containerSelector);
    if (!container) return;

    await processCodeBlocks(container, {
      enableSyntaxHighlighting,
      enableMermaidDiagrams,
    });
  }, [enableSyntaxHighlighting, enableMermaidDiagrams, containerSelector]);

  // Function to get content HTML attributes
  const getContentProps = () => {
    if (!content) return null;

    return {
      className: "ProseMirror content-renderer",
      dangerouslySetInnerHTML: { __html: content },
    };
  };

  // Effect to process code blocks when content changes
  useEffect(() => {
    if (!content || (!enableSyntaxHighlighting && !enableMermaidDiagrams))
      return;

    // Use setTimeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      processCodeBlocksInContainer();
    }, highlightDelay);

    return () => clearTimeout(timer);
  }, [
    content,
    enableSyntaxHighlighting,
    enableMermaidDiagrams,
    highlightDelay,
    processCodeBlocksInContainer,
  ]);

  return {
    containerRef,
    getContentProps,
    processCodeBlocks: processCodeBlocksInContainer,
  };
}
