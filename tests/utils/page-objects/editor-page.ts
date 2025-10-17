import { Page, expect } from '@playwright/test';
import { testArticles, testSelectors } from '../../fixtures/test-data';
import { EditorHelpers } from '../editor-helpers';

/**
 * Editor page object for E2E tests
 * Encapsulates article editor page interactions and assertions
 */
export class EditorPage {
  private editorHelpers: EditorHelpers;

  constructor(private page: Page) {
    this.editorHelpers = new EditorHelpers(page);
  }

  /**
   * Navigate to editor page
   */
  async goto() {
    await this.page.goto('/write');
    await this.waitForPageLoad();
  }

  /**
   * Wait for editor page to load
   */
  async waitForPageLoad() {
    await this.page.waitForSelector(testSelectors.editor.titleInput);
    await this.page.waitForSelector(testSelectors.editor.contentEditor);
    await this.page.waitForSelector(testSelectors.editor.saveButton);
  }

  /**
   * Fill article title
   */
  async fillTitle(title: string) {
    await this.page.fill(testSelectors.editor.titleInput, title);
  }

  /**
   * Get article title
   */
  async getTitle(): Promise<string> {
    const titleInput = this.page.locator(testSelectors.editor.titleInput);
    return await titleInput.inputValue() || '';
  }

  /**
   * Fill article excerpt
   */
  async fillExcerpt(excerpt: string) {
    await this.page.fill('[data-testid="excerpt-input"]', excerpt);
  }

  /**
   * Get article excerpt
   */
  async getExcerpt(): Promise<string> {
    const excerptInput = this.page.locator('[data-testid="excerpt-input"]');
    return await excerptInput.inputValue() || '';
  }

  /**
   * Add article tags
   */
  async addTags(tags: string[]) {
    for (const tag of tags) {
      await this.page.fill('[data-testid="tag-input"]', tag);
      await this.page.keyboard.press('Enter');
    }
  }

  /**
   * Get article tags
   */
  async getTags(): Promise<string[]> {
    const tagElements = this.page.locator('[data-testid="article-tag"]');
    const count = await tagElements.count();
    const tags: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const tagText = await tagElements.nth(i).textContent();
      if (tagText) tags.push(tagText);
    }
    
