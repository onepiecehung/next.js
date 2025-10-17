import { Page, expect } from '@playwright/test';
import { testSelectors, testUsers } from '../../fixtures/test-data';

/**
 * Login page object for E2E tests
 * Encapsulates login page interactions and assertions
 */
export class LoginPage {
  constructor(private page: Page) {}

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/auth/login');
    await this.waitForPageLoad();
  }

  /**
   * Wait for login page to load
   */
  async waitForPageLoad() {
    await this.page.waitForSelector(testSelectors.loginForm.emailInput);
    await this.page.waitForSelector(testSelectors.loginForm.passwordInput);
    await this.page.waitForSelector(testSelectors.loginForm.submitButton);
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string) {
    await this.page.fill(testSelectors.loginForm.emailInput, email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string) {
    await this.page.fill(testSelectors.loginForm.passwordInput, password);
  }

  /**
   * Click submit button
   */
  async clickSubmit() {
    await this.page.click(testSelectors.loginForm.submitButton);
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  /**
   * Login with valid test user
   */
  async loginWithValidUser() {
    await this.login(testUsers.validUser.email, testUsers.validUser.password);
  }

  /**
   * Login with admin user
   */
  async loginWithAdminUser() {
    await this.login(testUsers.adminUser.email, testUsers.adminUser.password);
  }

  /**
   * Login with invalid credentials
   */
  async loginWithInvalidCredentials() {
    await this.login(testUsers.invalidUser.email, testUsers.invalidUser.password);
  }

  /**
   * Check if error message is visible
   */
  async hasErrorMessage(): Promise<boolean> {
    try {
      await this.page.waitForSelector(testSelectors.loginForm.errorMessage, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    const errorElement = this.page.locator(testSelectors.loginForm.errorMessage);
    return await errorElement.textContent() || '';
  }

  /**
   * Check if form is valid
   */
  async isFormValid(): Promise<boolean> {
    const emailInput = this.page.locator(testSelectors.loginForm.emailInput);
    const passwordInput = this.page.locator(testSelectors.loginForm.passwordInput);
    
    const emailValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    const passwordValid = await passwordInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    
    return emailValid && passwordValid;
  }

  /**
   * Check if submit button is enabled
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    const submitButton = this.page.locator(testSelectors.loginForm.submitButton);
    return await submitButton.isEnabled();
  }

  /**
   * Check if submit button is loading
   */
  async isSubmitButtonLoading(): Promise<boolean> {
    const submitButton = this.page.locator(testSelectors.loginForm.submitButton);
    const isLoading = await submitButton.evaluate((el: HTMLButtonElement) => 
      el.disabled || el.textContent?.includes('Loading') || false
    );
    return isLoading;
  }

  /**
   * Wait for login success (redirect)
   */
  async waitForLoginSuccess() {
    // Wait for redirect to home page
    await this.page.waitForURL('/');
    
    // Verify user menu is visible (indicating successful login)
    await expect(this.page.locator(testSelectors.navigation.userMenu)).toBeVisible();
  }

  /**
   * Wait for login error
   */
  async waitForLoginError() {
    await this.page.waitForSelector(testSelectors.loginForm.errorMessage);
  }

  /**
   * Clear form
   */
  async clearForm() {
    await this.page.fill(testSelectors.loginForm.emailInput, '');
    await this.page.fill(testSelectors.loginForm.passwordInput, '');
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.page.click('[data-testid="forgot-password-link"]');
  }

  /**
   * Click register link
   */
  async clickRegister() {
    await this.page.click('[data-testid="register-link"]');
  }

  /**
   * Click OAuth login button
   */
  async clickGoogleLogin() {
    await this.page.click('[data-testid="google-login-button"]');
  }

  /**
   * Click GitHub login button
   */
  async clickGithubLogin() {
    await this.page.click('[data-testid="github-login-button"]');
  }

  /**
   * Click X (Twitter) login button
   */
  async clickXLogin() {
    await this.page.click('[data-testid="x-login-button"]');
  }

  /**
   * Click OTP login button
   */
  async clickOTPLogin() {
    await this.page.click('[data-testid="otp-login-button"]');
  }

  /**
   * Verify page elements are present
   */
  async verifyPageElements() {
    await expect(this.page.locator(testSelectors.loginForm.emailInput)).toBeVisible();
    await expect(this.page.locator(testSelectors.loginForm.passwordInput)).toBeVisible();
    await expect(this.page.locator(testSelectors.loginForm.submitButton)).toBeVisible();
  }

  /**
   * Verify OAuth buttons are present
   */
  async verifyOAuthButtons() {
    await expect(this.page.locator('[data-testid="google-login-button"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="github-login-button"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="x-login-button"]')).toBeVisible();
  }

  /**
   * Verify navigation links are present
   */
  async verifyNavigationLinks() {
    await expect(this.page.locator('[data-testid="forgot-password-link"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="register-link"]')).toBeVisible();
  }

  /**
   * Test form validation
   */
  async testFormValidation() {
    // Test empty form submission
    await this.clickSubmit();
    await expect(this.page.locator(testSelectors.loginForm.errorMessage)).toBeVisible();
    
    // Test invalid email format
    await this.fillEmail('invalid-email');
    await this.fillPassword('password');
    await this.clickSubmit();
    await expect(this.page.locator(testSelectors.loginForm.errorMessage)).toBeVisible();
    
    // Test empty password
    await this.clearForm();
    await this.fillEmail('test@example.com');
    await this.clickSubmit();
    await expect(this.page.locator(testSelectors.loginForm.errorMessage)).toBeVisible();
  }

  /**
   * Test responsive design
   */
  async testResponsiveDesign() {
    // Test mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.verifyPageElements();
    
    // Test tablet viewport
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.verifyPageElements();
    
    // Test desktop viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
    await this.verifyPageElements();
  }
}
