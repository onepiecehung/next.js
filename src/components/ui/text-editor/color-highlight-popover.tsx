"use client";

import React, { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "../core/button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Highlighter, Palette } from "lucide-react";

interface ColorHighlightPopoverProps {
  readonly editor: Editor | null;
  readonly hideWhenUnavailable?: boolean;
  readonly onApplied?: (data: { color: string; label: string }) => void;
}

const HIGHLIGHT_COLORS = [
  {
    color: "var(--tt-color-highlight-yellow)",
    label: "Yellow",
    bgColor: "#fef08a",
  },
  {
    color: "var(--tt-color-highlight-green)",
    label: "Green",
    bgColor: "#bbf7d0",
  },
  {
    color: "var(--tt-color-highlight-blue)",
    label: "Blue",
    bgColor: "#bfdbfe",
  },
  {
    color: "var(--tt-color-highlight-purple)",
    label: "Purple",
    bgColor: "#d8b4fe",
  },
  { color: "var(--tt-color-highlight-red)", label: "Red", bgColor: "#fecaca" },
  {
    color: "var(--tt-color-highlight-orange)",
    label: "Orange",
    bgColor: "#fed7aa",
  },
  {
    color: "var(--tt-color-highlight-pink)",
    label: "Pink",
    bgColor: "#fce7f3",
  },
  {
    color: "var(--tt-color-highlight-gray)",
    label: "Gray",
    bgColor: "#e5e7eb",
  },
];

export function ColorHighlightPopover({
  editor,
  hideWhenUnavailable = true,
  onApplied,
}: ColorHighlightPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleHighlight = useCallback(
    (color: string, label: string) => {
      if (!editor) return;

      if (editor.isActive("highlight")) {
        // If already highlighted, remove highlight
        editor.chain().focus().unsetHighlight().run();
      } else {
        // Apply highlight with specific color
        editor.chain().focus().setHighlight({ color }).run();
      }

      onApplied?.({ color, label });
      setIsOpen(false);
    },
    [editor, onApplied],
  );

  const handleRemoveHighlight = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetHighlight().run();
    onApplied?.({ color: "", label: "Remove" });
    setIsOpen(false);
  }, [editor, onApplied]);

  const isHighlightActive = editor?.isActive("highlight");

  if (hideWhenUnavailable && !editor) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${
            isHighlightActive ? "bg-yellow-500/20 text-yellow-600" : ""
          }`}
          title="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
            <Palette className="h-4 w-4" />
            Choose highlight color
          </div>

          <div className="grid grid-cols-4 gap-2">
            {HIGHLIGHT_COLORS.map(({ color, label, bgColor }) => (
              <Button
                key={color}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 border border-border hover:scale-105 transition-transform"
                style={{ backgroundColor: bgColor }}
                onClick={() => handleHighlight(color, label)}
                title={label}
              >
                <div
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: bgColor }}
                />
              </Button>
            ))}
          </div>

          {isHighlightActive && (
            <div className="pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-sm"
                onClick={handleRemoveHighlight}
              >
                Remove highlight
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
