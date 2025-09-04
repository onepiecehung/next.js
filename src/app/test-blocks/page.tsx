"use client";

import { useState } from "react";
import { TipTapEditor } from "@/components/ui/text-editor/tiptap-editor";
import { Card } from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { Badge } from "@/components/ui/core";

export default function TestBlocksPage() {
  const [content, setContent] = useState(`
    <h1>Test Blockquote và Code Block</h1>
    
    <h2>Blockquote Test</h2>
    <blockquote>
      <p>Đây là một blockquote test. Nó sẽ có border trái màu primary và background nhẹ.</p>
      <p>Đoạn thứ hai trong blockquote để test spacing.</p>
    </blockquote>
    
    <h2>Code Block Test</h2>
    <pre><code>function testCodeBlock() {
  console.log("Đây là code block test");
  return "CSS styling đã được cập nhật";
}

const result = testCodeBlock();
console.log(result);</code></pre>
    
    <h2>Inline Code Test</h2>
    <p>Đây là <code>inline code</code> trong đoạn văn để test styling.</p>
    
    <h2>Mixed Content Test</h2>
    <p>Đoạn văn bình thường với <strong>bold text</strong> và <em>italic text</em>.</p>
    
    <blockquote>
      <p>Blockquote với <code>inline code</code> bên trong.</p>
    </blockquote>
  `);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Test Blockquote & Code Block Styling</h1>
        <p className="text-muted-foreground">
          Test page để kiểm tra styling của blockquote và code block
        </p>
      </div>

      <Card className="p-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-2">TipTap Editor Test</h2>
          <p className="text-sm text-muted-foreground">
            Thử tạo blockquote và code block để xem styling
          </p>
        </div>
        <div className="p-6">
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Bắt đầu viết để test blockquote và code block..."
            className="min-h-[500px]"
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Preview Content</h2>
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Raw HTML</h2>
        <div className="bg-muted rounded-md p-4 font-mono text-sm overflow-x-auto">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      </Card>
    </div>
  );
}