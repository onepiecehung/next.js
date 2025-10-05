"use client";

import mermaid from "mermaid";

/**
 * Configuration options for content processing
 */
export interface ContentProcessorOptions {
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
}

/**
 * Initialize Mermaid with default configuration
 */
export function initializeMermaid(): void {
  try {
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
      gitGraph: {
        useMaxWidth: true,
      },
      mindmap: {
        useMaxWidth: true,
      },
      timeline: {
        useMaxWidth: true,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Mermaid:", error);
  }
}

/**
 * Process code blocks in a container for syntax highlighting and Mermaid diagrams
 * @param container - The DOM container to process
 * @param options - Processing options
 */
export async function processCodeBlocks(
  container: Element,
  options: ContentProcessorOptions = {},
): Promise<void> {
  const { enableSyntaxHighlighting = true, enableMermaidDiagrams = true } =
    options;

  try {
    // Process Mermaid diagrams
    if (enableMermaidDiagrams) {
      await processMermaidDiagrams(container);
    }

    // Process syntax highlighting
    if (enableSyntaxHighlighting) {
      await processSyntaxHighlighting(container);
    }
  } catch (error) {
    console.error("Error processing code blocks:", error);
  }
}

/**
 * Process Mermaid diagrams in the container
 * @param container - The DOM container to process
 */
async function processMermaidDiagrams(container: Element): Promise<void> {
  const mermaidElements = container.querySelectorAll("[data-mermaid]");

  for (const element of mermaidElements) {
    try {
      const code = element.textContent || "";
      if (!code.trim()) continue;

      // Generate unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;

      // Render the diagram
      const { svg } = await mermaid.render(id, code);
      element.innerHTML = svg;
    } catch (error) {
      console.error("Failed to render Mermaid diagram:", error);
      element.innerHTML = `<div class="mermaid-error">Failed to render diagram: ${error instanceof Error ? error.message : "Unknown error"}</div>`;
    }
  }
}

/**
 * Process syntax highlighting for code blocks
 * @param container - The DOM container to process
 */
async function processSyntaxHighlighting(container: Element): Promise<void> {
  // This is a placeholder for syntax highlighting
  // In a real implementation, you would use a library like highlight.js
  // or prism.js to highlight code blocks

  const codeBlocks = container.querySelectorAll("pre code");

  for (const codeBlock of codeBlocks) {
    // Add basic styling for code blocks
    const pre = codeBlock.parentElement;
    if (pre) {
      pre.classList.add("code-block");
    }
  }
}
