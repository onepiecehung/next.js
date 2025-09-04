"use client";

import { useEffect, useRef, useCallback } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

interface UseContentRendererOptions {
  /**
   * Whether to enable syntax highlighting for code blocks
   * @default true
   */
  enableSyntaxHighlighting?: boolean;

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
 * Custom hook for rendering HTML content from database with syntax highlighting
 *
 * @param content - HTML content string from database
 * @param options - Configuration options for the renderer
 *
 * @returns Object containing ref and render function
 *
 * @example
 * ```tsx
 * function DisplayContent({ contentFromDB }) {
 *   const { containerRef, renderContent } = useContentRenderer(contentFromDB);
 *
 *   return (
 *     <div ref={containerRef} className="content-container">
 *       {renderContent()}
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
    highlightDelay = 100,
    containerSelector = ".content-container",
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);

  // Function to highlight code blocks
  const highlightCodeBlocks = useCallback(() => {
    if (!enableSyntaxHighlighting) return;

    const container =
      containerRef.current || document.querySelector(containerSelector);
    if (!container) return;

    // Highlight all <pre><code> elements inside the container
    container.querySelectorAll("pre code").forEach((el) => {
      const element = el as HTMLElement;
      
      // Get language from class (e.g., "language-javascript" -> "javascript")
      const cls = element.className || "";
      const languageRegex = /language-([\w-]+)/;
      const languageMatch = languageRegex.exec(cls);
      const lang = languageMatch ? languageMatch[1] : undefined;
      
      if (lang && hljs.getLanguage(lang)) {
        // Use specific language if available
        element.innerHTML = hljs.highlight(element.textContent ?? "", { language: lang }).value;
      } else {
        // Auto-detect language
        element.innerHTML = hljs.highlightAuto(element.textContent ?? "").value;
      }
      
      // Add hljs class for theme styling
      element.classList.add("hljs");
    });
  }, [enableSyntaxHighlighting, containerSelector]);

  // Function to get content HTML attributes
  const getContentProps = () => {
    if (!content) return null;

    return {
      className: "ProseMirror content-renderer",
      dangerouslySetInnerHTML: { __html: content },
    };
  };

  // Effect to highlight code blocks when content changes
  useEffect(() => {
    if (!content || !enableSyntaxHighlighting) return;

    // Use setTimeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      highlightCodeBlocks();
    }, highlightDelay);

    return () => clearTimeout(timer);
  }, [content, enableSyntaxHighlighting, highlightDelay, highlightCodeBlocks]);

  return {
    containerRef,
    getContentProps,
    highlightCodeBlocks,
  };
}
