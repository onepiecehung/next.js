"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MermaidRenderer } from "./mermaid-renderer";

/**
 * Mermaid Extension for TipTap Editor
 * Allows rendering of Mermaid diagrams within code blocks
 */
export const MermaidExtension = Node.create({
  name: "mermaid",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      code: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-mermaid]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          return {
            code: element.textContent || "",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-mermaid": true,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidRenderer);
  },
});

/**
 * Custom Mermaid Code Block Extension
 * Extends the default code block to detect and render Mermaid diagrams
 */
export const MermaidCodeBlockExtension = Node.create({
  name: "mermaidCodeBlock",

  group: "block",

  content: "text*",

  marks: "",

  defining: true,

  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: (element) => {
          const { language } = element.dataset;
          return language || null;
        },
        rendered: false,
      },
      code: {
        default: "",
        parseHTML: (element) => {
          return element.textContent || "";
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const codeElement = element.querySelector("code");
          if (!codeElement) return false;

          const languageMatch = /language-(\w+)/.exec(codeElement.className);
          const language = languageMatch?.[1];
          return language === "mermaid" ? { language: "mermaid" } : false;
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { language, code } = node.attrs;

    if (language === "mermaid") {
      return [
        "div",
        mergeAttributes(HTMLAttributes, {
          "data-mermaid": true,
          class: "mermaid-container",
        }),
        code,
      ];
    }

    // Fallback to regular code block
    return [
      "pre",
      HTMLAttributes,
      [
        "code",
        {
          class: `language-${language}`,
        },
        code,
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidRenderer);
  },
});
