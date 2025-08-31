"use client";

import { useContentRenderer } from '@/hooks/useContentRenderer';

interface ContentRendererProps {
  /**
   * HTML content string from database
   */
  content: string;
  
  /**
   * CSS class name for the container
   */
  className?: string;
  
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
   * Custom container selector for highlighting
   */
  containerSelector?: string;
}

/**
 * Component for rendering HTML content from database with syntax highlighting
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ContentRenderer content={article.content} />
 * 
 * // With custom options
 * <ContentRenderer 
 *   content={article.content}
 *   className="custom-content"
 *   enableSyntaxHighlighting={true}
 *   highlightDelay={200}
 * />
 * ```
 */
export function ContentRenderer({
  content,
  className = '',
  enableSyntaxHighlighting = true,
  highlightDelay = 100,
  containerSelector
}: ContentRendererProps) {
  const { containerRef, getContentProps } = useContentRenderer(content, {
    enableSyntaxHighlighting,
    highlightDelay,
    containerSelector
  });

  if (!content) {
    return null;
  }

  const contentProps = getContentProps();
  if (!contentProps) return null;

  return (
    <div 
      ref={containerRef}
      className={`content-container ${className}`.trim()}
    >
      <div {...contentProps} />
    </div>
  );
}
