"use client";

import { useState } from "react";
import { TipTapEditor } from "@/components/ui/text-editor/tiptap-editor";
import { Card } from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";

export default function TestEditorPage() {
  const [content, setContent] = useState(`
    <h1>Test Editor Functions</h1>
    <p>This is a test page to check if all editor functions work properly.</p>
    <p><strong>Bold text</strong> and <em>italic text</em> should work.</p>
    <h2>Heading 2 Test</h2>
    <h3>Heading 3 Test</h3>
    <h4>Heading 4 Test</h4>
    <h5>Heading 5 Test</h5>
    <ul>
      <li>Bullet list item 1</li>
      <li>Bullet list item 2</li>
    </ul>
    <ol>
      <li>Numbered list item 1</li>
      <li>Numbered list item 2</li>
    </ol>
    <h3>Blockquote Test</h3>
    <blockquote>
      <p>This is a clean blockquote test. Simple left border and italic text.</p>
    </blockquote>
    
    <h3>Code Block Test</h3>
    <pre><code>// This is a clean code block test
function testCodeBlock() {
  console.log("Code block with clean styling");
  return "Working perfectly!";
}</code></pre>
  `);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const testFunctions = [
    { name: "Bold", test: () => console.log("Bold test") },
    { name: "Italic", test: () => console.log("Italic test") },
    { name: "Underline", test: () => console.log("Underline test") },
    { name: "Strikethrough", test: () => console.log("Strikethrough test") },
    { name: "Highlight", test: () => console.log("Highlight test") },
    { name: "Inline Code", test: () => console.log("Inline Code test") },
    { name: "H1", test: () => console.log("H1 test") },
    { name: "H2", test: () => console.log("H2 test") },
    { name: "H3", test: () => console.log("H3 test") },
    { name: "H4", test: () => console.log("H4 test") },
    { name: "H5", test: () => console.log("H5 test") },
    { name: "Bullet List", test: () => console.log("Bullet List test") },
    { name: "Numbered List", test: () => console.log("Numbered List test") },
    { name: "Task List", test: () => console.log("Task List test") },
    { name: "Blockquote", test: () => console.log("Blockquote test") },
    { name: "Code Block", test: () => console.log("Code Block test") },
    { name: "Align Left", test: () => console.log("Align Left test") },
    { name: "Align Center", test: () => console.log("Align Center test") },
    { name: "Align Right", test: () => console.log("Align Right test") },
    { name: "Justify", test: () => console.log("Justify test") },
    { name: "Add Link", test: () => console.log("Add Link test") },
    { name: "Add Image", test: () => console.log("Add Image test") },
    { name: "Undo", test: () => console.log("Undo test") },
    { name: "Redo", test: () => console.log("Redo test") },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">TipTap Editor Function Test</h1>
        <p className="text-muted-foreground">
          Test all editor functions to ensure they work properly
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Test Functions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {testFunctions.map((func) => (
            <Button
              key={func.name}
              variant="outline"
              size="sm"
              onClick={func.test}
              className="text-xs"
            >
              {func.name}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-2">Editor</h2>
          <p className="text-sm text-muted-foreground">
            Try all the toolbar functions above
          </p>
        </div>
        <div className="p-6">
          <TipTapEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Test the editor functions..."
            className="min-h-[400px]"
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Raw HTML Output</h2>
        <div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto max-h-96">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      </Card>
    </div>
  );
}
