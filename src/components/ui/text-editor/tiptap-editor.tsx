"use client";

import React, { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";

import { Button } from "../core/button";
import { NoSSR } from "../../providers/no-ssr";
import { LinkDialog } from "./link-dialog";
import { ImageDialog } from "./image-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../layout/dropdown-menu";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";

// Custom CodeBlock extension with Prism.js support
const CodeBlockWithPrism = CodeBlock.extend({
  renderHTML({ node, HTMLAttributes }) {
    const language = node.attrs.language || "typescript";
    return [
      "pre",
      { ...HTMLAttributes, class: `language-${language}` },
      ["code", { class: `language-${language}` }, node.textContent],
    ];
  },
});
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
  SplitSquareHorizontalIcon as Split,
  FileCode,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
} from "lucide-react";

interface TipTapEditorProps {
  readonly content?: string;
  readonly onChange?: (content: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

/**
 * TipTap Rich Text Editor Component
 * Provides a Medium-like writing experience with rich text formatting
 */
export function TipTapEditor({
  content = "",
  onChange,
  placeholder = "Start writing your story...",
  className = "",
}: TipTapEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentAlignment, setCurrentAlignment] = useState<
    "left" | "center" | "right" | "justify"
  >("left");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default CodeBlock
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      Underline,
      Highlight.configure({
        multicolor: false, // Single color highlight
        HTMLAttributes: {
          class: "bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          // Use theme token so link color adapts in Dracula mode
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
        allowBase64: true,
        inline: false,
      }),
      CodeBlockWithPrism.configure({
        HTMLAttributes: {
          class:
            "bg-gray-100 dark:bg-gray-800 rounded-md p-4 font-mono text-sm",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        // Enable dark typography inversion for better readability in Dracula mode
        // Remove prose class that might interfere with list styling
        class: `max-w-none focus:outline-none min-h-[400px] p-4 ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }

      // Update current alignment state
      if (editor.isActive({ textAlign: "left" })) {
        setCurrentAlignment("left");
      } else if (editor.isActive({ textAlign: "center" })) {
        setCurrentAlignment("center");
      } else if (editor.isActive({ textAlign: "right" })) {
        setCurrentAlignment("right");
      } else if (editor.isActive({ textAlign: "justify" })) {
        setCurrentAlignment("justify");
      }

      // Highlight code blocks in editor after content update
      setTimeout(() => {
        const codeBlocks = editor.view.dom.querySelectorAll("pre code");
        codeBlocks.forEach((block) => {
          Prism.highlightElement(block);
        });
      }, 0);

      // Also highlight code blocks in preview modes if active
      setTimeout(() => {
        // Preview Mode
        const previewContainer = document.querySelector(".preview-content");
        if (previewContainer) {
          const previewCodeBlocks =
            previewContainer.querySelectorAll("pre code");
          previewCodeBlocks.forEach((block) => {
            Prism.highlightElement(block);
          });
        }

        // Split View Preview
        const splitViewPreview = document.querySelector(
          ".split-view-preview .preview-content",
        );
        if (splitViewPreview) {
          const splitViewCodeBlocks =
            splitViewPreview.querySelectorAll("pre code");
          splitViewCodeBlocks.forEach((block) => {
            Prism.highlightElement(block);
          });
        }
      }, 100);
    },
    // Fix SSR hydration mismatch
    immediatelyRender: false,
  });

  // Memoize all handlers after editor is declared
  const addImage = useCallback(() => {
    setIsImageDialogOpen(true);
  }, []);

  const handleAddImage = useCallback(
    (url: string) => {
      editor?.chain().focus().setImage({ src: url }).run();
    },
    [editor],
  );

  const addLink = useCallback(() => {
    setIsLinkDialogOpen(true);
  }, []);

  const handleAddLink = useCallback(
    (url: string) => {
      editor?.chain().focus().setLink({ href: url }).run();
    },
    [editor],
  );

  const handleBold = useCallback(
    () => editor?.chain().focus().toggleBold().run(),
    [editor],
  );
  const handleItalic = useCallback(
    () => editor?.chain().focus().toggleItalic().run(),
    [editor],
  );
  const handleUnderline = useCallback(
    () => editor?.chain().focus().toggleUnderline().run(),
    [editor],
  );
  const handleStrike = useCallback(
    () => editor?.chain().focus().toggleStrike().run(),
    [editor],
  );
  const handleHighlight = useCallback(
    () => editor?.chain().focus().toggleMark("highlight").run(),
    [editor],
  );
  const handleH1 = useCallback(
    () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    [editor],
  );
  const handleH2 = useCallback(
    () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    [editor],
  );
  const handleBulletList = useCallback(() => {
    console.log("Bullet list clicked");
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);
  const handleOrderedList = useCallback(() => {
    console.log("Ordered list clicked");
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);
  const handleBlockquote = useCallback(
    () => editor?.chain().focus().toggleBlockquote().run(),
    [editor],
  );
  const handleCodeBlock = useCallback(
    () => editor?.chain().focus().toggleCodeBlock().run(),
    [editor],
  );

  // Text alignment handlers
  const handleAlignLeft = useCallback(() => {
    editor?.chain().focus().setTextAlign("left").run();
    setCurrentAlignment("left");
  }, [editor]);
  const handleAlignCenter = useCallback(() => {
    editor?.chain().focus().setTextAlign("center").run();
    setCurrentAlignment("center");
  }, [editor]);
  const handleAlignRight = useCallback(() => {
    editor?.chain().focus().setTextAlign("right").run();
    setCurrentAlignment("right");
  }, [editor]);
  const handleAlignJustify = useCallback(() => {
    editor?.chain().focus().setTextAlign("justify").run();
    setCurrentAlignment("justify");
  }, [editor]);

  if (!editor) {
    return null;
  }

  // Get current alignment icon
  const getAlignmentIcon = () => {
    switch (currentAlignment) {
      case "center":
        return <AlignCenter className="h-4 w-4" />;
      case "right":
        return <AlignRight className="h-4 w-4" />;
      case "justify":
        return <AlignJustify className="h-4 w-4" />;
      default:
        return <AlignLeft className="h-4 w-4" />;
    }
  };

  return (
    <NoSSR>
      {/* Theme-aware container for Dracula mode */}
      <div className="border border-border rounded-md bg-card text-foreground focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-border bg-card/70 dark:bg-card/50 backdrop-blur rounded-t-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBold}
            className={`${
              editor.isActive("bold")
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleItalic}
            className={`${
              editor.isActive("italic")
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnderline}
            className={`${
              editor.isActive("underline")
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleStrike}
            className={`${
              editor.isActive("strike")
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleHighlight}
            className={`${
              editor.isActive("highlight")
                ? "bg-yellow-500/20 text-yellow-600 ring-1 ring-yellow-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleH1}
            className={`${
              editor.isActive("heading", { level: 1 })
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleH2}
            className={`${
              editor.isActive("heading", { level: 2 })
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBulletList}
            className={`${
              editor.isActive("bulletList")
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleOrderedList}
            className={`${
              editor.isActive("orderedList")
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBlockquote}
            className={`${
              editor.isActive("blockquote")
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCodeBlock}
            className={`${
              editor.isActive("codeBlock")
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <Code className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={`${
              editor.isActive("link")
                ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={addImage}
            className="text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          {/* Text Alignment Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`${
                  editor.isActive({ textAlign: currentAlignment })
                    ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
                title="Text Alignment"
              >
                <div className="flex items-center gap-1">
                  {getAlignmentIcon()}
                  <ChevronDown className="h-3 w-3" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={handleAlignLeft}
                className="flex items-center gap-2"
              >
                <AlignLeft className="h-4 w-4" />
                <span>Align Left</span>
                {currentAlignment === "left" && (
                  <span className="ml-auto text-xs text-primary">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleAlignCenter}
                className="flex items-center gap-2"
              >
                <AlignCenter className="h-4 w-4" />
                <span>Align Center</span>
                {currentAlignment === "center" && (
                  <span className="ml-auto text-xs text-primary">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleAlignRight}
                className="flex items-center gap-2"
              >
                <AlignRight className="h-4 w-4" />
                <span>Align Right</span>
                {currentAlignment === "right" && (
                  <span className="ml-auto text-xs text-primary">✓</span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleAlignJustify}
                className="flex items-center gap-2"
              >
                <AlignJustify className="h-4 w-4" />
                <span>Justify</span>
                {currentAlignment === "justify" && (
                  <span className="ml-auto text-xs text-primary">✓</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isPreviewMode) {
                setIsPreviewMode(false);
              } else {
                setIsPreviewMode(true);
                setIsSplitView(false); // Tắt Split View khi vào Preview Mode
                setIsCodeMode(false); // Tắt Code Mode khi vào Preview Mode

                // Highlight code blocks in preview mode after state update
                setTimeout(() => {
                  const previewContainer =
                    document.querySelector(".preview-content");
                  if (previewContainer) {
                    const codeBlocks =
                      previewContainer.querySelectorAll("pre code");
                    codeBlocks.forEach((block) => {
                      Prism.highlightElement(block);
                    });
                  }
                }, 100);
              }
            }}
            className={`${
              isPreviewMode
                ? "bg-green-500/10 text-green-600 ring-1 ring-green-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
            title={
              isPreviewMode ? "Switch to Edit Mode" : "Switch to Preview Mode"
            }
          >
            {isPreviewMode ? (
              <Edit3 className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isSplitView) {
                setIsSplitView(false);
              } else {
                setIsSplitView(true);
                setIsPreviewMode(false); // Tắt Preview Mode khi vào Split View
                setIsCodeMode(false); // Tắt Code Mode khi vào Split View

                // Highlight code blocks in split view preview after state update
                setTimeout(() => {
                  const previewContainer = document.querySelector(
                    ".split-view-preview .preview-content",
                  );
                  if (previewContainer) {
                    const codeBlocks =
                      previewContainer.querySelectorAll("pre code");
                    codeBlocks.forEach((block) => {
                      Prism.highlightElement(block);
                    });
                  }
                }, 100);
              }
            }}
            className={`${
              isSplitView
                ? "bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
            title={isSplitView ? "Exit Split View" : "Enter Split View"}
          >
            <Split className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isCodeMode) {
                setIsCodeMode(false);
              } else {
                setIsCodeMode(true);
                setIsPreviewMode(false); // Tắt Preview Mode khi vào Code Mode
                setIsSplitView(false); // Tắt Split View khi vào Code Mode
              }
            }}
            className={`${
              isCodeMode
                ? "bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            } transition-all duration-150 h-8 w-8 p-0 flex items-center justify-center`}
            title={isCodeMode ? "Switch to Edit Mode" : "View HTML Code"}
          >
            <FileCode className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor Content */}
        {(() => {
          if (isSplitView) {
            return (
              <div className="grid grid-cols-2 gap-0 min-h-[400px]">
                {/* Left: Editor */}
                <div className="split-view-editor pr-4">
                  <EditorContent editor={editor} />
                </div>
                {/* Right: Preview */}
                <div className="split-view-preview pl-4">
                  <div className="max-w-none">
                    <div
                      className="preview-content"
                      dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                    />
                  </div>
                </div>
              </div>
            );
          }

          if (isPreviewMode) {
            return (
              <div className="p-4 min-h-[400px] max-w-none">
                <div
                  className="preview-content"
                  dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                />
              </div>
            );
          }

          if (isCodeMode) {
            return (
              <div className="p-4 min-h-[400px]">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 font-mono text-sm overflow-x-auto">
                  <pre className="language-html">
                    <code className="language-html">{editor.getHTML()}</code>
                  </pre>
                </div>
              </div>
            );
          }

          return <EditorContent editor={editor} />;
        })()}
      </div>

      {/* Link Dialog */}
      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onAddLink={handleAddLink}
      />

      {/* Image Dialog */}
      <ImageDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onAddImage={handleAddImage}
      />
    </NoSSR>
  );
}
