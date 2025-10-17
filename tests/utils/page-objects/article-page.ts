import { Page, expect } from '@playwright/test';
import { testArticles, testSelectors } from '../../fixtures/test-data';

/**
 * Article page object for E2E tests
 * Encapsulates article page interactions and assertions
 */
export class ArticlePage {
  constructor(private page: Page) {}

  /**
   * Navigate to article page
   */
  async goto(articleId: string, slug: string) {
    await this.page.goto(`/article/${articleId}/${slug}`);
    await this.waitForPageLoad();
  }

  /**
   * Wait for article page to load
   */
  async waitForPageLoad() {
    await this.page.waitForSelector(testSelectors.article.title);
    await this.page.waitForSelector(testSelectors.article.content);
  }

  /**
   * Get article title
   */
  async getTitle(): Promise<string> {
    const titleElement = this.page.locator(testSelectors.article.title);
    return await titleElement.textContent() || '';
  }

  /**
   * Get article content
   */
  async getContent(): Promise<string> {
    const contentElement = this.page.locator(testSelectors.article.content);
    return await contentElement.textContent() || '';
  }

  /**
   * Get article excerpt
   */
  async getExcerpt(): Promise<string> {
    const excerptElement = this.page.locator('[data-testid="article-excerpt"]');
    return await excerptElement.textContent() || '';
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
   * Get article author
   */
  async getAuthor(): Promise<string> {
    const authorElement = this.page.locator('[data-testid="article-author"]');
    return await authorElement.textContent() || '';
  }

  /**
   * Get article publish date
   */
  async getPublishDate(): Promise<string> {
    const dateElement = this.page.locator('[data-testid="article-publish-date"]');
    return await dateElement.textContent() || '';
  }

  /**
   * Get article read time
   */
  async getReadTime(): Promise<string> {
    const readTimeElement = this.page.locator('[data-testid="article-read-time"]');
    return await readTimeElement.textContent() || '';
  }

  /**
   * Get like count
   */
  async getLikeCount(): Promise<number> {
    const likeButton = this.page.locator(testSelectors.article.likeButton);
    const likeText = await likeButton.textContent() || '0';
    return parseInt(likeText.replace(/\D/g, '')) || 0;
  }

  /**
   * Click like button
   */
  async clickLike() {
    await this.page.click(testSelectors.article.likeButton);
  }

  /**
   * Check if article is liked
   */
  async isLiked(): Promise<boolean> {
    const likeButton = this.page.locator(testSelectors.article.likeButton);
    return await likeButton.evaluate((el: HTMLElement) => 
      el.classList.contains('liked') || el.getAttribute('data-liked') === 'true'
    );
  }

  /**
   * Click edit button
   */
  async clickEdit() {
    await this.page.click(testSelectors.article.editButton);
  }

  /**
   * Click delete button
   */
  async clickDelete() {
    await this.page.click(testSelectors.article.deleteButton);
  }

  /**
   * Confirm delete
   */
  async confirmDelete() {
    await this.page.click('[data-testid="confirm-delete-button"]');
  }

  /**
   * Cancel delete
   */
  async cancelDelete() {
    await this.page.click('[data-testid="cancel-delete-button"]');
  }

  /**
   * Check if edit button is visible
   */
  async canEdit(): Promise<boolean> {
    try {
      await this.page.waitForSelector(testSelectors.article.editButton, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if delete button is visible
   */
  async canDelete(): Promise<boolean> {
    try {
      await this.page.waitForSelector(testSelectors.article.deleteButton, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Share article
   */
  async shareArticle() {
    await this.page.click('[data-testid="share-button"]');
  }

  /**
   * Copy article link
   */
  async copyArticleLink() {
    await this.page.click('[data-testid="copy-link-button"]');
  }

  /**
   * Print article
   */
  async printArticle() {
    await this.page.click('[data-testid="print-button"]');
  }

  /**
   * Bookmark article
   */
  async bookmarkArticle() {
    await this.page.click('[data-testid="bookmark-button"]');
  }

  /**
   * Check if article is bookmarked
   */
  async isBookmarked(): Promise<boolean> {
    const bookmarkButton = this.page.locator('[data-testid="bookmark-button"]');
    return await bookmarkButton.evaluate((el: HTMLElement) => 
      el.classList.contains('bookmarked') || el.getAttribute('data-bookmarked') === 'true'
    );
  }

  /**
   * Navigate to author profile
   */
  async goToAuthorProfile() {
    await this.page.click('[data-testid="author-profile-link"]');
  }

  /**
   * Navigate to tag page
   */
  async goToTag(tag: string) {
    await this.page.click(`[data-testid="tag-${tag}"]`);
  }

  /**
   * Scroll to comments section
   */
  async scrollToComments() {
    await this.page.click('[data-testid="comments-section"]');
    await this.page.locator('[data-testid="comments-section"]').scrollIntoViewIfNeeded();
  }

  /**
   * Add comment
   */
  async addComment(comment: string) {
    await this.page.fill('[data-testid="comment-input"]', comment);
    await this.page.click('[data-testid="submit-comment-button"]');
  }

  /**
   * Get comments count
   */
  async getCommentsCount(): Promise<number> {
    const commentsElement = this.page.locator('[data-testid="comments-count"]');
    const countText = await commentsElement.textContent() || '0';
    return parseInt(countText.replace(/\D/g, '')) || 0;
  }

  /**
   * Verify article content
   */
  async verifyArticleContent(article: typeof testArticles.sampleArticle) {
    await expect(this.page.locator(testSelectors.article.title)).toContainText(article.title);
    await expect(this.page.locator(testSelectors.article.content)).toContainText(article.content);
    
    if (article.excerpt) {
      await expect(this.page.locator('[data-testid="article-excerpt"]')).toContainText(article.excerpt);
    }
    
    if (article.tags && article.tags.length > 0) {
      for (const tag of article.tags) {
        await expect(this.page.locator(`[data-testid="tag-${tag}"]`)).toBeVisible();
      }
    }
  }

  /**
   * Verify article metadata
   */
  async verifyArticleMetadata() {
    await expect(this.page.locator('[data-testid="article-author"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="article-publish-date"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="article-read-time"]')).toBeVisible();
  }

  /**
   * Verify article actions
   */
  async verifyArticleActions() {
    await expect(this.page.locator(testSelectors.article.likeButton)).toBeVisible();
    await expect(this.page.locator('[data-testid="share-button"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="bookmark-button"]')).toBeVisible();
  }

  /**
   * Test responsive design
   */
  async testResponsiveDesign() {
    // Test mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.verifyArticleContent(testArticles.sampleArticle);
    
    // Test tablet viewport
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.verifyArticleContent(testArticles.sampleArticle);
    
    // Test desktop viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
    await this.verifyArticleContent(testArticles.sampleArticle);
  }

  /**
   * Test article interactions
   */
  async testArticleInteractions() {
    // Test like functionality
    const initialLikeCount = await this.getLikeCount();
    await this.clickLike();
    await this.page.waitForTimeout(1000); // Wait for API call
    const newLikeCount = await this.getLikeCount();
    expect(newLikeCount).toBeGreaterThanOrEqual(initialLikeCount);
    
    // Test bookmark functionality
    const initialBookmarkState = await this.isBookmarked();
    await this.bookmarkArticle();
    await this.page.waitForTimeout(1000); // Wait for API call
    const newBookmarkState = await this.isBookmarked();
    expect(newBookmarkState).not.toBe(initialBookmarkState);
  }
}
