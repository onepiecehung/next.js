"use client";

import { useState } from "react";
import { TipTapEditor } from "@/components/ui/text-editor/tiptap-editor";
import { Card } from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { Badge } from "@/components/ui/core";
import { Separator } from "@/components/ui/layout";

export default function EditorDemoPage() {
  const [content, setContent] = useState(`
    <h1>Welcome to the Modern TipTap Editor</h1>
    <p>This is a <strong>modern rich text editor</strong> with <em>grouped toolbar</em> based on the <a href="https://tiptap.dev/docs/ui-components/templates/simple-editor">Tiptap Simple Editor Template</a>.</p>
    
    <h2>New Grouped Toolbar Features</h2>
    <p>The toolbar is now organized into logical groups:</p>
    
    <ul>
      <li>✅ <strong>History Group:</strong> Undo/Redo functionality</li>
      <li>✅ <strong>Text Formatting:</strong> Bold, Italic, Underline, Strikethrough, Highlight, Inline Code</li>
      <li>✅ <strong>Headings & Structure:</strong> H1, H2, H3 dropdown</li>
      <li>✅ <strong>Lists:</strong> Bullet, Numbered, and Task lists</li>
      <li>✅ <strong>Block Elements:</strong> Blockquotes and Code blocks</li>
      <li>✅ <strong>Text Alignment:</strong> Left, Center, Right, Justify</li>
      <li>✅ <strong>Media & Links:</strong> Add links and images</li>
      <li>✅ <strong>View Modes:</strong> Edit, Preview, Split View, Code View</li>
    </ul>

    <h3>Task List Example</h3>
    <ul data-type="taskList">
      <li data-type="taskItem" data-checked="true">Completed task</li>
      <li data-type="taskItem" data-checked="false">Pending task</li>
      <li data-type="taskItem" data-checked="false">Another pending task</li>
    </ul>

    <blockquote>
      <p>This is a blockquote example. Notice how the grouped toolbar makes it easier to find the right formatting options!</p>
    </blockquote>

    <h3>Code Block Example</h3>
    <pre><code>function hello() {
  console.log("Hello, Grouped TipTap Editor!");
  return "Welcome to the modern editor with organized toolbar!";
}</code></pre>

    <p>Try editing this content and explore all the grouped features in the toolbar above!</p>
  `);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const getWordCount = () => {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharacterCount = () => {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Modern TipTap Editor with Grouped Toolbar</h1>
        <p className="text-muted-foreground">
          A responsive, feature-rich rich text editor with organized toolbar groups
        </p>
        <div className="flex items-center gap-4">
          <Badge variant="outline">Words: {getWordCount()}</Badge>
          <Badge variant="outline">Characters: {getCharacterCount()}</Badge>
        </div>
      </div>

      <Separator />

      {/* Editor */}
      <Card className="p-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-2">Rich Text Editor with Grouped Toolbar</h2>
          <p className="text-sm text-muted-foreground">
            Notice how the toolbar is now organized into logical groups for better UX
          </p>
        </div>
        <div className="p-6">
          <TipTapEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Start writing your story..."
            className="min-h-[500px]"
          />
        </div>
      </Card>

      {/* Toolbar Groups Explanation */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Toolbar Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Group 1: History</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Undo</li>
              <li>• Redo</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Group 2: Text Formatting</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Bold, Italic, Underline</li>
              <li>• Strikethrough, Highlight</li>
              <li>• Inline Code</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Group 3: Structure</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Headings (H1, H2, H3)</li>
              <li>• Dropdown selector</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Group 4: Lists</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Bullet List</li>
              <li>• Numbered List</li>
              <li>• Task List (Checkboxes)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Group 5: Block Elements</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Blockquotes</li>
              <li>• Code Blocks</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Group 6: Alignment</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Left, Center, Right</li>
              <li>• Justify</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Group 7: Media</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Add Links</li>
              <li>• Add Images</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Group 8: View Modes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Edit Mode</li>
              <li>• Preview Mode</li>
              <li>• Split View</li>
              <li>• Code View</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Benefits */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Benefits of Grouped Toolbar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium">Improved UX</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Logical grouping of related functions</li>
              <li>• Easier to find specific tools</li>
              <li>• Visual separation between groups</li>
              <li>• Better organization for complex toolbars</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Professional Look</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Clean, modern appearance</li>
              <li>• Consistent with design systems</li>
              <li>• Better visual hierarchy</li>
              <li>• Tooltips for accessibility</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Raw HTML Output */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Raw HTML Output</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(content)}
          >
            Copy HTML
          </Button>
        </div>
        <div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto max-h-96">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      </Card>
    </div>
  );
}
