"use client";

import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

/**
 * Component to highlight HTML content with syntax highlighting using highlight.js
 */
export function SyntaxHighlightedContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !html) return;

    // Highlight all <pre><code> elements inside the ref
    ref.current.querySelectorAll("pre code").forEach((el) => {
      const element = el as HTMLElement;

      // Get language from class (e.g., "language-javascript" -> "javascript")
      const cls = element.className || "";
      const lang = cls.match(/language-([\w-]+)/)?.[1] as string | undefined;

      if (lang && hljs.getLanguage(lang)) {
        // Use specific language if available
        element.innerHTML = hljs.highlight(element.textContent ?? "", {
          language: lang,
        }).value;
      } else {
        // Auto-detect language
        element.innerHTML = hljs.highlightAuto(element.textContent ?? "").value;
      }

      // Add hljs class for theme styling
      element.classList.add("hljs");
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Hook to highlight HTML content with syntax highlighting using highlight.js
 * @param htmlContent - Raw HTML content
 * @returns JSX element with highlighted content
 */
export function useSyntaxHighlighting(htmlContent: string): React.ReactElement {
  return <SyntaxHighlightedContent html={htmlContent} />;
}
