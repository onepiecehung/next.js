import { expect, test } from '@playwright/test';
import { testArticles } from '../../fixtures/test-data';
import { AuthHelpers } from '../../utils/auth-helpers';
import { EditorPage } from '../../utils/page-objects/editor-page';

/**
 * Article creation E2E tests
 * Tests article creation, editing, and publishing functionality
 */
test.describe('Article Creation', () => {
  let editorPage: EditorPage;
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    editorPage = new EditorPage(page);
    authHelpers = new AuthHelpers(page);
    
    // Login before each test
    await authHelpers.setupAuthenticatedState();
    await editorPage.goto();
  });

  test('should create article with basic content', async () => {
    await editorPage.createArticle(testArticles.sampleArticle);
    await editorPage.saveArticle();
    
    // Verify article is saved
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });

  test('should create article with rich text content', async () => {
    await editorPage.createArticle(testArticles.longArticle);
    await editorPage.saveArticle();
    
    // Verify article is saved
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });

  test('should create draft article', async () => {
    await editorPage.createArticle(testArticles.draftArticle);
    await editorPage.saveArticle();
    
    // Verify article is saved as draft
    await expect(page.locator('[data-testid="draft-indicator"]')).toBeVisible();
  });

  test('should publish article', async () => {
    await editorPage.createArticle(testArticles.sampleArticle);
    await editorPage.publishArticle();
    
    // Verify article is published
    await expect(page.locator('[data-testid="publish-success"]')).toBeVisible();
  });

  test('should validate required fields', async () => {
    await editorPage.testFormValidation();
  });

  test('should handle auto-save functionality', async () => {
    await editorPage.testAutoSave();
  });

  test('should preview article', async () => {
    await editorPage.createArticle(testArticles.sampleArticle);
    await editorPage.testPreviewFunctionality();
  });

  test('should handle rich text formatting', async () => {
    await editorPage.fillTitle('Rich Text Test');
    
    // Test bold formatting
    await editorPage.typeInEditor('Bold text');
    await editorPage.selectAllText();
    await editorPage.formatBold();
    await expect(page.locator('strong')).toContainText('Bold text');
    
    // Test italic formatting
    await editorPage.typeInEditor('Italic text');
    await editorPage.selectAllText();
    await editorPage.formatItalic();
    await expect(page.locator('em')).toContainText('Italic text');
  });

  test('should handle headings', async () => {
    await editorPage.fillTitle('Headings Test');
    
    // Test H1
    await editorPage.insertHeading(1);
    await editorPage.typeInEditor('Main Heading');
    await expect(page.locator('h1')).toContainText('Main Heading');
    
    // Test H2
    await editorPage.insertHeading(2);
    await editorPage.typeInEditor('Sub Heading');
    await expect(page.locator('h2')).toContainText('Sub Heading');
  });

  test('should handle lists', async () => {
    await editorPage.fillTitle('Lists Test');
    
    // Test bullet list
    await editorPage.insertBulletList();
    await editorPage.typeInEditor('Bullet item 1');
    await expect(page.locator('ul li')).toContainText('Bullet item 1');
    
    // Test numbered list
    await editorPage.insertNumberedList();
    await editorPage.typeInEditor('Numbered item 1');
    await expect(page.locator('ol li')).toContainText('Numbered item 1');
    
    // Test task list
    await editorPage.insertTaskList();
    await editorPage.typeInEditor('Task item 1');
    await expect(page.locator('[data-type="taskItem"]')).toContainText('Task item 1');
  });

  test('should handle code blocks', async () => {
    await editorPage.fillTitle('Code Blocks Test');
    
    await editorPage.insertCodeBlock();
    await editorPage.typeInEditor('console.log("Hello, World!");');
    
    // Verify code block is created
    await expect(page.locator('pre code')).toContainText('console.log("Hello, World!");');
  });

  test('should handle links', async () => {
    await editorPage.fillTitle('Links Test');
    
    await editorPage.typeInEditor('Click here');
    await editorPage.selectAllText();
    await editorPage.insertLink('https://example.com', 'Click here');
    
    // Verify link is created
    await expect(page.locator('a[href="https://example.com"]')).toContainText('Click here');
  });

  test('should handle images', async () => {
    await editorPage.fillTitle('Images Test');
    
    await editorPage.insertImage('https://example.com/image.jpg', 'Test image');
    
    // Verify image is inserted
    await expect(page.locator('img[src="https://example.com/image.jpg"]')).toBeVisible();
    await expect(page.locator('img[alt="Test image"]')).toBeVisible();
  });

  test('should handle Mermaid diagrams', async () => {
    await editorPage.fillTitle('Mermaid Test');
    
    const diagramCode = `
      graph TD
        A[Start] --> B{Decision}
        B -->|Yes| C[Action 1]
        B -->|No| D[Action 2]
        C --> E[End]
        D --> E
    `.trim();
    
    await editorPage.insertMermaidDiagram(diagramCode);
    
    // Verify diagram is inserted
    await expect(page.locator('[data-testid="mermaid-diagram"]')).toBeVisible();
  });

  test('should handle tags', async () => {
    await editorPage.fillTitle('Tags Test');
    
    const tags = ['test', 'e2e', 'playwright'];
    await editorPage.addTags(tags);
    
    // Verify tags are added
    const addedTags = await editorPage.getTags();
    expect(addedTags).toEqual(expect.arrayContaining(tags));
  });

  test('should handle visibility settings', async () => {
    await editorPage.fillTitle('Visibility Test');
    
    // Test public visibility
    await editorPage.setVisibility('public');
    expect(await editorPage.getVisibility()).toBe('public');
    
    // Test private visibility
    await editorPage.setVisibility('private');
    expect(await editorPage.getVisibility()).toBe('private');
    
    // Test draft visibility
    await editorPage.setVisibility('draft');
    expect(await editorPage.getVisibility()).toBe('draft');
  });

  test('should handle publish date', async () => {
    await editorPage.fillTitle('Publish Date Test');
    
    const publishDate = '2024-12-31';
    await editorPage.setPublishDate(publishDate);
    
    expect(await editorPage.getPublishDate()).toBe(publishDate);
  });

  test('should be responsive on mobile', async () => {
    await editorPage.testResponsiveDesign();
  });

  test('should handle long content', async () => {
    await editorPage.createArticle(testArticles.longArticle);
    await editorPage.saveArticle();
    
    // Verify article is saved
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });

  test('should handle special characters in title', async () => {
    const specialTitle = 'Test Article with Special Characters: !@#$%^&*()';
    await editorPage.fillTitle(specialTitle);
    
    expect(await editorPage.getTitle()).toBe(specialTitle);
  });

  test('should handle special characters in content', async () => {
    const specialContent = 'Content with special characters: !@#$%^&*()_+-=[]{}|;:,.<>?';
    await editorPage.typeInEditor(specialContent);
    
    const content = await editorPage.getEditorContent();
    expect(content).toContain(specialContent);
  });

  test('should handle empty content', async () => {
    await editorPage.fillTitle('Empty Content Test');
    await editorPage.clearEditor();
    
    // Try to save empty content
    await editorPage.clickSave();
    await expect(page.locator('[data-testid="content-error"]')).toBeVisible();
  });

  test('should handle very long title', async () => {
    const longTitle = 'A'.repeat(200); // Very long title
    await editorPage.fillTitle(longTitle);
    
    // Verify title is truncated or shows error
    const title = await editorPage.getTitle();
    expect(title.length).toBeLessThanOrEqual(100); // Assuming 100 char limit
  });

  test('should handle rapid typing', async () => {
    await editorPage.fillTitle('Rapid Typing Test');
    
    // Type rapidly
    const rapidText = 'This is a test of rapid typing to ensure the editor can handle fast input without issues.';
    for (const char of rapidText) {
      await page.keyboard.type(char);
      await page.waitForTimeout(10); // Small delay between characters
    }
    
    const content = await editorPage.getEditorContent();
    expect(content).toContain(rapidText);
  });

  test('should handle undo/redo functionality', async () => {
    await editorPage.fillTitle('Undo/Redo Test');
    
    // Type some text
    await editorPage.typeInEditor('Original text');
    
    // Undo
    await page.keyboard.press('Control+z');
    
    // Verify text is undone
    const content = await editorPage.getEditorContent();
    expect(content).not.toContain('Original text');
    
    // Redo
    await page.keyboard.press('Control+y');
    
    // Verify text is redone
    const contentAfterRedo = await editorPage.getEditorContent();
    expect(contentAfterRedo).toContain('Original text');
  });

  test('should handle copy/paste functionality', async () => {
    await editorPage.fillTitle('Copy/Paste Test');
    
    // Type some text
    await editorPage.typeInEditor('Text to copy');
    
    // Select all and copy
    await editorPage.selectAllText();
    await page.keyboard.press('Control+c');
    
    // Move to new line and paste
    await page.keyboard.press('Enter');
    await page.keyboard.press('Control+v');
    
    // Verify text is pasted
    const content = await editorPage.getEditorContent();
    expect(content).toContain('Text to copy');
  });
});
