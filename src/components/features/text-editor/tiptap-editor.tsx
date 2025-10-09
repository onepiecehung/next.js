"use client";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useMemo, useState } from "react";
import "./tiptap-editor.css";

import { NoSSR } from "@/components/providers/no-ssr";
import { Button } from "@/components/ui/core/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { useImageUpload } from "@/hooks/useImageUpload";
import { SyntaxHighlightedContent } from "@/hooks/useSyntaxHighlighting";
import "highlight.js/styles/github.css";
import { createLowlight } from "lowlight";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    CheckSquare,
    ChevronDown,
    Code,
    Edit3,
    Eye,
    FileCode,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    SplitSquareHorizontalIcon as Split,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo,
} from "lucide-react";
import { ColorHighlightPopover } from "./color-highlight-popover";
import { CustomImageNode } from "./custom-image-node";
import { ImageDialog } from "./image-dialog";
import { ImageUploadExtension } from "./image-upload-extension";
import { LinkDialog } from "./link-dialog";

import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";

interface TipTapEditorProps {
  readonly content?: string;
  readonly onChange?: (content: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly editable?: boolean;
}

/**
 * Modern TipTap Rich Text Editor Component
 * Based on Tiptap Simple Editor Template
 * Provides a responsive, feature-rich writing experience
 */
export function TipTapEditor({
  content = "",
  onChange,
  placeholder = "Start writing your story...",
  className = "",
  editable = true,
}: TipTapEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Image upload hook
  const { uploadImages, error: uploadError } = useImageUpload({
    onSuccess: (uploadedMedia) => {
      console.log("Images uploaded successfully:", uploadedMedia);
      setIsUploadingImage(false);
    },
    onError: (error) => {
      console.error("Image upload failed:", error);
      setIsUploadingImage(false);
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        blockquote: {}, // Enable blockquote with default options
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
        link: false, // Disable default link extension to use custom one
        underline: false, // Disable default underline extension to use custom one
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      Underline,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "px-1 rounded",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      CustomImageNode,
      CodeBlockLowlight.configure({
        defaultLanguage: "javascript",
        languageClassPrefix: "language-",
        lowlight: createLowlight({
          javascript,
          typescript,
          css,
          xml,
          json,
          bash,
          python,
          java,
          sql,
        }),
        HTMLAttributes: {
          class: "code-block",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      ImageUploadExtension.configure({
        onUpload: uploadImages,
        onUploadStart: () => setIsUploadingImage(true),
        onUploadEnd: () => setIsUploadingImage(false),
        onUploadError: (error) => {
          console.error("Image upload error:", error);
          setIsUploadingImage(false);
        },
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class: `ProseMirror focus:outline-none min-h-[400px] p-4 ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    immediatelyRender: false,
  });

  // Get HTML content for preview with syntax highlighting
  const previewContent = editor?.getHTML() || "";

  // Only apply syntax highlighting in preview/split modes to avoid performance issues
  // Use useMemo to prevent unnecessary re-processing
  const highlightedPreviewContent = useMemo(() => {
    if (isPreviewMode || isSplitView) {
      return <SyntaxHighlightedContent html={previewContent} />;
    }
    return <div dangerouslySetInnerHTML={{ __html: previewContent }} />;
  }, [previewContent, isPreviewMode, isSplitView]);

  // Memoized handlers
  const addImage = useCallback(() => {
    setIsImageDialogOpen(true);
  }, []);

  const handleAddImage = useCallback(
    (url: string) => {
      if (editor) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "customImage",
            attrs: { src: url },
          })
          .run();
      }
    },
    [editor],
  );

  const addLink = useCallback(() => {
    setIsLinkDialogOpen(true);
  }, []);

  const handleAddLink = useCallback(
    (url: string) => {
      if (editor) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    },
    [editor],
  );

  // Formatting handlers
  const handleBold = useCallback(() => {
    if (editor) editor.chain().focus().toggleBold().run();
  }, [editor]);
  const handleItalic = useCallback(() => {
    if (editor) editor.chain().focus().toggleItalic().run();
  }, [editor]);
  const handleUnderline = useCallback(() => {
    if (editor) editor.chain().focus().toggleUnderline().run();
  }, [editor]);
  const handleStrike = useCallback(() => {
    if (editor) editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const handleCode = useCallback(() => {
    if (editor) editor.chain().focus().toggleCode().run();
  }, [editor]);
  const handleBlockquote = useCallback(() => {
    if (editor) editor.chain().focus().toggleBlockquote().run();
  }, [editor]);
  const handleCodeBlock = useCallback(() => {
    if (editor) editor.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  // Heading handlers
  const handleH1 = useCallback(() => {
    if (editor) editor.chain().focus().toggleHeading({ level: 1 }).run();
  }, [editor]);
  const handleH2 = useCallback(() => {
    if (editor) editor.chain().focus().toggleHeading({ level: 2 }).run();
  }, [editor]);
  const handleH3 = useCallback(() => {
    if (editor) editor.chain().focus().toggleHeading({ level: 3 }).run();
  }, [editor]);
  const handleH4 = useCallback(() => {
    if (editor) editor.chain().focus().toggleHeading({ level: 4 }).run();
  }, [editor]);
  const handleH5 = useCallback(() => {
    if (editor) editor.chain().focus().toggleHeading({ level: 5 }).run();
  }, [editor]);

  // List handlers
  const handleBulletList = useCallback(() => {
    if (editor) editor.chain().focus().toggleBulletList().run();
  }, [editor]);
  const handleOrderedList = useCallback(() => {
    if (editor) editor.chain().focus().toggleOrderedList().run();
  }, [editor]);
  const handleTaskList = useCallback(() => {
    if (editor) editor.chain().focus().toggleTaskList().run();
  }, [editor]);

  // Text alignment handlers
  const handleAlignLeft = useCallback(() => {
    if (editor) editor.chain().focus().setTextAlign("left").run();
  }, [editor]);
  const handleAlignCenter = useCallback(() => {
    if (editor) editor.chain().focus().setTextAlign("center").run();
  }, [editor]);
  const handleAlignRight = useCallback(() => {
    if (editor) editor.chain().focus().setTextAlign("right").run();
  }, [editor]);
  const handleAlignJustify = useCallback(() => {
    if (editor) editor.chain().focus().setTextAlign("justify").run();
  }, [editor]);

  // History handlers
  const handleUndo = useCallback(() => {
    if (editor) editor.chain().focus().undo().run();
  }, [editor]);
  const handleRedo = useCallback(() => {
    if (editor) editor.chain().focus().redo().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  // Get current heading level
  const getCurrentHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    if (editor.isActive("heading", { level: 4 })) return "H4";
    if (editor.isActive("heading", { level: 5 })) return "H5";
    return "Paragraph";
  };

  // Get current alignment
  const getCurrentAlignment = () => {
    if (editor.isActive({ textAlign: "center" })) return "center";
    if (editor.isActive({ textAlign: "right" })) return "right";
    if (editor.isActive({ textAlign: "justify" })) return "justify";
    return "left";
  };

  const getAlignmentIcon = () => {
    const alignment = getCurrentAlignment();
    switch (alignment) {
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
      <div className="border border-border rounded-lg bg-card text-foreground focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
        {/* Toolbar - Sticky below navigation when scrolling */}
        <div className="sticky top-[61px] z-40 flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/90 overflow-x-auto shadow-sm">
          {/* Group 1: History & Undo/Redo */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={!editor.can().undo()}
              className="h-8 w-8 p-0"
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={!editor.can().redo()}
              className="h-8 w-8 p-0"
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          {/* Group 2: Text Formatting */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBold}
              className={`h-8 w-8 p-0 ${
                editor.isActive("bold") ? "bg-primary/10 text-primary" : ""
              }`}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleItalic}
              className={`h-8 w-8 p-0 ${
                editor.isActive("italic") ? "bg-primary/10 text-primary" : ""
              }`}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUnderline}
              className={`h-8 w-8 p-0 ${
                editor.isActive("underline") ? "bg-primary/10 text-primary" : ""
              }`}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStrike}
              className={`h-8 w-8 p-0 ${
                editor.isActive("strike") ? "bg-primary/10 text-primary" : ""
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <ColorHighlightPopover
              editor={editor}
              hideWhenUnavailable={true}
              onApplied={({ color, label }) => {
                console.log(`Applied highlight: ${label} (${color})`);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCode}
              className={`h-8 w-8 p-0 ${
                editor.isActive("code") ? "bg-primary/10 text-primary" : ""
              }`}
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          {/* Group 3: Headings & Structure */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  title="Headings"
                >
                  {getCurrentHeading()}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem
                  onClick={handleH1}
                  className="flex items-center gap-2"
                >
                  <Heading1 className="h-4 w-4" />
                  <span>Heading 1</span>
                  {editor.isActive("heading", { level: 1 }) && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleH2}
                  className="flex items-center gap-2"
                >
                  <Heading2 className="h-4 w-4" />
                  <span>Heading 2</span>
                  {editor.isActive("heading", { level: 2 }) && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleH3}
                  className="flex items-center gap-2"
                >
                  <Heading3 className="h-4 w-4" />
                  <span>Heading 3</span>
                  {editor.isActive("heading", { level: 3 }) && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleH4}
                  className="flex items-center gap-2"
                >
                  <Heading4 className="h-4 w-4" />
                  <span>Heading 4</span>
                  {editor.isActive("heading", { level: 4 }) && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleH5}
                  className="flex items-center gap-2"
                >
                  <Heading5 className="h-4 w-4" />
                  <span>Heading 5</span>
                  {editor.isActive("heading", { level: 5 }) && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Group 4: Lists */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBulletList}
              className={`h-8 w-8 p-0 ${
                editor.isActive("bulletList")
                  ? "bg-primary/10 text-primary"
                  : ""
              }`}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOrderedList}
              className={`h-8 w-8 p-0 ${
                editor.isActive("orderedList")
                  ? "bg-primary/10 text-primary"
                  : ""
              }`}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTaskList}
              className={`h-8 w-8 p-0 ${
                editor.isActive("taskList") ? "bg-primary/10 text-primary" : ""
              }`}
              title="Task List"
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
          </div>

          {/* Group 5: Block Elements */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBlockquote}
              className={`h-8 w-8 p-0 ${
                editor.isActive("blockquote")
                  ? "bg-primary/10 text-primary"
                  : ""
              }`}
              title="Blockquote"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCodeBlock}
              className={`h-8 w-8 p-0 ${
                editor.isActive("codeBlock") ? "bg-primary/10 text-primary" : ""
              }`}
              title="Code Block"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          {/* Group 6: Text Alignment */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Text Alignment"
                >
                  {getAlignmentIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem
                  onClick={handleAlignLeft}
                  className="flex items-center gap-2"
                >
                  <AlignLeft className="h-4 w-4" />
                  <span>Align Left</span>
                  {getCurrentAlignment() === "left" && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleAlignCenter}
                  className="flex items-center gap-2"
                >
                  <AlignCenter className="h-4 w-4" />
                  <span>Align Center</span>
                  {getCurrentAlignment() === "center" && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleAlignRight}
                  className="flex items-center gap-2"
                >
                  <AlignRight className="h-4 w-4" />
                  <span>Align Right</span>
                  {getCurrentAlignment() === "right" && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleAlignJustify}
                  className="flex items-center gap-2"
                >
                  <AlignJustify className="h-4 w-4" />
                  <span>Justify</span>
                  {getCurrentAlignment() === "justify" && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Group 7: Media & Links */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={addLink}
              className={`h-8 w-8 p-0 ${
                editor.isActive("link") ? "bg-primary/10 text-primary" : ""
              }`}
              title="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={addImage}
              className="h-8 w-8 p-0"
              title="Add Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1" />

          {/* Group 8: Upload Status */}
          {isUploadingImage && (
            <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 text-blue-600 rounded-md border border-blue-500/20 flex-shrink-0">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span className="text-xs">Uploading images...</span>
            </div>
          )}

          {uploadError && (
            <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 text-red-600 rounded-md border border-red-500/20 flex-shrink-0">
              <span className="text-xs">Upload failed: {uploadError}</span>
            </div>
          )}

          {/* Group 9: View Modes */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsPreviewMode(!isPreviewMode);
                setIsSplitView(false);
                setIsCodeMode(false);
              }}
              className={`h-8 w-8 p-0 transition-all duration-200 ${
                isPreviewMode
                  ? "bg-green-500/15 text-green-600 border border-green-500/20 shadow-sm"
                  : "hover:bg-green-500/5 hover:text-green-600"
              }`}
              title={
                isPreviewMode
                  ? "Switch to Edit Mode"
                  : "Preview Mode - See how your content will look"
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
                setIsSplitView(!isSplitView);
                setIsPreviewMode(false);
                setIsCodeMode(false);
              }}
              className={`h-8 w-8 p-0 transition-all duration-200 ${
                isSplitView
                  ? "bg-purple-500/15 text-purple-600 border border-purple-500/20 shadow-sm"
                  : "hover:bg-purple-500/5 hover:text-purple-600"
              }`}
              title="Split View - Edit and preview side by side"
            >
              <Split className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCodeMode(!isCodeMode);
                setIsPreviewMode(false);
                setIsSplitView(false);
              }}
              className={`h-8 w-8 p-0 transition-all duration-200 ${
                isCodeMode
                  ? "bg-orange-500/15 text-orange-600 border border-orange-500/20 shadow-sm"
                  : "hover:bg-orange-500/5 hover:text-orange-600"
              }`}
              title="Code View - View raw HTML code"
            >
              <FileCode className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        {(() => {
          if (isSplitView) {
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[400px]">
                {/* Left: Editor */}
                <div className="border-r-0 lg:border-r border-b lg:border-b-0 border-border">
                  <div className="p-2 text-xs text-muted-foreground bg-muted/30 border-b border-border/50">
                    Editor
                  </div>
                  <EditorContent editor={editor} />
                </div>
                {/* Right: Preview */}
                <div className="p-4 overflow-y-auto bg-muted/20">
                  <div className="p-2 text-xs text-muted-foreground bg-muted/30 border-b border-border/50 mb-4">
                    Preview
                  </div>
                  <div className="preview-content">
                    {highlightedPreviewContent}
                  </div>
                </div>
              </div>
            );
          }

          if (isPreviewMode) {
            return (
              <div className="min-h-[400px] overflow-y-auto">
                <div className="p-2 text-xs text-muted-foreground bg-muted/30 border-b border-border/50">
                  Preview Mode
                </div>
                <div className="p-4">
                  <div className="preview-content">
                    {highlightedPreviewContent}
                  </div>
                </div>
              </div>
            );
          }

          if (isCodeMode) {
            return (
              <div className="min-h-[400px]">
                <div className="p-2 text-xs text-muted-foreground bg-muted/30 border-b border-border/50">
                  Code View - Raw HTML
                </div>
                <div className="p-4">
                  <div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
                    <pre className="language-html">
                      <code className="language-html">{editor.getHTML()}</code>
                    </pre>
                  </div>
                </div>
              </div>
            );
          }

          return <EditorContent editor={editor} />;
        })()}
      </div>

      {/* Dialogs */}
      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onAddLink={handleAddLink}
      />

      <ImageDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onAddImage={handleAddImage}
      />
    </NoSSR>
  );
}
