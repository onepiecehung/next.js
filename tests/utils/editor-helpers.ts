import { Page, expect } from '@playwright/test';
import { testSelectors } from '../fixtures/test-data';

/**
 * Rich text editor helper functions for E2E tests
 * Provides reusable methods for TipTap editor interactions
 */
export class EditorHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for editor to be ready
   */
  async waitForEditorReady() {
    await this.page.waitForSelector(testSelectors.editor.contentEditor);
    await this.page.waitForTimeout(1000); // Additional wait for editor initialization
  }

  /**
   * Type text in the editor
   */
  async typeInEditor(text: string) {
    await this.waitForEditorReady();
    
    // Click on editor to focus
    await this.page.click(testSelectors.editor.contentEditor);
    
    // Type the text
    await this.page.keyboard.type(text);
  }

  /**
   * Insert text at specific position
   */
  async insertTextAtPosition(text: string, position: number) {
    await this.waitForEditorReady();
    
    // Click on editor
    await this.page.click(testSelectors.editor.contentEditor);
    
    // Move cursor to position
    for (let i = 0; i < position; i++) {
      await this.page.keyboard.press('ArrowRight');
    }
    
    // Type the text
    await this.page.keyboard.type(text);
  }

  /**
   * Select all text in editor
   */
  async selectAllText() {
    await this.page.click(testSelectors.editor.contentEditor);
    await this.page.keyboard.press('Control+a');
  }

  /**
   * Clear editor content
   */
  async clearEditor() {
    await this.selectAllText();
    await this.page.keyboard.press('Delete');
  }

  /**
   * Format text as bold
   */
  async formatBold() {
    await this.page.click('[data-testid="bold-button"]');
  }

  /**
   * Format text as italic
   */
  async formatItalic() {
    await this.page.click('[data-testid="italic-button"]');
  }

  /**
   * Format text as underline
   */
  async formatUnderline() {
    await this.page.click('[data-testid="underline-button"]');
  }

  /**
   * Insert heading
   */
  async insertHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    await this.page.click(`[data-testid="heading-${level}-button"]`);
  }

  /**
   * Insert bullet list
   */
  async insertBulletList() {
    await this.page.click('[data-testid="bullet-list-button"]');
  }

  /**
   * Insert numbered list
   */
  async insertNumberedList() {
    await this.page.click('[data-testid="numbered-list-button"]');
  }

  /**
   * Insert task list
   */
  async insertTaskList() {
    await this.page.click('[data-testid="task-list-button"]');
  }

  /**
   * Insert code block
   */
  async insertCodeBlock() {
    await this.page.click('[data-testid="code-block-button"]');
  }

  /**
   * Insert quote
   */
  async insertQuote() {
    await this.page.click('[data-testid="quote-button"]');
  }

  /**
   * Insert horizontal rule
   */
  async insertHorizontalRule() {
    await this.page.click('[data-testid="horizontal-rule-button"]');
  }

  /**
   * Insert link
   */
  async insertLink(url: string, text?: string) {
    await this.page.click('[data-testid="link-button"]');
    
    // Fill link URL
    await this.page.fill('[data-testid="link-url-input"]', url);
    
    if (text) {
      await this.page.fill('[data-testid="link-text-input"]', text);
    }
    
    // Confirm link
    await this.page.click('[data-testid="link-confirm-button"]');
  }

  /**
   * Insert image
   */
  async insertImage(imageUrl: string, alt?: string) {
    await this.page.click('[data-testid="image-button"]');
    
    // Fill image URL
    await this.page.fill('[data-testid="image-url-input"]', imageUrl);
    
    if (alt) {
      await this.page.fill('[data-testid="image-alt-input"]', alt);
    }
    
    // Confirm image
    await this.page.click('[data-testid="image-confirm-button"]');
  }

  /**
   * Upload image file
   */
  async uploadImage(filePath: string) {
    await this.page.click('[data-testid="image-upload-button"]');
    
    // Handle file upload
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    
    // Wait for upload to complete
    await this.page.waitForSelector('[data-testid="image-upload-success"]');
  }

  /**
   * Insert Mermaid diagram
   */
  async insertMermaidDiagram(diagramCode: string) {
    await this.page.click('[data-testid="mermaid-button"]');
    
    // Fill diagram code
    await this.page.fill('[data-testid="mermaid-code-input"]', diagramCode);
    
    // Confirm diagram
    await this.page.click('[data-testid="mermaid-confirm-button"]');
  }

  /**
   * Get editor content as HTML
   */
  async getEditorContent(): Promise<string> {
    return await this.page.evaluate(() => {
      const editor = document.querySelector('[data-testid="content-editor"]');
      return editor?.innerHTML || '';
    });
  }

  /**
   * Get editor content as text
   */
  async getEditorText(): Promise<string> {
    return await this.page.evaluate(() => {
      const editor = document.querySelector('[data-testid="content-editor"]');
      return editor?.textContent || '';
    });
  }

  /**
   * Get editor content as Markdown
   */
  async getEditorMarkdown(): Promise<string> {
    // This would depend on your editor's markdown export functionality
    return await this.page.evaluate(() => {
      const editor = (window as any).editor;
      return editor?.getMarkdown?.() || '';
    });
  }

  /**
   * Set editor content from HTML
   */
  async setEditorContent(html: string) {
    await this.clearEditor();
    await this.page.evaluate((content) => {
      const editor = document.querySelector('[data-testid="content-editor"]');
      if (editor) {
        editor.innerHTML = content;
      }
    }, html);
  }

  /**
   * Set editor content from Markdown
   */
  async setEditorMarkdown(markdown: string) {
    // This would depend on your editor's markdown import functionality
    await this.page.evaluate((content) => {
      const editor = (window as any).editor;
      if (editor?.setMarkdown) {
        editor.setMarkdown(content);
      }
    }, markdown);
  }

  /**
   * Test all formatting options
   */
  async testAllFormatting() {
    const testText = 'Test formatting text';
    
    // Type test text
    await this.typeInEditor(testText);
    
    // Select all text
    await this.selectAllText();
    
    // Test bold
    await this.formatBold();
    await expect(this.page.locator('strong')).toContainText(testText);
    
    // Test italic
    await this.selectAllText();
    await this.formatItalic();
    await expect(this.page.locator('em')).toContainText(testText);
    
    // Test underline
    await this.selectAllText();
    await this.formatUnderline();
    await expect(this.page.locator('u')).toContainText(testText);
  }

  /**
   * Test list functionality
   */
  async testLists() {
    // Test bullet list
    await this.typeInEditor('Bullet item 1');
    await this.page.keyboard.press('Enter');
    await this.insertBulletList();
    await expect(this.page.locator('ul li')).toContainText('Bullet item 1');
    
    // Test numbered list
    await this.typeInEditor('Numbered item 1');
    await this.page.keyboard.press('Enter');
    await this.insertNumberedList();
    await expect(this.page.locator('ol li')).toContainText('Numbered item 1');
    
    // Test task list
    await this.typeInEditor('Task item 1');
    await this.page.keyboard.press('Enter');
    await this.insertTaskList();
    await expect(this.page.locator('[data-type="taskItem"]')).toContainText('Task item 1');
  }

  /**
   * Test code block functionality
   */
  async testCodeBlocks() {
    await this.insertCodeBlock();
    await this.typeInEditor('console.log("Hello, World!");');
    
    // Verify code block is created
    await expect(this.page.locator('pre code')).toContainText('console.log("Hello, World!");');
  }

  /**
   * Test link insertion
   */
  async testLinks() {
    await this.typeInEditor('Click here');
    await this.selectAllText();
    await this.insertLink('https://example.com', 'Click here');
    
    // Verify link is created
    await expect(this.page.locator('a[href="https://example.com"]')).toContainText('Click here');
  }

  /**
   * Test image insertion
   */
  async testImages() {
    await this.insertImage('https://example.com/image.jpg', 'Test image');
    
    // Verify image is inserted
    await expect(this.page.locator('img[src="https://example.com/image.jpg"]')).toBeVisible();
    await expect(this.page.locator('img[alt="Test image"]')).toBeVisible();
  }

  /**
   * Test Mermaid diagram
   */
  async testMermaidDiagram() {
    const diagramCode = `
      graph TD
        A[Start] --> B{Decision}
        B -->|Yes| C[Action 1]
        B -->|No| D[Action 2]
        C --> E[End]
        D --> E
    `.trim();
    
    await this.insertMermaidDiagram(diagramCode);
    
    // Verify diagram is inserted
    await expect(this.page.locator('[data-testid="mermaid-diagram"]')).toBeVisible();
  }

  /**
   * Save article
   */
  async saveArticle() {
    await this.page.click(testSelectors.editor.saveButton);
    await this.page.waitForSelector('[data-testid="save-success"]');
  }

  /**
   * Publish article
   */
  async publishArticle() {
    await this.page.click(testSelectors.editor.publishButton);
    await this.page.waitForSelector('[data-testid="publish-success"]');
  }

  /**
   * Preview article
   */
  async previewArticle() {
    await this.page.click(testSelectors.editor.previewButton);
    await this.page.waitForSelector('[data-testid="preview-modal"]');
  }
}
