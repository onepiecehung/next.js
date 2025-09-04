"use client";

import { useState } from "react";
import { TipTapEditor } from "@/components/ui/text-editor/tiptap-editor";
import { Card } from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";

export default function TestStylingPage() {
  const [content, setContent] = useState(`
    <h1>Test Styling</h1>
    
    <blockquote>
      <p>Đây là blockquote test với styling mới</p>
    </blockquote>
    
    <pre><code>console.log("Code block test");</code></pre>
    
    <p>Inline <code>code</code> test</p>
  `);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Test CSS Styling</h1>
        <p className="text-muted-foreground">
          Kiểm tra xem blockquote và code block có hiển thị đúng không
        </p>
      </div>

      <Card className="p-6">
        <TipTapEditor
          content={content}
          onChange={setContent}
          placeholder="Test editor..."
          className="min-h-[400px]"
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Card>
    </div>
  );
}