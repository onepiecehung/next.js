"use client";

import { NodeViewWrapper } from "@tiptap/react";
import DOMPurify from "dompurify";
import mermaid from "mermaid";
import React, { useEffect, useRef, useState } from "react";

interface MermaidRendererProps {
  readonly node: {
    attrs: {
      code: string;
      language?: string;
    };
  };
  readonly updateAttributes: (attrs: Record<string, unknown>) => void;
  readonly selected: boolean;
}

/**
 * Mermaid Diagram Renderer Component
 * Renders Mermaid diagrams using the Mermaid library
 */
export function MermaidRenderer({
  node,
  updateAttributes,
  selected,
}: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCode, setEditCode] = useState(node.attrs.code);

  // Initialize Mermaid
  useEffect(() => {
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
  }, []);

  // Render diagram when code changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !node.attrs.code.trim()) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Clear previous content
        containerRef.current.innerHTML = "";

        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;

        // Render the diagram
        const { svg } = await mermaid.render(id, node.attrs.code);

        if (containerRef.current) {
          // Sanitize SVG content to prevent XSS attacks
          const sanitizedSvg = DOMPurify.sanitize(svg, {
            ADD_TAGS: ['svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'defs', 'clipPath', 'mask', 'pattern', 'marker', 'linearGradient', 'radialGradient', 'stop'],
            ADD_ATTR: ['viewBox', 'width', 'height', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry', 'd', 'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'transform', 'opacity', 'font-family', 'font-size', 'font-weight', 'text-anchor', 'dominant-baseline', 'clip-path', 'mask', 'pattern', 'marker-start', 'marker-end', 'marker-mid', 'gradientUnits', 'gradientTransform', 'stop-color', 'stop-opacity', 'offset'],
          });
          containerRef.current.innerHTML = sanitizedSvg;
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to render diagram",
        );
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [node.attrs.code]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditCode(node.attrs.code);
  };

  const handleSave = () => {
    updateAttributes({ code: editCode });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditCode(node.attrs.code);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <NodeViewWrapper
        className={`mermaid-editor ${selected ? "selected" : ""}`}
        contentEditable={false}
      >
        <div className="mermaid-edit-container">
          <div className="mermaid-edit-header">
            <span className="text-sm font-medium text-muted-foreground">
              Edit Mermaid Diagram
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Save (Ctrl+Enter)
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/90"
              >
                Cancel (Esc)
              </button>
            </div>
          </div>
          <textarea
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-32 p-2 text-sm font-mono border border-border rounded resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter your Mermaid diagram code..."
            autoFocus
          />
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      className={`mermaid-container ${selected ? "selected" : ""}`}
      contentEditable={false}
    >
      <div className="mermaid-wrapper">
        <div className="mermaid-header">
          <span className="text-xs font-medium text-muted-foreground">
            Mermaid Diagram
          </span>
          <button
            onClick={handleEdit}
            className="text-xs text-muted-foreground hover:text-foreground"
            title="Edit diagram"
          >
            Edit
          </button>
        </div>

        <div className="mermaid-content">
          {isLoading && (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2">Rendering diagram...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              <div className="font-medium">Diagram Error:</div>
              <div className="mt-1">{error}</div>
            </div>
          )}

          {!isLoading && !error && (
            <div
              ref={containerRef}
              className="mermaid-diagram"
              style={{ minHeight: "100px" }}
            />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
