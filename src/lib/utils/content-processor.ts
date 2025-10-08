"use client";

import hljs from "highlight.js";
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
  const codeBlocks = container.querySelectorAll("pre code");
  console.log("Found code blocks:", codeBlocks.length);

  for (const codeBlock of codeBlocks) {
    const pre = codeBlock.parentElement;
    if (!pre) continue;

    console.log("Processing code block:", {
      codeClasses: Array.from(codeBlock.classList),
      preClasses: Array.from(pre.classList),
      preDataLanguage: pre.getAttribute("data-language"),
      textContent: codeBlock.textContent?.substring(0, 50) + "..."
    });

    // Add code-block class for styling
    pre.classList.add("code-block");

    // Check if this code block is already highlighted
    if (pre.classList.contains("hljs")) continue;

    try {
      // Get the language from class or data attribute
      let language = "";
      const classList = Array.from(codeBlock.classList);
      const langClass = classList.find(cls => cls.startsWith("language-"));
      
      if (langClass) {
        language = langClass.replace("language-", "");
      } else if (pre.getAttribute("data-language")) {
        language = pre.getAttribute("data-language") || "";
      } else if (pre.classList.contains("language-")) {
        // Check if the pre element has a language class
        const preClassList = Array.from(pre.classList);
        const preLangClass = preClassList.find(cls => cls.startsWith("language-"));
        if (preLangClass) {
          language = preLangClass.replace("language-", "");
        }
      }

      console.log("Detected language:", language);

      // Highlight the code block
      if (language && hljs.getLanguage(language)) {
        // Use specific language highlighting
        const highlighted = hljs.highlight(codeBlock.textContent || "", { language });
        codeBlock.innerHTML = highlighted.value;
        codeBlock.className = `hljs language-${language}`;
        console.log("Applied specific language highlighting for:", language);
      } else {
        // Auto-detect language
        const highlighted = hljs.highlightAuto(codeBlock.textContent || "");
        codeBlock.innerHTML = highlighted.value;
        codeBlock.className = `hljs language-${highlighted.language || "plaintext"}`;
        console.log("Applied auto-detected language highlighting for:", highlighted.language);
      }

      // Mark as processed
      pre.classList.add("hljs");
    } catch (error) {
      console.error("Failed to highlight code block:", error);
      // Fallback: just add basic styling
      codeBlock.className = "hljs";
    }
  }
}
