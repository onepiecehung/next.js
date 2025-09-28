"use client";

import { TipTapEditor } from "@/components/features/text-editor";
import { useState } from "react";

/**
 * Mermaid Demo Page
 * Demonstrates Mermaid diagram functionality in the TipTap editor
 */
export default function MermaidDemoPage() {
  const [content, setContent] = useState(`<h1>Mermaid Diagrams Demo</h1>

<p>This page demonstrates the Mermaid diagram functionality in the TipTap editor. You can create various types of diagrams using Mermaid syntax.</p>

<h2>Flowchart Example</h2>
<pre><code class="language-mermaid">graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> E[Fix issues]
    E --> B
    C --> F[End]
</code></pre>

<h2>Sequence Diagram Example</h2>
<pre><code class="language-mermaid">sequenceDiagram
    participant User
    participant Browser
    participant Server
    participant Database

    User->>Browser: Click button
    Browser->>Server: Send request
    Server->>Database: Query data
    Database-->>Server: Return data
    Server-->>Browser: Send response
    Browser-->>User: Display result
</code></pre>

<h2>Gantt Chart Example</h2>
<pre><code class="language-mermaid">gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Planning           :done,    plan1, 2024-01-01, 2024-01-15
    Design             :active,  design1, 2024-01-16, 2024-02-01
    section Phase 2
    Development        :         dev1, 2024-02-02, 2024-03-15
    Testing            :         test1, 2024-03-16, 2024-03-30
</code></pre>

<h2>Pie Chart Example</h2>
<pre><code class="language-mermaid">pie title Project Distribution
    "Frontend" : 40
    "Backend" : 35
    "Database" : 15
    "DevOps" : 10
</code></pre>

<h2>How to Use</h2>
<ol>
<li>Click on the "Code Block" button in the toolbar</li>
<li>Select "mermaid" as the language</li>
<li>Type your Mermaid diagram syntax</li>
<li>The diagram will be automatically rendered</li>
<li>Click "Edit" on any diagram to modify it</li>
</ol>

<p>Try creating your own diagrams using the editor below!</p>`);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Mermaid Diagrams Demo</h1>
        <p className="text-muted-foreground">
          This demo shows how Mermaid diagrams work in the TipTap editor. Create
          code blocks with{" "}
          <code className="bg-muted px-1 rounded">language-mermaid</code> to
          render diagrams.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Editor with Mermaid Support
          </h2>
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your content with Mermaid diagrams..."
            className="min-h-[600px]"
          />
        </div>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            Supported Diagram Types
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • <strong>Flowcharts:</strong> Process flows, decision trees,
              workflows
            </li>
            <li>
              • <strong>Sequence Diagrams:</strong> System interactions, API
              calls
            </li>
            <li>
              • <strong>Gantt Charts:</strong> Project timelines, schedules
            </li>
            <li>
              • <strong>Pie Charts:</strong> Data distribution, percentages
            </li>
            <li>
              • <strong>Journey Maps:</strong> User experience flows
            </li>
            <li>
              • <strong>Git Graphs:</strong> Git branching and merging
            </li>
            <li>
              • <strong>Mind Maps:</strong> Hierarchical information
            </li>
            <li>
              • <strong>Timeline:</strong> Chronological events
            </li>
          </ul>
        </div>

        <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
            💡 Pro Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>
              • Use{" "}
              <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
                Ctrl+Enter
              </code>{" "}
              to save when editing diagrams
            </li>
            <li>
              • Press{" "}
              <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
                Esc
              </code>{" "}
              to cancel editing
            </li>
            <li>• Diagrams automatically resize to fit the container</li>
            <li>• Switch between edit, preview, and split view modes</li>
            <li>• Diagrams work in all themes (light, dark, dracula)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