    return tags;
  }

  /**
   * Remove tag
   */
  async removeTag(tag: string) {
    await this.page.click(`[data-testid="remove-tag-${tag}"]`);
  }

  /**
   * Set article visibility
   */
  async setVisibility(visibility: 'public' | 'private' | 'draft') {
    await this.page.click('[data-testid="visibility-selector"]');
    await this.page.click(`[data-testid="visibility-${visibility}"]`);
  }

  /**
   * Get article visibility
   */
  async getVisibility(): Promise<string> {
    const visibilitySelector = this.page.locator('[data-testid="visibility-selector"]');
    return await visibilitySelector.textContent() || 'draft';
  }

  /**
   * Set article publish date
   */
  async setPublishDate(date: string) {
    await this.page.fill('[data-testid="publish-date-input"]', date);
  }

  /**
   * Get article publish date
   */
  async getPublishDate(): Promise<string> {
    const dateInput = this.page.locator('[data-testid="publish-date-input"]');
    return await dateInput.inputValue() || '';
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

  /**
   * Close preview
   */
  async closePreview() {
    await this.page.click('[data-testid="close-preview-button"]');
  }

  /**
   * Check if save button is enabled
   */
  async isSaveButtonEnabled(): Promise<boolean> {
    const saveButton = this.page.locator(testSelectors.editor.saveButton);
    return await saveButton.isEnabled();
  }

  /**
   * Check if publish button is enabled
   */
  async isPublishButtonEnabled(): Promise<boolean> {
    const publishButton = this.page.locator(testSelectors.editor.publishButton);
    return await publishButton.isEnabled();
  }

  /**
   * Check if save button is loading
   */
  async isSaveButtonLoading(): Promise<boolean> {
    const saveButton = this.page.locator(testSelectors.editor.saveButton);
    return await saveButton.evaluate((el: HTMLButtonElement) => 
      el.disabled || el.textContent?.includes('Saving') || false
    );
  }

  /**
   * Check if publish button is loading
   */
  async isPublishButtonLoading(): Promise<boolean> {
    const publishButton = this.page.locator(testSelectors.editor.publishButton);
    return await publishButton.evaluate((el: HTMLButtonElement) => 
      el.disabled || el.textContent?.includes('Publishing') || false
    );
  }

  /**
   * Get editor content
   */
  async getEditorContent(): Promise<string> {
    return await this.editorHelpers.getEditorContent();
  }

  /**
   * Set editor content
   */
  async setEditorContent(content: string) {
    await this.editorHelpers.setEditorContent(content);
  }

  /**
   * Type in editor
   */
  async typeInEditor(text: string) {
    await this.editorHelpers.typeInEditor(text);
  }

  /**
   * Clear editor
   */
  async clearEditor() {
    await this.editorHelpers.clearEditor();
  }

  /**
   * Format text as bold
   */
  async formatBold() {
    await this.editorHelpers.formatBold();
  }

  /**
   * Format text as italic
   */
  async formatItalic() {
    await this.editorHelpers.formatItalic();
  }

  /**
   * Insert heading
   */
  async insertHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    await this.editorHelpers.insertHeading(level);
  }

  /**
   * Insert bullet list
   */
  async insertBulletList() {
    await this.editorHelpers.insertBulletList();
  }

  /**
   * Insert numbered list
   */
  async insertNumberedList() {
    await this.editorHelpers.insertNumberedList();
  }

  /**
   * Insert task list
   */
  async insertTaskList() {
    await this.editorHelpers.insertTaskList();
  }

  /**
   * Insert code block
   */
  async insertCodeBlock() {
    await this.editorHelpers.insertCodeBlock();
  }

  /**
   * Insert link
   */
  async insertLink(url: string, text?: string) {
    await this.editorHelpers.insertLink(url, text);
  }

  /**
   * Insert image
   */
  async insertImage(imageUrl: string, alt?: string) {
    await this.editorHelpers.insertImage(imageUrl, alt);
  }

  /**
   * Upload image
   */
  async uploadImage(filePath: string) {
    await this.editorHelpers.uploadImage(filePath);
  }

  /**
   * Insert Mermaid diagram
   */
  async insertMermaidDiagram(diagramCode: string) {
    await this.editorHelpers.insertMermaidDiagram(diagramCode);
  }

  /**
   * Create article with basic content
   */
  async createArticle(article: typeof testArticles.sampleArticle) {
    await this.fillTitle(article.title);
    await this.fillExcerpt(article.excerpt);
    await this.addTags(article.tags);
    await this.setEditorContent(article.content);
    await this.setVisibility(article.published ? 'public' : 'draft');
  }

  /**
   * Verify article form
   */
  async verifyArticleForm(article: typeof testArticles.sampleArticle) {
    await expect(this.page.locator(testSelectors.editor.titleInput)).toHaveValue(article.title);
    await expect(this.page.locator('[data-testid="excerpt-input"]')).toHaveValue(article.excerpt);
    
    const tags = await this.getTags();
    expect(tags).toEqual(expect.arrayContaining(article.tags));
    
    const content = await this.getEditorContent();
    expect(content).toContain(article.content);
  }

  /**
   * Test form validation
   */
  async testFormValidation() {
    // Test empty title
    await this.fillTitle('');
    await this.page.click(testSelectors.editor.saveButton);
    await expect(this.page.locator('[data-testid="title-error"]')).toBeVisible();
    
    // Test empty content
    await this.fillTitle('Test Title');
    await this.clearEditor();
    await this.page.click(testSelectors.editor.saveButton);
    await expect(this.page.locator('[data-testid="content-error"]')).toBeVisible();
  }

  /**
   * Test auto-save functionality
   */
  async testAutoSave() {
    await this.fillTitle('Auto Save Test');
    await this.typeInEditor('This is auto-save test content');
    
    // Wait for auto-save indicator
    await this.page.waitForSelector('[data-testid="auto-save-indicator"]');
    
    // Verify auto-save success
    await expect(this.page.locator('[data-testid="auto-save-success"]')).toBeVisible();
  }

  /**
   * Test draft functionality
   */
  async testDraftFunctionality() {
    await this.createArticle(testArticles.draftArticle);
    await this.saveArticle();
    
    // Verify article is saved as draft
    await expect(this.page.locator('[data-testid="draft-indicator"]')).toBeVisible();
  }

  /**
   * Test publish functionality
   */
  async testPublishFunctionality() {
    await this.createArticle(testArticles.sampleArticle);
    await this.publishArticle();
    
    // Verify article is published
    await expect(this.page.locator('[data-testid="published-indicator"]')).toBeVisible();
  }

  /**
   * Test preview functionality
   */
  async testPreviewFunctionality() {
    await this.createArticle(testArticles.sampleArticle);
    await this.previewArticle();
    
    // Verify preview modal is open
    await expect(this.page.locator('[data-testid="preview-modal"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="preview-title"]')).toContainText(testArticles.sampleArticle.title);
    await expect(this.page.locator('[data-testid="preview-content"]')).toContainText(testArticles.sampleArticle.content);
    
    await this.closePreview();
  }

  /**
   * Test responsive design
   */
  async testResponsiveDesign() {
    // Test mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.verifyArticleForm(testArticles.sampleArticle);
    
    // Test tablet viewport
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.verifyArticleForm(testArticles.sampleArticle);
    
    // Test desktop viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
    await this.verifyArticleForm(testArticles.sampleArticle);
  }
}
