"use client";

import { useEffect, useRef } from 'react';
import Prism from 'prismjs';

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
  options: UseContentRendererOptions = {}
) {
  const {
    enableSyntaxHighlighting = true,
    highlightDelay = 100,
    containerSelector = '.content-container'
  } = options;
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to highlight code blocks
  const highlightCodeBlocks = () => {
    if (!enableSyntaxHighlighting) return;
    
    const container = containerRef.current || document.querySelector(containerSelector);
    if (!container) return;

    const codeBlocks = container.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      Prism.highlightElement(block);
    });
  };

  // Function to get content HTML attributes
  const getContentProps = () => {
    if (!content) return null;
    
    return {
      className: "prose prose-lg max-w-none",
      dangerouslySetInnerHTML: { __html: content }
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
  }, [content, enableSyntaxHighlighting, highlightDelay]);

  return {
    containerRef,
    getContentProps,
    highlightCodeBlocks
  };
}
