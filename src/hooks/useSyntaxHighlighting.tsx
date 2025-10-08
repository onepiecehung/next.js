"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    initializeMermaid,
    processCodeBlocks,
} from "../lib/utils/content-processor";

/**
 * Component to highlight HTML content with syntax highlighting and Mermaid diagrams
 */
export function SyntaxHighlightedContent({ html }: { readonly html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mermaidInitialized, setMermaidInitialized] = useState(false);

  // Initialize Mermaid
  useEffect(() => {
    if (!mermaidInitialized) {
      initializeMermaid();
      setMermaidInitialized(true);
    }
  }, [mermaidInitialized]);

  // Main effect to process code blocks
  useEffect(() => {
    if (!ref.current || !html || !mermaidInitialized) return;

    processCodeBlocks(ref.current, {
      enableSyntaxHighlighting: true,
      enableMermaidDiagrams: true,
    });
  }, [html, mermaidInitialized]);

  return (
    <div
      ref={ref}
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Hook to highlight HTML content with syntax highlighting and render Mermaid diagrams
 * @param htmlContent - Raw HTML content
 * @returns JSX element with highlighted content and rendered Mermaid diagrams
 */
export function useSyntaxHighlighting(htmlContent: string): React.ReactElement {
  return <SyntaxHighlightedContent html={htmlContent} />;
}
