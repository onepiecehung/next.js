"use client";

import { useContentRenderer } from "@/hooks/content";

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

  /**
   * Whether to use TipTap editor styling
   * @default true
   */
  useTipTapStyling?: boolean;

  /**
   * Custom styling variant
   * @default "default"
   */
  variant?: "default" | "compact" | "minimal";
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
  className = "",
  enableSyntaxHighlighting = true,
  highlightDelay = 100,
  containerSelector,
  useTipTapStyling = true,
  variant = "default",
}: Readonly<ContentRendererProps>) {
  const { containerRef, getContentProps } = useContentRenderer(content, {
    enableSyntaxHighlighting,
    highlightDelay,
    containerSelector,
  });

  if (!content) {
    return null;
  }

  const contentProps = getContentProps();
  if (!contentProps) return null;

  // Determine styling classes based on options
  const getVariantClasses = () => {
    switch (variant) {
      case "compact":
        return "text-sm leading-relaxed";
      case "minimal":
        return "text-base leading-normal";
      default:
        return "text-base leading-relaxed";
    }
  };

  const containerClasses = [
    "content-container",
    useTipTapStyling ? "tiptap-content" : "",
    getVariantClasses(),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className={containerClasses}>
      <div {...contentProps} />
    </div>
  );
}
