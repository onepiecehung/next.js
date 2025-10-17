import { Page, expect } from '@playwright/test';
import { testSelectors, testUrls, testUsers } from '../fixtures/test-data';

/**
 * Authentication helper functions for E2E tests
 * Provides reusable methods for login, logout, and auth state management
 */
export class AuthHelpers {
  constructor(private page: Page) {}

  /**
   * Login with email and password
   */
  async loginWithEmailPassword(email: string, password: string) {
    await this.page.goto(testUrls.login);
    
    // Wait for login form to be visible
    await this.page.waitForSelector(testSelectors.loginForm.emailInput);
    
    // Fill in credentials
    await this.page.fill(testSelectors.loginForm.emailInput, email);
    await this.page.fill(testSelectors.loginForm.passwordInput, password);
    
    // Submit form
    await this.page.click(testSelectors.loginForm.submitButton);
    
    // Wait for navigation or success indicator
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login with valid test user
   */
  async loginWithValidUser() {
    await this.loginWithEmailPassword(
      testUsers.validUser.email,
      testUsers.validUser.password
    );
  }

  /**
   * Login with admin user
   */
  async loginWithAdminUser() {
    await this.loginWithEmailPassword(
      testUsers.adminUser.email,
      testUsers.adminUser.password
    );
  }

  /**
   * Attempt login with invalid credentials
   */
  async loginWithInvalidCredentials() {
    await this.loginWithEmailPassword(
      testUsers.invalidUser.email,
      testUsers.invalidUser.password
    );
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      // Check for user menu or profile indicator
      await this.page.waitForSelector(testSelectors.navigation.userMenu, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if user is logged out
   */
  async isLoggedOut(): Promise<boolean> {
    try {
      // Check for login button or absence of user menu
      await this.page.waitForSelector(testSelectors.navigation.menuButton, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    // Click on user menu
    await this.page.click(testSelectors.navigation.userMenu);
    
    // Click logout option (assuming it exists in dropdown)
    await this.page.click('[data-testid="logout-button"]');
    
    // Wait for navigation
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for login success
   */
  async waitForLoginSuccess() {
    // Wait for redirect to home page or dashboard
    await this.page.waitForURL(testUrls.home);
    
    // Verify user is logged in
    await expect(this.page.locator(testSelectors.navigation.userMenu)).toBeVisible();
  }

  /**
   * Wait for login error
   */
  async waitForLoginError() {
    // Wait for error message to appear
    await expect(this.page.locator(testSelectors.loginForm.errorMessage)).toBeVisible();
  }

  /**
   * Get current user info from the page
   */
  async getCurrentUser() {
    // Click on user menu to see user info
    await this.page.click(testSelectors.navigation.userMenu);
    
    // Extract user info from the dropdown
    const username = await this.page.textContent('[data-testid="user-username"]');
    const email = await this.page.textContent('[data-testid="user-email"]');
    
    return { username, email };
  }

  /**
   * Check if user has specific role or permission
   */
  async hasPermission(permission: string): Promise<boolean> {
    try {
      // This would depend on how permissions are displayed in your UI
      await this.page.waitForSelector(`[data-permission="${permission}"]`, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Navigate to protected route and handle auth redirect
   */
  async navigateToProtectedRoute(url: string) {
    await this.page.goto(url);
    
    // If redirected to login, user is not authenticated
    if (this.page.url().includes('/auth/login')) {
      return false;
    }
    
    return true;
  }

  /**
   * Setup authenticated state for tests
   */
  async setupAuthenticatedState() {
    // Try to login with valid user
    try {
      await this.loginWithValidUser();
      await this.waitForLoginSuccess();
      return true;
    } catch (error) {
      console.warn('Failed to setup authenticated state:', error);
      return false;
    }
  }

  /**
   * Clear authentication state
   */
  async clearAuthState() {
    // Clear cookies and local storage
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}
