import { expect, test } from '@playwright/test';
import { testUsers } from '../../fixtures/test-data';
import { AuthHelpers } from '../../utils/auth-helpers';
import { LoginPage } from '../../utils/page-objects/login-page';

/**
 * Login page E2E tests
 * Tests authentication flow, form validation, and user interactions
 */
test.describe('Login Page', () => {
  let loginPage: LoginPage;
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    authHelpers = new AuthHelpers(page);
    await loginPage.goto();
  });

  test('should display login form elements', async () => {
    await loginPage.verifyPageElements();
    await loginPage.verifyOAuthButtons();
    await loginPage.verifyNavigationLinks();
  });

  test('should login with valid credentials', async () => {
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();
    
    // Verify user is logged in
    expect(await authHelpers.isLoggedIn()).toBe(true);
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.loginWithInvalidCredentials();
    await loginPage.waitForLoginError();
    
    // Verify error message is displayed
    expect(await loginPage.hasErrorMessage()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });

  test('should validate form fields', async () => {
    await loginPage.testFormValidation();
  });

  test('should handle empty form submission', async () => {
    await loginPage.clickSubmit();
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should handle invalid email format', async () => {
    await loginPage.fillEmail('invalid-email');
    await loginPage.fillPassword('password');
    await loginPage.clickSubmit();
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should handle empty password', async () => {
    await loginPage.fillEmail('test@example.com');
    await loginPage.clickSubmit();
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should navigate to register page', async () => {
    await loginPage.clickRegister();
    await expect(page).toHaveURL('/auth/register');
  });

  test('should navigate to forgot password page', async () => {
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL('/auth/forgot-password');
  });

  test('should handle OAuth login buttons', async () => {
    // Test Google login button
    await loginPage.clickGoogleLogin();
    // Note: In real tests, you might need to handle OAuth popup
    
    // Test GitHub login button
    await loginPage.clickGithubLogin();
    
    // Test X login button
    await loginPage.clickXLogin();
  });

  test('should handle OTP login', async () => {
    await loginPage.clickOTPLogin();
    await expect(page.locator('[data-testid="otp-form"]')).toBeVisible();
  });

  test('should be responsive on mobile', async () => {
    await loginPage.testResponsiveDesign();
  });

  test('should be responsive on tablet', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginPage.verifyPageElements();
  });

  test('should be responsive on desktop', async () => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await loginPage.verifyPageElements();
  });

  test('should clear form when navigating back', async () => {
    await loginPage.fillEmail('test@example.com');
    await loginPage.fillPassword('password');
    
    // Navigate away and back
    await page.goto('/');
    await loginPage.goto();
    
    // Verify form is cleared
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="password-input"]')).toHaveValue('');
  });

  test('should show loading state during login', async () => {
    await loginPage.fillEmail(testUsers.validUser.email);
    await loginPage.fillPassword(testUsers.validUser.password);
    
    // Click submit and check loading state
    await loginPage.clickSubmit();
    expect(await loginPage.isSubmitButtonLoading()).toBe(true);
  });

  test('should disable submit button when form is invalid', async () => {
    await loginPage.fillEmail('invalid-email');
    await loginPage.fillPassword('password');
    
    expect(await loginPage.isSubmitButtonEnabled()).toBe(false);
  });

  test('should enable submit button when form is valid', async () => {
    await loginPage.fillEmail(testUsers.validUser.email);
    await loginPage.fillPassword(testUsers.validUser.password);
    
    expect(await loginPage.isSubmitButtonEnabled()).toBe(true);
  });
});

/**
 * Login integration tests
 */
test.describe('Login Integration', () => {
  test('should redirect to intended page after login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/write');
    
    // Should be redirected to login
    await expect(page).toHaveURL('/auth/login');
    
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.loginWithValidUser();
    
    // Should be redirected back to intended page
    await expect(page).toHaveURL('/write');
  });

  test('should maintain login state across page reloads', async ({ page }) => {
    const authHelpers = new AuthHelpers(page);
    const loginPage = new LoginPage(page);
    
    // Login
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();
    
    // Reload page
    await page.reload();
    
    // Should still be logged in
    expect(await authHelpers.isLoggedIn()).toBe(true);
  });

  test('should logout and redirect to home', async ({ page }) => {
    const authHelpers = new AuthHelpers(page);
    const loginPage = new LoginPage(page);
    
    // Login first
    await loginPage.goto();
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();
    
    // Logout
    await authHelpers.logout();
    
    // Should be logged out
    expect(await authHelpers.isLoggedOut()).toBe(true);
  });
});
