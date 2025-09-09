"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import hljs from "highlight.js";
import mermaid from "mermaid";
import "highlight.js/styles/github.css";

interface UseContentRendererOptions {
  /**
   * Whether to enable syntax highlighting for code blocks
   * @default true
   */
  enableSyntaxHighlighting?: boolean;

  /**
   * Whether to enable Mermaid diagram rendering
   * @default true
   */
  enableMermaidDiagrams?: boolean;

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

  // Initialize Mermaid
  useEffect(() => {
    if (enableMermaidDiagrams && !mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        fontFamily: "inherit",
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
        },
        sequence: {
          useMaxWidth: true,
        },
        gantt: {
          useMaxWidth: true,
        },
        pie: {
          useMaxWidth: true,
        },
        journey: {
          useMaxWidth: true,
        },
        gitgraph: {
          useMaxWidth: true,
        },
        mindmap: {
          useMaxWidth: true,
        },
        timeline: {
          useMaxWidth: true,
        },
      });
      setMermaidInitialized(true);
    }
  }, [enableMermaidDiagrams, mermaidInitialized]);

  // Helper function to create Mermaid container
  const createMermaidContainer = (code: string) => {
    const mermaidContainer = document.createElement("div");
    mermaidContainer.className = "mermaid-container";
    mermaidContainer.style.cssText = `
      margin: 1.5rem 0;
      border: 1px solid hsl(var(--border));
      border-radius: 0.5rem;
      background: hsl(var(--background));
      overflow: hidden;
    `;

    // Create header
    const header = document.createElement("div");
    header.className = "mermaid-header";
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: hsl(var(--muted) / 0.5);
      border-bottom: 1px solid hsl(var(--border));
      font-size: 0.75rem;
      font-weight: 500;
      color: hsl(var(--muted-foreground));
    `;
    header.textContent = "Mermaid Diagram";

    // Create content area
    const content = document.createElement("div");
    content.className = "mermaid-content";
    content.style.cssText = `
      position: relative;
      min-height: 100px;
      padding: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: hsl(var(--background));
    `;

    mermaidContainer.appendChild(header);
    mermaidContainer.appendChild(content);

    return { mermaidContainer, content };
  };

  // Helper function to render Mermaid diagram
  const renderMermaidDiagram = async (code: string, content: HTMLElement) => {
    const id = `mermaid-content-${Math.random().toString(36).substring(2, 11)}`;

    try {
      const { svg } = await mermaid.render(id, code);
      content.innerHTML = svg;
    } catch (error) {
      console.error("Mermaid rendering error:", error);
      content.innerHTML = `
        <div style="padding: 1rem; background: hsl(var(--destructive) / 0.1); border: 1px solid hsl(var(--destructive) / 0.2); border-radius: 0.375rem; color: hsl(var(--destructive)); font-size: 0.875rem;">
          <div style="font-weight: 500; margin-bottom: 0.5rem;">Diagram Error:</div>
          <div>${error instanceof Error ? error.message : "Failed to render diagram"}</div>
        </div>
      `;
    }
  };

  // Helper function to handle Mermaid diagrams
  const handleMermaidDiagram = async (element: HTMLElement, parentPre: HTMLElement) => {
    try {
      const code = element.textContent || "";
      if (code.trim()) {
        const { mermaidContainer, content } = createMermaidContainer(code);
        await renderMermaidDiagram(code, content);
        parentPre.parentNode?.replaceChild(mermaidContainer, parentPre);
      }
    } catch (error) {
      console.error("Mermaid processing error:", error);
    }
  };

  // Helper function to handle syntax highlighting
  const handleSyntaxHighlighting = (element: HTMLElement, lang: string | undefined) => {
    if (lang && hljs.getLanguage(lang)) {
      element.innerHTML = hljs.highlight(element.textContent ?? "", {
        language: lang,
      }).value;
    } else {
      element.innerHTML = hljs.highlightAuto(element.textContent ?? "").value;
    }
    element.classList.add("hljs");
  };

  // Function to process code blocks (syntax highlighting and Mermaid diagrams)
  const processCodeBlocks = useCallback(async () => {
    if (!enableSyntaxHighlighting && !enableMermaidDiagrams) return;

    const container =
      containerRef.current || document.querySelector(containerSelector);
    if (!container) return;

    // Process all <pre><code> elements inside the container
    const codeElements = Array.from(container.querySelectorAll("pre code"));
    
    for (const el of codeElements) {
      const element = el as HTMLElement;
      const parentPre = element.parentElement as HTMLElement;

      // Get language from class (e.g., "language-javascript" -> "javascript")
      const cls = element.className || "";
      const langMatch = /language-([\w-]+)/.exec(cls);
      const lang = langMatch?.[1];

      if (lang === "mermaid" && enableMermaidDiagrams && mermaidInitialized) {
        await handleMermaidDiagram(element, parentPre);
      } else if (enableSyntaxHighlighting) {
        handleSyntaxHighlighting(element, lang);
      }
    }
  }, [enableSyntaxHighlighting, enableMermaidDiagrams, mermaidInitialized, containerSelector]);

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
    if (!content || (!enableSyntaxHighlighting && !enableMermaidDiagrams)) return;

    // Use setTimeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      processCodeBlocks();
    }, highlightDelay);

    return () => clearTimeout(timer);
  }, [content, enableSyntaxHighlighting, enableMermaidDiagrams, highlightDelay, processCodeBlocks]);

  return {
    containerRef,
    getContentProps,
    processCodeBlocks,
  };
}
