"use client";

import { useState } from "react";
import { ContentRenderer } from "@/components/ui/utilities/content-renderer";
import { Card } from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { Badge } from "@/components/ui/core";

export default function TestContentRendererPage() {
  const [variant, setVariant] = useState<"default" | "compact" | "minimal">("default");
  const [useTipTapStyling, setUseTipTapStyling] = useState(true);

  const sampleContent = `
    <h1>ContentRenderer Test</h1>
    
    <h2>Styling Comparison</h2>
    <p>Đây là test cho <strong>ContentRenderer</strong> với styling mới từ TipTap editor.</p>
    
    <blockquote>
      <p>Blockquote sẽ có styling giống như trong TipTap editor với border trái và background.</p>
    </blockquote>
    
    <h3>Code Block Test</h3>
    <pre><code>function testContentRenderer() {
  console.log("Testing ContentRenderer with TipTap styling");
  return "Styling should match TipTap editor";
}

const result = testContentRenderer();
console.log(result);</code></pre>
    
    <h3>Lists Test</h3>
    <ul>
      <li>Item 1 với <strong>bold text</strong></li>
      <li>Item 2 với <em>italic text</em></li>
      <li>Item 3 với <code>inline code</code></li>
    </ul>
    
    <h3>Links Test</h3>
    <p>Đây là <a href="https://example.com">link test</a> để xem styling.</p>
    
    <h3>Mixed Content</h3>
    <p>Đoạn văn với <strong>bold</strong>, <em>italic</em>, và <code>code</code> inline.</p>
  `;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">ContentRenderer Test</h1>
        <p className="text-muted-foreground">
          Test ContentRenderer với styling mới từ TipTap editor
        </p>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Controls</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useTipTapStyling"
              checked={useTipTapStyling}
              onChange={(e) => setUseTipTapStyling(e.target.checked)}
            />
            <label htmlFor="useTipTapStyling" className="text-sm">
              Use TipTap Styling
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm">Variant:</label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="default">Default</option>
              <option value="compact">Compact</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Content Renderer Test */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">ContentRenderer Output</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {useTipTapStyling ? "TipTap Styling" : "Default Styling"}
            </Badge>
            <Badge variant="outline">{variant}</Badge>
          </div>
        </div>
        
        <ContentRenderer
          content={sampleContent}
          useTipTapStyling={useTipTapStyling}
          variant={variant}
          className="border rounded-lg p-4 bg-card"
        />
      </Card>

      {/* Comparison */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Styling Comparison</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2 text-green-600">With TipTap Styling</h3>
            <div className="border rounded-lg p-4 bg-card">
              <ContentRenderer
                content={sampleContent}
                useTipTapStyling={true}
                variant="default"
              />
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 text-blue-600">Without TipTap Styling</h3>
            <div className="border rounded-lg p-4 bg-card">
              <ContentRenderer
                content={sampleContent}
                useTipTapStyling={false}
                variant="default"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Variants Comparison */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Variant Comparison</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Default</h3>
            <div className="border rounded-lg p-4 bg-card">
              <ContentRenderer
                content={sampleContent}
                useTipTapStyling={true}
                variant="default"
              />
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Compact</h3>
            <div className="border rounded-lg p-4 bg-card">
              <ContentRenderer
                content={sampleContent}
                useTipTapStyling={true}
                variant="compact"
              />
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Minimal</h3>
            <div className="border rounded-lg p-4 bg-card">
              <ContentRenderer
                content={sampleContent}
                useTipTapStyling={true}
                variant="minimal"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Features */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium">TipTap Styling</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Blockquote với border và background</li>
              <li>• Code blocks với styling đẹp</li>
              <li>• Inline code với border</li>
              <li>• Typography nhất quán</li>
              <li>• Dark mode support</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Variants</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Default:</strong> Full styling</li>
              <li>• <strong>Compact:</strong> Smaller text</li>
              <li>• <strong>Minimal:</strong> Basic styling</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
