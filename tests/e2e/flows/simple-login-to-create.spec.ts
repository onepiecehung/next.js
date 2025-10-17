import { expect, test } from '@playwright/test';
import { testArticles } from '../../fixtures/test-data';
import { AuthHelpers } from '../../utils/auth-helpers';
import { EditorPage } from '../../utils/page-objects/editor-page';
import { LoginPage } from '../../utils/page-objects/login-page';

/**
 * Simple Login to Create Article Flow
 * A streamlined test for the most common user journey
 */
test.describe('Simple Login to Create Article Flow', () => {
  test('should login and create a basic article', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);
    const authHelpers = new AuthHelpers(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Create article
    await editorPage.fillTitle('My First Article');
    await editorPage.fillExcerpt('This is my first article created through E2E testing');
    await editorPage.addTags(['test', 'e2e', 'first']);
    await editorPage.typeInEditor('This is the content of my first article. It contains some basic text to test the editor functionality.');

    // Save article
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();

    // Verify article is saved
    expect(await editorPage.getTitle()).toBe('My First Article');
    expect(await editorPage.getExcerpt()).toBe('This is my first article created through E2E testing');
    
    const tags = await editorPage.getTags();
    expect(tags).toContain('test');
    expect(tags).toContain('e2e');
    expect(tags).toContain('first');
  });

  test('should login and publish an article', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Create and publish article
    await editorPage.fillTitle('Published Article');
    await editorPage.fillExcerpt('This article will be published');
    await editorPage.addTags(['published', 'public']);
    await editorPage.typeInEditor('This article is ready to be published and shared with the world!');
    await editorPage.setVisibility('public');

    // Publish article
    await editorPage.publishArticle();
    await expect(page.locator('[data-testid="publish-success"]')).toBeVisible();

    // Verify article is published
    await expect(page.locator('[data-testid="published-indicator"]')).toBeVisible();
  });
});

/**
 * Error Handling Flow Tests
 * Tests various error scenarios in the login to create article flow
 */
test.describe('Error Handling in Login to Create Article Flow', () => {
  test('should handle login failure and retry successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Attempt login with invalid credentials
    await loginPage.goto();
    await loginPage.loginWithInvalidCredentials();
    await loginPage.waitForLoginError();

    // Retry with valid credentials
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Proceed to create article
    await editorPage.goto();
    await editorPage.createArticle(testArticles.sampleArticle);
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });

  test('should handle network errors during article creation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login successfully
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Simulate network error by going offline
    await page.context().setOffline(true);

    // Try to create article (should fail)
    await editorPage.fillTitle('Network Error Test');
    await editorPage.typeInEditor('This should fail due to network error');
    await editorPage.saveArticle();

    // Should show network error
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible();

    // Go back online
    await page.context().setOffline(false);

    // Retry saving
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });

  test('should handle validation errors in article creation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Try to save empty article (should show validation errors)
    await editorPage.fillTitle(''); // Empty title
    await editorPage.clearEditor(); // Empty content
    await editorPage.saveArticle();

    // Should show validation errors
    await expect(page.locator('[data-testid="title-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="content-error"]')).toBeVisible();

    // Fix validation errors
    await editorPage.fillTitle('Valid Title');
    await editorPage.typeInEditor('Valid content');
    await editorPage.saveArticle();

    // Should save successfully
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });
});

/**
 * Performance Flow Tests
 * Tests the login to create article flow under various performance conditions
 */
test.describe('Performance in Login to Create Article Flow', () => {
  test('should complete flow within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Create article
    await editorPage.createArticle(testArticles.sampleArticle);
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within 30 seconds
    expect(duration).toBeLessThan(30000);
    console.log(`Flow completed in ${duration}ms`);
  });

  test('should handle slow network conditions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Simulate slow network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000); // 1 second delay
    });

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Navigate to editor
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Create article
    await editorPage.createArticle(testArticles.sampleArticle);
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });
});
