import { expect, test } from '@playwright/test';
import { AuthHelpers } from '../../utils/auth-helpers';
import { EditorPage } from '../../utils/page-objects/editor-page';
import { LoginPage } from '../../utils/page-objects/login-page';

/**
 * Complete User Journey Flow
 * Tests the entire user journey from login to article publication and viewing
 */
test.describe('Complete User Journey Flow', () => {
  test('should complete full user journey: login → create → edit → publish → view', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);
    const authHelpers = new AuthHelpers(page);

    // Step 1: Login
    await test.step('User logs in', async () => {
      await loginPage.goto();
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
      
      // Verify user is logged in
      expect(await authHelpers.isLoggedIn()).toBe(true);
    });

    // Step 2: Navigate to editor
    await test.step('User navigates to editor', async () => {
      await editorPage.goto();
      await editorPage.waitForPageLoad();
      
      // Verify we're on the editor page
      await expect(page).toHaveURL('/write');
    });

    // Step 3: Create initial article
    await test.step('User creates initial article', async () => {
      await editorPage.fillTitle('My Journey Article');
      await editorPage.fillExcerpt('This article documents my complete user journey');
      await editorPage.addTags(['journey', 'test', 'complete']);
      await editorPage.typeInEditor('This is the initial content of my article. I will be editing and improving it throughout this journey.');
      
      // Save as draft first
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    // Step 4: Edit article
    await test.step('User edits article', async () => {
      // Update title
      await editorPage.fillTitle('My Complete Journey Article');
      
      // Add more content
      await editorPage.typeInEditor('\n\nThis is additional content that I am adding to improve the article.');
      
      // Add more tags
      await editorPage.addTags(['updated', 'improved']);
      
      // Add formatting
      await editorPage.typeInEditor('\n\nThis text is ');
      await editorPage.formatBold();
      await editorPage.typeInEditor('bold');
      await editorPage.typeInEditor(' and this text is ');
      await editorPage.formatItalic();
      await editorPage.typeInEditor('italic');
      await editorPage.typeInEditor('.\n\n');
      
      // Add a list
      await editorPage.insertBulletList();
      await editorPage.typeInEditor('First improvement');
      await editorPage.typeInEditor('\n');
      await editorPage.typeInEditor('Second improvement');
      await editorPage.typeInEditor('\n');
      await editorPage.typeInEditor('Third improvement');
      
      // Save changes
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    // Step 5: Preview article
    await test.step('User previews article', async () => {
      await editorPage.previewArticle();
      
      // Verify preview modal is open
      await expect(page.locator('[data-testid="preview-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="preview-title"]')).toContainText('My Complete Journey Article');
      await expect(page.locator('[data-testid="preview-content"]')).toContainText('initial content');
      await expect(page.locator('[data-testid="preview-content"]')).toContainText('additional content');
      
      // Close preview
      await editorPage.closePreview();
      await expect(page.locator('[data-testid="preview-modal"]')).not.toBeVisible();
    });

    // Step 6: Publish article
    await test.step('User publishes article', async () => {
      await editorPage.setVisibility('public');
      await editorPage.publishArticle();
      
      // Verify publish success
      await expect(page.locator('[data-testid="publish-success"]')).toBeVisible();
      await expect(page.locator('[data-testid="published-indicator"]')).toBeVisible();
    });

    // Step 7: View published article
    await test.step('User views published article', async () => {
      // Get article ID from the editor (this would be provided by the app)
      const articleId = await page.evaluate(() => {
        return (window as any).__CURRENT_ARTICLE_ID__ || '1';
      });
      
      // Navigate to view the published article
      await page.goto(`/article/${articleId}/my-complete-journey-article`);
      
      // Verify article is displayed correctly
      await expect(page.locator('[data-testid="article-title"]')).toContainText('My Complete Journey Article');
      await expect(page.locator('[data-testid="article-content"]')).toContainText('initial content');
      await expect(page.locator('[data-testid="article-content"]')).toContainText('additional content');
      await expect(page.locator('[data-testid="article-content"]')).toContainText('<strong>bold</strong>');
      await expect(page.locator('[data-testid="article-content"]')).toContainText('<em>italic</em>');
      
      // Verify tags are displayed
      await expect(page.locator('[data-testid="tag-journey"]')).toBeVisible();
      await expect(page.locator('[data-testid="tag-test"]')).toBeVisible();
      await expect(page.locator('[data-testid="tag-complete"]')).toBeVisible();
      await expect(page.locator('[data-testid="tag-updated"]')).toBeVisible();
      await expect(page.locator('[data-testid="tag-improved"]')).toBeVisible();
    });

    // Step 8: Test article interactions
    await test.step('User interacts with published article', async () => {
      // Test like functionality
      const initialLikeCount = await page.evaluate(() => {
        const likeButton = document.querySelector('[data-testid="like-button"]');
        return likeButton?.textContent?.match(/\d+/)?.[0] || '0';
      });
      
      await page.click('[data-testid="like-button"]');
      await page.waitForTimeout(1000);
      
      // Test bookmark functionality
      await page.click('[data-testid="bookmark-button"]');
      await page.waitForTimeout(1000);
      
      // Test share functionality
      await page.click('[data-testid="share-button"]');
      await expect(page.locator('[data-testid="share-modal"]')).toBeVisible();
      await page.click('[data-testid="close-share-modal"]');
    });

    // Step 9: Edit published article
    await test.step('User edits published article', async () => {
      // Navigate back to editor
      await page.goto('/write');
      await editorPage.waitForPageLoad();
      
      // Verify we can still edit the article
      expect(await editorPage.getTitle()).toBe('My Complete Journey Article');
      
      // Make additional edits
      await editorPage.typeInEditor('\n\nThis is a final addition to complete the journey.');
      
      // Save changes
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    // Step 10: Verify complete journey
    await test.step('Verify complete journey', async () => {
      // Verify all steps were completed successfully
      const content = await editorPage.getEditorContent();
      expect(content).toContain('initial content');
      expect(content).toContain('additional content');
      expect(content).toContain('final addition');
      expect(content).toContain('<strong>bold</strong>');
      expect(content).toContain('<em>italic</em>');
      
      // Verify tags
      const tags = await editorPage.getTags();
      expect(tags).toContain('journey');
      expect(tags).toContain('test');
      expect(tags).toContain('complete');
      expect(tags).toContain('updated');
      expect(tags).toContain('improved');
      
      // Verify article is published
      expect(await editorPage.getVisibility()).toBe('public');
    });
  });

  test('should handle complete journey with error recovery', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Step 1: Login with retry
    await test.step('Login with retry', async () => {
      await loginPage.goto();
      
      // First attempt with invalid credentials
      await loginPage.loginWithInvalidCredentials();
      await loginPage.waitForLoginError();
      
      // Retry with valid credentials
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Step 2: Create article with network issues
    await test.step('Create article with network issues', async () => {
      await editorPage.goto();
      await editorPage.waitForPageLoad();
      
      // Start creating article
      await editorPage.fillTitle('Error Recovery Article');
      await editorPage.typeInEditor('This article tests error recovery.');
      
      // Simulate network error
      await page.context().setOffline(true);
      await editorPage.saveArticle();
      
      // Should show network error
      await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
      
      // Recover from network error
      await page.context().setOffline(false);
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    // Step 3: Handle validation errors
    await test.step('Handle validation errors', async () => {
      // Clear title to trigger validation error
      await editorPage.fillTitle('');
      await editorPage.saveArticle();
      
      // Should show validation error
      await expect(page.locator('[data-testid="title-error"]')).toBeVisible();
      
      // Fix validation error
      await editorPage.fillTitle('Error Recovery Article');
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    // Step 4: Complete the journey
    await test.step('Complete the journey', async () => {
      await editorPage.addTags(['error', 'recovery', 'test']);
      await editorPage.publishArticle();
      await expect(page.locator('[data-testid="publish-success"]')).toBeVisible();
    });
  });

  test('should handle complete journey across different devices', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Step 1: Login on mobile
    await test.step('Login on mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await loginPage.goto();
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Step 2: Start creating article on mobile
    await test.step('Start creating article on mobile', async () => {
      await editorPage.goto();
      await editorPage.waitForPageLoad();
      await editorPage.fillTitle('Cross-Device Article');
      await editorPage.typeInEditor('Started on mobile device.');
    });

    // Step 3: Continue on tablet
    await test.step('Continue on tablet', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      
      await editorPage.typeInEditor(' Continued on tablet device.');
      await editorPage.addTags(['cross-device', 'mobile', 'tablet']);
    });

    // Step 4: Finish on desktop
    await test.step('Finish on desktop', async () => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.waitForTimeout(500);
      
      await editorPage.typeInEditor(' Finished on desktop device.');
      await editorPage.addTags(['desktop']);
      
      // Add advanced formatting
      await editorPage.typeInEditor('\n\nThis text is ');
      await editorPage.formatBold();
      await editorPage.typeInEditor('bold');
      await editorPage.typeInEditor(' and this is ');
      await editorPage.formatItalic();
      await editorPage.typeInEditor('italic');
      await editorPage.typeInEditor('.');
    });

    // Step 5: Save and publish
    await test.step('Save and publish', async () => {
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
      
      await editorPage.publishArticle();
      await expect(page.locator('[data-testid="publish-success"]')).toBeVisible();
    });

    // Step 6: Verify content across devices
    await test.step('Verify content across devices', async () => {
      const content = await editorPage.getEditorContent();
      expect(content).toContain('mobile device');
      expect(content).toContain('tablet device');
      expect(content).toContain('desktop device');
      expect(content).toContain('<strong>bold</strong>');
      expect(content).toContain('<em>italic</em>');
      
      const tags = await editorPage.getTags();
      expect(tags).toContain('cross-device');
      expect(tags).toContain('mobile');
      expect(tags).toContain('tablet');
      expect(tags).toContain('desktop');
    });
  });
});
