"use client";

import { useState } from "react";
import { TipTapEditor } from "@/components/ui/text-editor/tiptap-editor";
import { Card } from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { Badge } from "@/components/ui/core";

export default function TestViewModesPage() {
  const [content, setContent] = useState(`
    <h1>Test View Modes</h1>
    
    <h2>Preview Mode Test</h2>
    <p>Đây là test cho <strong>Preview Mode</strong>. Bạn có thể thấy nội dung được render như thế nào.</p>
    
    <blockquote>
      <p>Đây là blockquote trong preview mode để test styling.</p>
    </blockquote>
    
    <h2>Code Block Test</h2>
    <pre><code>function testViewModes() {
  console.log("Testing view modes");
  return "Preview, Split View, Code View";
}

const result = testViewModes();</code></pre>
    
    <h2>Split View Test</h2>
    <p>Split view cho phép bạn <em>edit và preview</em> cùng lúc.</p>
    
    <ul>
      <li>Edit bên trái</li>
      <li>Preview bên phải</li>
      <li>Real-time updates</li>
    </ul>
    
    <h2>Code View Test</h2>
    <p>Code view hiển thị <code>raw HTML</code> của nội dung.</p>
  `);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Test View Modes</h1>
        <p className="text-muted-foreground">
          Test các chế độ xem: Preview, Split View, và Code View
        </p>
        <div className="flex items-center gap-4">
          <Badge variant="outline">Preview Mode</Badge>
          <Badge variant="outline">Split View</Badge>
          <Badge variant="outline">Code View</Badge>
        </div>
      </div>

      <Card className="p-0">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-2">TipTap Editor với View Modes</h2>
          <p className="text-sm text-muted-foreground">
            Thử các nút Preview, Split View, và Code View ở góc phải toolbar
          </p>
        </div>
        <div className="p-6">
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Bắt đầu viết để test các view modes..."
            className="min-h-[600px]"
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium text-green-600">👁️ Preview Mode</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click nút Eye icon</li>
              <li>• Xem nội dung được render</li>
              <li>• Không thể edit</li>
              <li>• Perfect cho review</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-purple-600">🔄 Split View</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click nút Split icon</li>
              <li>• Edit bên trái, preview bên phải</li>
              <li>• Real-time updates</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-orange-600">💻 Code View</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click nút Code icon</li>
              <li>• Xem raw HTML</li>
              <li>• Copy code dễ dàng</li>
              <li>• Debug content</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Features đã cải thiện</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium">Visual Feedback</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Nút active có border và shadow</li>
              <li>• Hover effects mượt mà</li>
              <li>• Color coding cho từng mode</li>
              <li>• Tooltips chi tiết</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">User Experience</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Headers cho mỗi view mode</li>
              <li>• Responsive split view</li>
              <li>• Smooth transitions</li>
              <li>• Clear visual separation</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
