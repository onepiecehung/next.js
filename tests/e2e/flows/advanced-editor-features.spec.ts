import { expect, test } from '@playwright/test';
import { EditorPage } from '../../utils/page-objects/editor-page';
import { LoginPage } from '../../utils/page-objects/login-page';

/**
 * Advanced Editor Features Flow
 * Tests advanced features of the rich text editor in the login to create article flow
 */
test.describe('Advanced Editor Features Flow', () => {
  test('should login and create article with advanced formatting', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Create article with advanced formatting
    await editorPage.fillTitle('Advanced Formatting Article');
    await editorPage.fillExcerpt('This article demonstrates advanced formatting features');

    // Add headings
    await editorPage.insertHeading(1);
    await editorPage.typeInEditor('Main Heading');
    await editorPage.typeInEditor('\n\n');
    
    await editorPage.insertHeading(2);
    await editorPage.typeInEditor('Sub Heading');
    await editorPage.typeInEditor('\n\n');

    // Add formatted text
    await editorPage.typeInEditor('This is ');
    await editorPage.formatBold();
    await editorPage.typeInEditor('bold text');
    await editorPage.typeInEditor(' and this is ');
    await editorPage.formatItalic();
    await editorPage.typeInEditor('italic text');
    await editorPage.typeInEditor('.\n\n');

    // Add bullet list
    await editorPage.insertBulletList();
    await editorPage.typeInEditor('First bullet point');
    await editorPage.typeInEditor('\n');
    await editorPage.typeInEditor('Second bullet point');
    await editorPage.typeInEditor('\n');
    await editorPage.typeInEditor('Third bullet point');
    await editorPage.typeInEditor('\n\n');

    // Add numbered list
    await editorPage.insertNumberedList();
    await editorPage.typeInEditor('First numbered item');
    await editorPage.typeInEditor('\n');
    await editorPage.typeInEditor('Second numbered item');
    await editorPage.typeInEditor('\n');
    await editorPage.typeInEditor('Third numbered item');
    await editorPage.typeInEditor('\n\n');

    // Add task list
    await editorPage.insertTaskList();
    await editorPage.typeInEditor('Task 1');
    await editorPage.typeInEditor('\n');
    await editorPage.typeInEditor('Task 2');
    await editorPage.typeInEditor('\n');
    await editorPage.typeInEditor('Task 3');
    await editorPage.typeInEditor('\n\n');

    // Add code block
    await editorPage.insertCodeBlock();
    await editorPage.typeInEditor('function hello() {\n  console.log("Hello, World!");\n}');
    await editorPage.typeInEditor('\n\n');

    // Add link
    await editorPage.typeInEditor('Visit ');
    await editorPage.insertLink('https://example.com', 'our website');
    await editorPage.typeInEditor(' for more information.\n\n');

    // Add tags
    await editorPage.addTags(['advanced', 'formatting', 'test']);

    // Save article
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();

    // Verify content is saved correctly
    const content = await editorPage.getEditorContent();
    expect(content).toContain('Main Heading');
    expect(content).toContain('Sub Heading');
    expect(content).toContain('<strong>bold text</strong>');
    expect(content).toContain('<em>italic text</em>');
    expect(content).toContain('<ul>');
    expect(content).toContain('<ol>');
    expect(content).toContain('<pre><code>');
    expect(content).toContain('<a href="https://example.com">');
  });

  test('should login and create article with Mermaid diagrams', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Create article with Mermaid diagrams
    await editorPage.fillTitle('Article with Mermaid Diagrams');
    await editorPage.fillExcerpt('This article contains Mermaid diagrams');

    // Add content
    await editorPage.typeInEditor('This article demonstrates how to include Mermaid diagrams in your content.\n\n');

    // Add flowchart diagram
    const flowchartCode = `
      flowchart TD
        A[Start] --> B{Decision}
        B -->|Yes| C[Action 1]
        B -->|No| D[Action 2]
        C --> E[End]
        D --> E
    `.trim();

    await editorPage.insertMermaidDiagram(flowchartCode);
    await editorPage.typeInEditor('\n\n');

    // Add sequence diagram
    const sequenceCode = `
      sequenceDiagram
        participant A as User
        participant B as System
        A->>B: Request
        B->>A: Response
    `.trim();

    await editorPage.insertMermaidDiagram(sequenceCode);
    await editorPage.typeInEditor('\n\n');

    // Add Gantt chart
    const ganttCode = `
      gantt
        title Project Timeline
        dateFormat  YYYY-MM-DD
        section Phase 1
        Task 1           :done,    task1, 2024-01-01, 2024-01-10
        Task 2           :active,  task2, 2024-01-11, 2024-01-20
        section Phase 2
        Task 3           :         task3, 2024-01-21, 2024-01-30
    `.trim();

    await editorPage.insertMermaidDiagram(ganttCode);

    // Add tags
    await editorPage.addTags(['mermaid', 'diagrams', 'visualization']);

    // Save article
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();

    // Verify diagrams are rendered
    await expect(page.locator('[data-testid="mermaid-diagram"]')).toHaveCount(3);
  });

  test('should login and create article with images', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Create article with images
    await editorPage.fillTitle('Article with Images');
    await editorPage.fillExcerpt('This article contains various images');

    // Add content
    await editorPage.typeInEditor('This article demonstrates how to include images in your content.\n\n');

    // Add image by URL
    await editorPage.insertImage('https://via.placeholder.com/300x200', 'Placeholder Image');
    await editorPage.typeInEditor('\n\n');

    // Add another image
    await editorPage.insertImage('https://via.placeholder.com/400x300', 'Another Image');
    await editorPage.typeInEditor('\n\n');

    // Add content around images
    await editorPage.typeInEditor('The images above demonstrate different placeholder images that can be used in articles.\n\n');

    // Add tags
    await editorPage.addTags(['images', 'media', 'visual']);

    // Save article
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();

    // Verify images are rendered
    await expect(page.locator('img[src="https://via.placeholder.com/300x200"]')).toBeVisible();
    await expect(page.locator('img[src="https://via.placeholder.com/400x300"]')).toBeVisible();
  });

  test('should login and create article with complex markdown', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Create article with complex markdown
    await editorPage.fillTitle('Complex Markdown Article');
    await editorPage.fillExcerpt('This article contains complex markdown formatting');

    // Set complex markdown content
    const complexMarkdown = `
# Complex Markdown Article

This article demonstrates **complex markdown** formatting with various elements.

## Features

- **Bold text** and *italic text*
- [Links](https://example.com)
- \`inline code\`
- ~~Strikethrough text~~

### Code Block

\`\`\`javascript
function complexFunction() {
  const data = {
    name: "John Doe",
    age: 30,
    skills: ["JavaScript", "TypeScript", "React"]
  };
  
  return data;
}
\`\`\`

### Task List

- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

### Table

| Feature | Status | Priority |
|---------|--------|----------|
| Login | ✅ Done | High |
| Editor | 🔄 In Progress | High |
| Publish | ⏳ Planned | Medium |

### Quote

> This is a blockquote that demonstrates how quotes are rendered in the editor.

### Horizontal Rule

---

## Conclusion

This article shows the power of markdown formatting in creating rich, structured content.
    `.trim();

    await editorPage.setEditorMarkdown(complexMarkdown);

    // Add tags
    await editorPage.addTags(['markdown', 'complex', 'formatting']);

    // Save article
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();

    // Verify markdown is rendered correctly
    const content = await editorPage.getEditorContent();
    expect(content).toContain('<h1>Complex Markdown Article</h1>');
    expect(content).toContain('<h2>Features</h2>');
    expect(content).toContain('<strong>Bold text</strong>');
    expect(content).toContain('<em>italic text</em>');
    expect(content).toContain('<pre><code>');
    expect(content).toContain('<blockquote>');
    expect(content).toContain('<hr>');
  });

  test('should login and create article with auto-save functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Start creating article
    await editorPage.fillTitle('Auto-save Test Article');
    await editorPage.fillExcerpt('This article tests auto-save functionality');

    // Type content slowly to trigger auto-save
    await editorPage.typeInEditor('This is a test of the auto-save functionality. ');
    
    // Wait for auto-save indicator
    await page.waitForSelector('[data-testid="auto-save-indicator"]', { timeout: 10000 });
    
    // Continue typing
    await editorPage.typeInEditor('The editor should automatically save changes as you type. ');
    
    // Wait for auto-save success
    await page.waitForSelector('[data-testid="auto-save-success"]', { timeout: 10000 });

    // Add more content
    await editorPage.typeInEditor('This ensures that your work is never lost, even if something unexpected happens.');
    
    // Add tags
    await editorPage.addTags(['auto-save', 'test', 'functionality']);

    // Manual save to verify everything is saved
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();

    // Verify auto-save worked
    const content = await editorPage.getEditorContent();
    expect(content).toContain('auto-save functionality');
    expect(content).toContain('automatically save changes');
  });
});
