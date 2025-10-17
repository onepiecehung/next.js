import { expect, test } from '@playwright/test';
import { testArticles } from '../../fixtures/test-data';
import { EditorPage } from '../../utils/page-objects/editor-page';
import { LoginPage } from '../../utils/page-objects/login-page';

/**
 * Responsive Design Flow Tests
 * Tests the login to create article flow across different device sizes
 */
test.describe('Responsive Design Flow Tests', () => {
  test('should complete flow on mobile device', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login on mobile
    await test.step('Login on mobile', async () => {
      await loginPage.goto();
      await loginPage.verifyPageElements();
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Navigate to editor on mobile
    await test.step('Navigate to editor on mobile', async () => {
      await editorPage.goto();
      await editorPage.waitForPageLoad();
      
      // Verify mobile layout
      await expect(page.locator('[data-testid="mobile-editor-layout"]')).toBeVisible();
    });

    // Create article on mobile
    await test.step('Create article on mobile', async () => {
      await editorPage.fillTitle('Mobile Article');
      await editorPage.fillExcerpt('Created on mobile device');
      await editorPage.addTags(['mobile', 'responsive']);
      await editorPage.typeInEditor('This article was created on a mobile device to test responsive design.');
    });

    // Save article on mobile
    await test.step('Save article on mobile', async () => {
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    // Verify mobile-specific features
    await test.step('Verify mobile features', async () => {
      // Check if mobile menu is accessible
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
      
      // Check if touch targets are appropriate size
      const saveButton = page.locator('[data-testid="save-button"]');
      const buttonBox = await saveButton.boundingBox();
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44); // Minimum touch target size
    });
  });

  test('should complete flow on tablet device', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login on tablet
    await test.step('Login on tablet', async () => {
      await loginPage.goto();
      await loginPage.verifyPageElements();
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Navigate to editor on tablet
    await test.step('Navigate to editor on tablet', async () => {
      await editorPage.goto();
      await editorPage.waitForPageLoad();
      
      // Verify tablet layout
      await expect(page.locator('[data-testid="tablet-editor-layout"]')).toBeVisible();
    });

    // Create article on tablet
    await test.step('Create article on tablet', async () => {
      await editorPage.fillTitle('Tablet Article');
      await editorPage.fillExcerpt('Created on tablet device');
      await editorPage.addTags(['tablet', 'responsive']);
      await editorPage.typeInEditor('This article was created on a tablet device to test responsive design.');
    });

    // Test tablet-specific features
    await test.step('Test tablet features', async () => {
      // Test landscape orientation
      await page.setViewportSize({ width: 1024, height: 768 });
      await editorPage.verifyArticleForm(testArticles.sampleArticle);
      
      // Test portrait orientation
      await page.setViewportSize({ width: 768, height: 1024 });
      await editorPage.verifyArticleForm(testArticles.sampleArticle);
    });

    // Save article on tablet
    await test.step('Save article on tablet', async () => {
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });
  });

  test('should complete flow on desktop device', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login on desktop
    await test.step('Login on desktop', async () => {
      await loginPage.goto();
      await loginPage.verifyPageElements();
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Navigate to editor on desktop
    await test.step('Navigate to editor on desktop', async () => {
      await editorPage.goto();
      await editorPage.waitForPageLoad();
      
      // Verify desktop layout
      await expect(page.locator('[data-testid="desktop-editor-layout"]')).toBeVisible();
    });

    // Create article on desktop
    await test.step('Create article on desktop', async () => {
      await editorPage.fillTitle('Desktop Article');
      await editorPage.fillExcerpt('Created on desktop device');
      await editorPage.addTags(['desktop', 'responsive']);
      await editorPage.typeInEditor('This article was created on a desktop device to test responsive design.');
    });

    // Test desktop-specific features
    await test.step('Test desktop features', async () => {
      // Test keyboard shortcuts
      await editorPage.typeInEditor(' Testing keyboard shortcuts: ');
      await page.keyboard.press('Control+b'); // Bold
      await editorPage.typeInEditor('bold text');
      await page.keyboard.press('Control+b'); // Unbold
      
      // Test mouse interactions
      await editorPage.typeInEditor(' Testing mouse interactions.');
      await page.hover('[data-testid="bold-button"]');
      await expect(page.locator('[data-testid="tooltip-bold"]')).toBeVisible();
    });

    // Save article on desktop
    await test.step('Save article on desktop', async () => {
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });
  });

  test('should handle orientation changes during article creation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Start in portrait mode
    await page.setViewportSize({ width: 375, height: 667 });
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Start creating article
    await editorPage.fillTitle('Orientation Test Article');
    await editorPage.typeInEditor('This article tests orientation changes.');

    // Switch to landscape mode
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500); // Wait for layout adjustment

    // Continue editing
    await editorPage.typeInEditor(' Now in landscape mode.');
    await editorPage.addTags(['orientation', 'test']);

    // Switch back to portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Wait for layout adjustment

    // Finish editing
    await editorPage.typeInEditor(' Back to portrait mode.');

    // Save article
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();

    // Verify content is preserved across orientation changes
    const content = await editorPage.getEditorContent();
    expect(content).toContain('orientation changes');
    expect(content).toContain('landscape mode');
    expect(content).toContain('portrait mode');
  });

  test('should handle responsive navigation during article creation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Test mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Navigate to settings
    await page.click('[data-testid="mobile-menu-settings"]');
    await expect(page).toHaveURL('/settings');

    // Go back to editor
    await page.goto('/write');
    await editorPage.waitForPageLoad();

    // Continue creating article
    await editorPage.fillTitle('Navigation Test Article');
    await editorPage.typeInEditor('This article tests responsive navigation.');

    // Test tablet navigation
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    // Verify tablet navigation is visible
    await expect(page.locator('[data-testid="tablet-navigation"]')).toBeVisible();

    // Test desktop navigation
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);

    // Verify desktop navigation is visible
    await expect(page.locator('[data-testid="desktop-navigation"]')).toBeVisible();

    // Save article
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });

  test('should handle responsive editor toolbar', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const editorPage = new EditorPage(page);

    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();

    // Test mobile toolbar
    await page.setViewportSize({ width: 375, height: 667 });
    await editorPage.goto();
    await editorPage.waitForPageLoad();

    // Verify mobile toolbar
    await expect(page.locator('[data-testid="mobile-toolbar"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-toolbar-more"]')).toBeVisible();

    // Open mobile toolbar more options
    await page.click('[data-testid="mobile-toolbar-more"]');
    await expect(page.locator('[data-testid="mobile-toolbar-dropdown"]')).toBeVisible();

    // Test formatting in mobile toolbar
    await editorPage.typeInEditor('Mobile formatting test');
    await editorPage.selectAllText();
    await page.click('[data-testid="mobile-bold-button"]');
    await expect(page.locator('strong')).toContainText('Mobile formatting test');

    // Test tablet toolbar
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    // Verify tablet toolbar
    await expect(page.locator('[data-testid="tablet-toolbar"]')).toBeVisible();

    // Test desktop toolbar
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);

    // Verify desktop toolbar
    await expect(page.locator('[data-testid="desktop-toolbar"]')).toBeVisible();

    // Test all formatting options on desktop
    await editorPage.typeInEditor(' Desktop formatting test');
    await editorPage.selectAllText();
    await editorPage.formatBold();
    await editorPage.formatItalic();
    await editorPage.insertBulletList();
    await editorPage.insertNumberedList();

    // Save article
    await editorPage.saveArticle();
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
  });
});
