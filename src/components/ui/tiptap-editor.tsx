"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import { Button } from "./core/button";
import { NoSSR } from "../providers/no-ssr";
import {
  Bold,
  Italic,
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
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class:
            "bg-gray-100 dark:bg-gray-800 rounded-md p-4 font-mono text-sm",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4 ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    // Fix SSR hydration mismatch
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <NoSSR>
      <div className="border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-blue-100 text-blue-700" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive("italic") ? "bg-blue-100 text-blue-700" : ""
            }
          >
            <Italic className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 })
                ? "bg-blue-100 text-blue-700"
                : ""
            }
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 })
                ? "bg-blue-100 text-blue-700"
                : ""
            }
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList") ? "bg-blue-100 text-blue-700" : ""
            }
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive("orderedList") ? "bg-blue-100 text-blue-700" : ""
            }
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={
              editor.isActive("blockquote") ? "bg-blue-100 text-blue-700" : ""
            }
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={
              editor.isActive("codeBlock") ? "bg-blue-100 text-blue-700" : ""
            }
          >
            <Code className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={editor.isActive("link") ? "bg-blue-100 text-blue-700" : ""}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

                  <Button variant="ghost" size="sm" onClick={addImage}>
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

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
            }
          }}
          className={isPreviewMode ? "bg-green-100 text-green-700" : ""}
          title={isPreviewMode ? "Switch to Edit Mode" : "Switch to Preview Mode"}
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
            }
          }}
          className={isSplitView ? "bg-purple-100 text-purple-700" : ""}
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
          className={isCodeMode ? "bg-yellow-100 text-yellow-700" : ""}
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
                  <div className="prose prose-lg max-w-none">
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
              <div className="p-4 min-h-[400px] prose prose-lg max-w-none">
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
                  <pre className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {editor.getHTML()}
                  </pre>
                </div>
              </div>
            );
          }
          
          return <EditorContent editor={editor} />;
        })()}
      </div>
    </NoSSR>
  );
}
