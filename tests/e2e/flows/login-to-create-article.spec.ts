import { expect, test } from '@playwright/test';
import { testArticles } from '../../fixtures/test-data';
import { AuthHelpers } from '../../utils/auth-helpers';
import { EditorPage } from '../../utils/page-objects/editor-page';
import { LoginPage } from '../../utils/page-objects/login-page';

/**
 * Complete user flow: Login → Create Article
 * Tests the entire user journey from authentication to content creation
 */
test.describe('Complete User Flow: Login to Create Article', () => {
  let loginPage: LoginPage;
  let editorPage: EditorPage;
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    editorPage = new EditorPage(page);
    authHelpers = new AuthHelpers(page);
  });

  test('should complete full flow: login → navigate to editor → create article → save', async ({ page }) => {
    // Step 1: Navigate to login page
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyPageElements();
    });

    // Step 2: Login with valid credentials
    await test.step('Login with valid user', async () => {
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
      
      // Verify user is logged in
      expect(await authHelpers.isLoggedIn()).toBe(true);
    });

    // Step 3: Navigate to article editor
    await test.step('Navigate to article editor', async () => {
      await editorPage.goto();
      await editorPage.waitForPageLoad();
      
      // Verify we're on the editor page
      await expect(page).toHaveURL('/write');
    });

    // Step 4: Create article with sample content
    await test.step('Create article with sample content', async () => {
      await editorPage.createArticle(testArticles.sampleArticle);
      
      // Verify article form is filled correctly
      await editorPage.verifyArticleForm(testArticles.sampleArticle);
    });

    // Step 5: Save article as draft
    await test.step('Save article as draft', async () => {
      await editorPage.saveArticle();
      
      // Verify save success
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    // Step 6: Verify article is saved
    await test.step('Verify article is saved', async () => {
      // Check that we're still on the editor page
      await expect(page).toHaveURL('/write');
      
      // Verify draft indicator is shown
      await expect(page.locator('[data-testid="draft-indicator"]')).toBeVisible();
    });
  });

  test('should complete flow: login → create article → publish', async ({ page }) => {
    // Step 1: Login
    await test.step('Login with valid user', async () => {
      await loginPage.goto();
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Step 2: Navigate to editor
    await test.step('Navigate to editor', async () => {
      await editorPage.goto();
      await editorPage.waitForPageLoad();
    });

    // Step 3: Create article
    await test.step('Create article', async () => {
      await editorPage.createArticle(testArticles.sampleArticle);
    });

    // Step 4: Publish article
    await test.step('Publish article', async () => {
      await editorPage.publishArticle();
      
      // Verify publish success
      await expect(page.locator('[data-testid="publish-success"]')).toBeVisible();
    });

    // Step 5: Verify article is published
    await test.step('Verify article is published', async () => {
      // Verify published indicator
      await expect(page.locator('[data-testid="published-indicator"]')).toBeVisible();
    });
  });

  test('should complete flow: login → create rich content article', async ({ page }) => {
    // Step 1: Login
    await test.step('Login with valid user', async () => {
      await loginPage.goto();
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Step 2: Navigate to editor
    await test.step('Navigate to editor', async () => {
      await editorPage.goto();
      await editorPage.waitForPageLoad();
    });

    // Step 3: Create article with rich content
    await test.step('Create article with rich content', async () => {
      await editorPage.fillTitle(testArticles.longArticle.title);
      await editorPage.fillExcerpt(testArticles.longArticle.excerpt);
      await editorPage.addTags(testArticles.longArticle.tags);
    });

    // Step 4: Add rich text content
    await test.step('Add rich text content', async () => {
      // Set the markdown content
      await editorPage.setEditorMarkdown(testArticles.longArticle.content);
      
      // Verify content is set
      const content = await editorPage.getEditorContent();
      expect(content).toContain('Long Test Article');
    });

    // Step 5: Test rich text formatting
    await test.step('Test rich text formatting', async () => {
      // Test bold formatting
      await editorPage.typeInEditor(' Bold text');
      await editorPage.selectAllText();
      await editorPage.formatBold();
      await expect(page.locator('strong')).toContainText('Bold text');
      
      // Test italic formatting
      await editorPage.typeInEditor(' Italic text');
      await editorPage.selectAllText();
      await editorPage.formatItalic();
      await expect(page.locator('em')).toContainText('Italic text');
    });

    // Step 6: Add code block
    await test.step('Add code block', async () => {
      await editorPage.insertCodeBlock();
      await editorPage.typeInEditor('console.log("Hello, World!");');
      
      // Verify code block is created
      await expect(page.locator('pre code')).toContainText('console.log("Hello, World!");');
    });

    // Step 7: Add Mermaid diagram
    await test.step('Add Mermaid diagram', async () => {
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

    // Step 8: Save article
    await test.step('Save article', async () => {
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });
  });

  test('should complete flow: login → create article → preview → publish', async ({ page }) => {
    // Step 1: Login
    await test.step('Login with valid user', async () => {
      await loginPage.goto();
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Step 2: Navigate to editor
    await test.step('Navigate to editor', async () => {
      await editorPage.goto();
      await editorPage.waitForPageLoad();
    });

    // Step 3: Create article
    await test.step('Create article', async () => {
      await editorPage.createArticle(testArticles.sampleArticle);
    });

    // Step 4: Preview article
    await test.step('Preview article', async () => {
      await editorPage.previewArticle();
      
      // Verify preview modal is open
      await expect(page.locator('[data-testid="preview-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="preview-title"]')).toContainText(testArticles.sampleArticle.title);
      await expect(page.locator('[data-testid="preview-content"]')).toContainText(testArticles.sampleArticle.content);
    });

    // Step 5: Close preview
    await test.step('Close preview', async () => {
      await editorPage.closePreview();
      
      // Verify preview is closed
      await expect(page.locator('[data-testid="preview-modal"]')).not.toBeVisible();
    });

    // Step 6: Publish article
    await test.step('Publish article', async () => {
      await editorPage.publishArticle();
      await expect(page.locator('[data-testid="publish-success"]')).toBeVisible();
    });
  });

  test('should handle flow with invalid login → redirect to login → retry', async ({ page }) => {
    // Step 1: Try to access protected route without login
    await test.step('Try to access protected route', async () => {
      await page.goto('/write');
      
      // Should be redirected to login
      await expect(page).toHaveURL('/auth/login');
    });

    // Step 2: Attempt login with invalid credentials
    await test.step('Attempt login with invalid credentials', async () => {
      await loginPage.loginWithInvalidCredentials();
      await loginPage.waitForLoginError();
      
      // Verify error message
      expect(await loginPage.hasErrorMessage()).toBe(true);
    });

    // Step 3: Retry with valid credentials
    await test.step('Retry with valid credentials', async () => {
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Step 4: Verify access to editor
    await test.step('Verify access to editor', async () => {
      await expect(page).toHaveURL('/write');
      await editorPage.waitForPageLoad();
    });

    // Step 5: Create article
    await test.step('Create article', async () => {
      await editorPage.createArticle(testArticles.sampleArticle);
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });
  });

  test('should complete flow: login → create article → edit → save changes', async ({ page }) => {
    // Step 1: Login
    await test.step('Login with valid user', async () => {
      await loginPage.goto();
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Step 2: Create initial article
    await test.step('Create initial article', async () => {
      await editorPage.goto();
      await editorPage.createArticle(testArticles.sampleArticle);
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    // Step 3: Edit article content
    await test.step('Edit article content', async () => {
      // Update title
      await editorPage.fillTitle('Updated Article Title');
      
      // Update content
      await editorPage.clearEditor();
      await editorPage.typeInEditor('This is updated content with new information.');
      
      // Add more tags
      await editorPage.addTags(['updated', 'modified']);
    });

    // Step 4: Save changes
    await test.step('Save changes', async () => {
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    // Step 5: Verify changes are saved
    await test.step('Verify changes are saved', async () => {
      // Verify updated title
      expect(await editorPage.getTitle()).toBe('Updated Article Title');
      
      // Verify updated content
      const content = await editorPage.getEditorContent();
      expect(content).toContain('updated content');
      
      // Verify updated tags
      const tags = await editorPage.getTags();
      expect(tags).toContain('updated');
      expect(tags).toContain('modified');
    });
  });

  test('should complete flow: login → create article → test responsive design', async ({ page }) => {
    // Step 1: Login
    await test.step('Login with valid user', async () => {
      await loginPage.goto();
      await loginPage.loginWithValidUser();
      await loginPage.waitForLoginSuccess();
    });

    // Step 2: Test responsive design on different viewports
    await test.step('Test mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await editorPage.goto();
      await editorPage.createArticle(testArticles.sampleArticle);
      await editorPage.verifyArticleForm(testArticles.sampleArticle);
    });

    await test.step('Test tablet viewport', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await editorPage.verifyArticleForm(testArticles.sampleArticle);
    });

    await test.step('Test desktop viewport', async () => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await editorPage.verifyArticleForm(testArticles.sampleArticle);
    });

    // Step 3: Save article
    await test.step('Save article', async () => {
      await editorPage.saveArticle();
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });
  });
});
