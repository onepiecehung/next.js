"use client";

import { TipTapEditor } from "../../components/ui/text-editor/tiptap-editor";

const testContent = `
<h1>Lowlight Syntax Highlighting Test</h1>

<h2>JavaScript Code Block</h2>
<pre class="code-block"><code class="language-javascript">function greet(name) {
  console.log("Hello, " + name + "!");
  return {
    message: "Welcome",
    timestamp: new Date().toISOString()
  };
}

const user = "World";
greet(user);</code></pre>

<h2>TypeScript Code Block</h2>
<pre class="code-block"><code class="language-typescript">interface User {
  id: number;
  name: string;
  email?: string;
}

class UserService {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  getUser(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}</code></pre>

<h2>CSS Code Block</h2>
<pre class="code-block"><code class="language-css">.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}</code></pre>

<h2>HTML Code Block</h2>
<pre class="code-block"><code class="language-xml">&lt;div class="container"&gt;
  &lt;header&gt;
    &lt;h1&gt;Welcome to My Site&lt;/h1&gt;
    &lt;nav&gt;
      &lt;ul&gt;
        &lt;li&gt;&lt;a href="/"&gt;Home&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href="/about"&gt;About&lt;/a&gt;&lt;/li&gt;
      &lt;/ul&gt;
    &lt;/nav&gt;
  &lt;/header&gt;
  &lt;main&gt;
    &lt;p&gt;This is the main content.&lt;/p&gt;
  &lt;/main&gt;
&lt;/div&gt;</code></pre>

<h2>JSON Code Block</h2>
<pre class="code-block"><code class="language-json">{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A test project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "nodemon": "^2.0.15",
    "jest": "^27.5.1"
  }
}</code></pre>
`;

export default function TestLowlightPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Lowlight Syntax Highlighting Test</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">TipTap Editor with Lowlight Syntax Highlighting</h2>
          <TipTapEditor
            content={testContent}
            placeholder="Type some code to test syntax highlighting..."
            onChange={(content) => console.log("Content changed:", content)}
          />
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>The editor above should show syntax highlighted code blocks using lowlight + highlight.js</li>
            <li>Try creating a new code block using the Code Block button</li>
            <li>Test different languages: javascript, typescript, css, html, json, python, etc.</li>
            <li>Check the preview and split view modes - they should show syntax highlighting</li>
            <li>Test with different themes (light, dark, dracula)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
