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
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import "./tiptap-editor.css";


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
  Heading3,
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
  Undo,
  Redo,
  CheckSquare,
} from "lucide-react";

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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use our custom code block
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      Underline,
      Highlight.configure({
        multicolor: false,
        HTMLAttributes: {
          class: "bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
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
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto",
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

  // Memoized handlers
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

  // Formatting handlers
  const handleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
  const handleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
  const handleUnderline = useCallback(() => editor?.chain().focus().toggleUnderline().run(), [editor]);
  const handleStrike = useCallback(() => editor?.chain().focus().toggleStrike().run(), [editor]);
  const handleHighlight = useCallback(() => editor?.chain().focus().toggleMark("highlight").run(), [editor]);
  const handleCode = useCallback(() => editor?.chain().focus().toggleCode().run(), [editor]);
  const handleBlockquote = useCallback(() => editor?.chain().focus().toggleBlockquote().run(), [editor]);
  const handleCodeBlock = useCallback(() => editor?.chain().focus().toggleCodeBlock().run(), [editor]);

  // Heading handlers
  const handleH1 = useCallback(() => editor?.chain().focus().toggleHeading({ level: 1 }).run(), [editor]);
  const handleH2 = useCallback(() => editor?.chain().focus().toggleHeading({ level: 2 }).run(), [editor]);
  const handleH3 = useCallback(() => editor?.chain().focus().toggleHeading({ level: 3 }).run(), [editor]);

  // List handlers
  const handleBulletList = useCallback(() => editor?.chain().focus().toggleBulletList().run(), [editor]);
  const handleOrderedList = useCallback(() => editor?.chain().focus().toggleOrderedList().run(), [editor]);
  const handleTaskList = useCallback(() => editor?.chain().focus().toggleTaskList().run(), [editor]);

  // Text alignment handlers
  const handleAlignLeft = useCallback(() => editor?.chain().focus().setTextAlign("left").run(), [editor]);
  const handleAlignCenter = useCallback(() => editor?.chain().focus().setTextAlign("center").run(), [editor]);
  const handleAlignRight = useCallback(() => editor?.chain().focus().setTextAlign("right").run(), [editor]);
  const handleAlignJustify = useCallback(() => editor?.chain().focus().setTextAlign("justify").run(), [editor]);

  // History handlers
  const handleUndo = useCallback(() => editor?.chain().focus().undo().run(), [editor]);
  const handleRedo = useCallback(() => editor?.chain().focus().redo().run(), [editor]);

  if (!editor) {
    return null;
  }

  // Get current heading level
  const getCurrentHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
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
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/50">
          {/* Group 1: History & Undo/Redo */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50">
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
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHighlight}
              className={`h-8 w-8 p-0 ${
                editor.isActive("highlight") ? "bg-yellow-500/20 text-yellow-600" : ""
              }`}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
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
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2" title="Headings">
                  {getCurrentHeading()}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={handleH1} className="flex items-center gap-2">
                  <Heading1 className="h-4 w-4" />
                  <span>Heading 1</span>
                  {editor.isActive("heading", { level: 1 }) && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleH2} className="flex items-center gap-2">
                  <Heading2 className="h-4 w-4" />
                  <span>Heading 2</span>
                  {editor.isActive("heading", { level: 2 }) && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleH3} className="flex items-center gap-2">
                  <Heading3 className="h-4 w-4" />
                  <span>Heading 3</span>
                  {editor.isActive("heading", { level: 3 }) && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Group 4: Lists */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBulletList}
              className={`h-8 w-8 p-0 ${
                editor.isActive("bulletList") ? "bg-primary/10 text-primary" : ""
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
                editor.isActive("orderedList") ? "bg-primary/10 text-primary" : ""
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
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBlockquote}
              className={`h-8 w-8 p-0 ${
                editor.isActive("blockquote") ? "bg-primary/10 text-primary" : ""
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
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Text Alignment">
                  {getAlignmentIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={handleAlignLeft} className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" />
                  <span>Align Left</span>
                  {getCurrentAlignment() === "left" && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAlignCenter} className="flex items-center gap-2">
                  <AlignCenter className="h-4 w-4" />
                  <span>Align Center</span>
                  {getCurrentAlignment() === "center" && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAlignRight} className="flex items-center gap-2">
                  <AlignRight className="h-4 w-4" />
                  <span>Align Right</span>
                  {getCurrentAlignment() === "right" && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAlignJustify} className="flex items-center gap-2">
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
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50">
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

          {/* Group 8: View Modes */}
          <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsPreviewMode(!isPreviewMode);
                setIsSplitView(false);
                setIsCodeMode(false);
              }}
              className={`h-8 w-8 p-0 ${
                isPreviewMode ? "bg-green-500/10 text-green-600" : ""
              }`}
              title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
            >
              {isPreviewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsSplitView(!isSplitView);
                setIsPreviewMode(false);
                setIsCodeMode(false);
              }}
              className={`h-8 w-8 p-0 ${
                isSplitView ? "bg-purple-500/10 text-purple-600" : ""
              }`}
              title="Split View"
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
              className={`h-8 w-8 p-0 ${
                isCodeMode ? "bg-orange-500/10 text-orange-600" : ""
              }`}
              title="Code View"
            >
              <FileCode className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        {(() => {
          if (isSplitView) {
            return (
              <div className="grid grid-cols-2 gap-0 min-h-[400px]">
                {/* Left: Editor */}
                <div className="border-r border-border">
                  <EditorContent editor={editor} />
                </div>
                {/* Right: Preview */}
                <div className="p-4">
                  <div
                    className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto max-w-none"
                    dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                  />
                </div>
              </div>
            );
          }

          if (isPreviewMode) {
            return (
              <div className="p-4 min-h-[400px]">
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto max-w-none"
                  dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                />
              </div>
            );
          }

          if (isCodeMode) {
            return (
              <div className="p-4 min-h-[400px]">
                <div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
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