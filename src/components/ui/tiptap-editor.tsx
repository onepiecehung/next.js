"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";

import { Button } from "./core/button";
import { NoSSR } from "../providers/no-ssr";
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
    const language = node.attrs.language || 'typescript';
    return [
      'pre',
      { ...HTMLAttributes, class: `language-${language}` },
      ['code', { class: `language-${language}` }, node.textContent]
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
      
      // Highlight code blocks in editor after content update
      setTimeout(() => {
        const codeBlocks = editor.view.dom.querySelectorAll('pre code');
        codeBlocks.forEach((block) => {
          Prism.highlightElement(block);
        });
      }, 0);
      
      // Also highlight code blocks in preview modes if active
      setTimeout(() => {
        // Preview Mode
        const previewContainer = document.querySelector('.preview-content');
        if (previewContainer) {
          const previewCodeBlocks = previewContainer.querySelectorAll('pre code');
          previewCodeBlocks.forEach((block) => {
            Prism.highlightElement(block);
          });
        }
        
        // Split View Preview
        const splitViewPreview = document.querySelector('.split-view-preview .preview-content');
        if (splitViewPreview) {
          const splitViewCodeBlocks = splitViewPreview.querySelectorAll('pre code');
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
    const url = window.prompt("Enter image URL:");
    console.log('Image URL entered:', url);
    
    if (url) {
      try {
        new URL(url);
        console.log('URL is valid, adding to editor...');
        editor?.chain().focus().setImage({ src: url }).run();
        console.log('Image added successfully');
      } catch (error) {
        console.error('Invalid URL format:', error);
        alert('Please enter a valid URL (e.g., https://example.com/image.jpg)');
      }
    } else {
      console.log('No URL entered');
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const handleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
  const handleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
  const handleUnderline = useCallback(() => editor?.chain().focus().toggleUnderline().run(), [editor]);
  const handleStrike = useCallback(() => editor?.chain().focus().toggleStrike().run(), [editor]);
  const handleHighlight = useCallback(() => editor?.chain().focus().toggleMark('highlight').run(), [editor]);
  const handleH1 = useCallback(() => editor?.chain().focus().toggleHeading({ level: 1 }).run(), [editor]);
  const handleH2 = useCallback(() => editor?.chain().focus().toggleHeading({ level: 2 }).run(), [editor]);
  const handleBulletList = useCallback(() => {
    console.log('Bullet list clicked');
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);
  const handleOrderedList = useCallback(() => {
    console.log('Ordered list clicked');
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);
  const handleBlockquote = useCallback(() => editor?.chain().focus().toggleBlockquote().run(), [editor]);
  const handleCodeBlock = useCallback(() => editor?.chain().focus().toggleCodeBlock().run(), [editor]);

  if (!editor) {
    return null;
  }

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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
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
            } transition-all duration-150`}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={addImage}
            className="text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-all duration-150"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

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
                const previewContainer = document.querySelector('.preview-content');
                if (previewContainer) {
                  const codeBlocks = previewContainer.querySelectorAll('pre code');
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
          } transition-all duration-150`}
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
              
              // Highlight code blocks in split view preview after state update
              setTimeout(() => {
                const previewContainer = document.querySelector('.split-view-preview .preview-content');
                if (previewContainer) {
                  const codeBlocks = previewContainer.querySelectorAll('pre code');
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
          } transition-all duration-150`}
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
          } transition-all duration-150`}
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
                    <code className="language-html">
                      {editor.getHTML()}
                    </code>
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
