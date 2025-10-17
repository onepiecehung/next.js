import { Page, expect } from '@playwright/test';
import { testSelectors, testThemes } from '../fixtures/test-data';

/**
 * Theme helper functions for E2E tests
 * Provides reusable methods for theme switching and validation
 */
export class ThemeHelpers {
  constructor(private page: Page) {}

  /**
   * Switch to dark mode
   */
  async switchToDarkMode() {
    // Click theme toggle button
    await this.page.click(testSelectors.theme.darkModeToggle);
    
    // Wait for theme change to apply
    await this.page.waitForTimeout(500);
    
    // Verify dark mode is active
    await expect(this.page.locator('html')).toHaveClass(/dark/);
  }

  /**
   * Switch to light mode
   */
  async switchToLightMode() {
    // Click theme toggle button
    await this.page.click(testSelectors.theme.darkModeToggle);
    
    // Wait for theme change to apply
    await this.page.waitForTimeout(500);
    
    // Verify light mode is active
    await expect(this.page.locator('html')).not.toHaveClass(/dark/);
  }

  /**
   * Check if dark mode is active
   */
  async isDarkMode(): Promise<boolean> {
    const htmlElement = this.page.locator('html');
    const hasDarkClass = await htmlElement.evaluate((el) => el.classList.contains('dark'));
    return hasDarkClass;
  }

  /**
   * Check if light mode is active
   */
  async isLightMode(): Promise<boolean> {
    return !(await this.isDarkMode());
  }

  /**
   * Switch to specific color theme
   */
  async switchToColorTheme(theme: string) {
    // Open theme selector
    await this.page.click(testSelectors.theme.themeSelector);
    
    // Select the theme
    await this.page.click(`[data-theme="${theme}"]`);
    
    // Wait for theme change to apply
    await this.page.waitForTimeout(500);
    
    // Verify theme is applied
    await expect(this.page.locator('html')).toHaveAttribute('data-theme', theme);
  }

  /**
   * Switch to specific color variant
   */
  async switchToColorVariant(variant: string) {
    // Open color variant selector
    await this.page.click(testSelectors.theme.colorVariantSelector);
    
    // Select the variant
    await this.page.click(`[data-color-variant="${variant}"]`);
    
    // Wait for variant change to apply
    await this.page.waitForTimeout(500);
    
    // Verify variant is applied
    await expect(this.page.locator('html')).toHaveAttribute('data-color-variant', variant);
  }

  /**
   * Get current theme
   */
  async getCurrentTheme(): Promise<string> {
    return await this.page.locator('html').getAttribute('data-theme') || 'neutral';
  }

  /**
   * Get current color variant
   */
  async getCurrentColorVariant(): Promise<string> {
    return await this.page.locator('html').getAttribute('data-color-variant') || 'neutral';
  }

  /**
   * Test all available themes
   */
  async testAllThemes() {
    const themes = [...testThemes.lightThemes, ...testThemes.darkThemes];
    
    for (const theme of themes) {
      await this.switchToColorTheme(theme);
      await expect(this.page.locator('html')).toHaveAttribute('data-theme', theme);
    }
  }

  /**
   * Test all color variants
   */
  async testAllColorVariants() {
    for (const variant of testThemes.colorThemes) {
      await this.switchToColorVariant(variant);
      await expect(this.page.locator('html')).toHaveAttribute('data-color-variant', variant);
    }
  }

  /**
   * Test theme persistence across page reloads
   */
  async testThemePersistence(theme: string) {
    // Set theme
    await this.switchToColorTheme(theme);
    
    // Reload page
    await this.page.reload();
    
    // Verify theme is still applied
    await expect(this.page.locator('html')).toHaveAttribute('data-theme', theme);
  }

  /**
   * Test dark/light mode toggle
   */
  async testDarkLightToggle() {
    // Start with light mode
    if (await this.isDarkMode()) {
      await this.switchToLightMode();
    }
    
    // Toggle to dark mode
    await this.switchToDarkMode();
    expect(await this.isDarkMode()).toBe(true);
    
    // Toggle back to light mode
    await this.switchToLightMode();
    expect(await this.isLightMode()).toBe(true);
  }

  /**
   * Verify theme CSS variables are applied
   */
  async verifyThemeVariables(theme: string) {
    // Check if CSS custom properties are set correctly
    const cssVariables = await this.page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      return {
        background: computedStyle.getPropertyValue('--background'),
        foreground: computedStyle.getPropertyValue('--foreground'),
        primary: computedStyle.getPropertyValue('--primary'),
        secondary: computedStyle.getPropertyValue('--secondary'),
      };
    });
    
    // Verify variables are not empty (indicating theme is applied)
    expect(cssVariables.background).not.toBe('');
    expect(cssVariables.foreground).not.toBe('');
  }

  /**
   * Test theme accessibility (contrast ratios)
   */
  async testThemeAccessibility() {
    // This would require more sophisticated testing
    // For now, we'll just verify that theme classes are applied
    const htmlElement = this.page.locator('html');
    
    // Check that theme classes are present
    const classList = await htmlElement.evaluate((el) => Array.from(el.classList));
    expect(classList.length).toBeGreaterThan(0);
  }

  /**
   * Reset theme to default
   */
  async resetToDefaultTheme() {
    await this.switchToColorTheme('neutral');
    await this.switchToColorVariant('neutral');
    
    if (await this.isDarkMode()) {
      await this.switchToLightMode();
    }
  }
}
