import { expect, test } from '@playwright/test';
import { testThemes } from '../../fixtures/test-data';
import { ThemeHelpers } from '../../utils/theme-helpers';

/**
 * Theme switching E2E tests
 * Tests dark/light mode toggle, color themes, and theme persistence
 */
test.describe('Theme Switching', () => {
  let themeHelpers: ThemeHelpers;

  test.beforeEach(async ({ page }) => {
    themeHelpers = new ThemeHelpers(page);
    await page.goto('/');
  });

  test('should toggle between dark and light mode', async () => {
    // Start with light mode
    if (await themeHelpers.isDarkMode()) {
      await themeHelpers.switchToLightMode();
    }
    
    // Verify light mode is active
    expect(await themeHelpers.isLightMode()).toBe(true);
    
    // Switch to dark mode
    await themeHelpers.switchToDarkMode();
    expect(await themeHelpers.isDarkMode()).toBe(true);
    
    // Switch back to light mode
    await themeHelpers.switchToLightMode();
    expect(await themeHelpers.isLightMode()).toBe(true);
  });

  test('should apply dark mode theme classes', async () => {
    await themeHelpers.switchToDarkMode();
    
    // Verify dark class is applied to html element
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should apply light mode theme classes', async () => {
    await themeHelpers.switchToLightMode();
    
    // Verify dark class is not applied to html element
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should switch to different color themes', async () => {
    for (const theme of testThemes.lightThemes) {
      await themeHelpers.switchToColorTheme(theme);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    }
  });

  test('should switch to different color variants', async () => {
    for (const variant of testThemes.colorThemes) {
      await themeHelpers.switchToColorVariant(variant);
      await expect(page.locator('html')).toHaveAttribute('data-color-variant', variant);
    }
  });

  test('should persist theme across page reloads', async () => {
    // Set a specific theme
    await themeHelpers.switchToColorTheme('blue');
    await themeHelpers.switchToDarkMode();
    
    // Reload page
    await page.reload();
    
    // Verify theme is still applied
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should persist theme across navigation', async () => {
    // Set a specific theme
    await themeHelpers.switchToColorTheme('green');
    await themeHelpers.switchToDarkMode();
    
    // Navigate to different page
    await page.goto('/settings');
    
    // Verify theme is still applied
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'green');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should apply theme CSS variables', async () => {
    await themeHelpers.switchToColorTheme('red');
    await themeHelpers.verifyThemeVariables('red');
  });

  test('should handle theme switching on mobile', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await themeHelpers.switchToDarkMode();
    expect(await themeHelpers.isDarkMode()).toBe(true);
    
    await themeHelpers.switchToLightMode();
    expect(await themeHelpers.isLightMode()).toBe(true);
  });

  test('should handle theme switching on tablet', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await themeHelpers.switchToColorTheme('purple');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'purple');
  });

  test('should handle theme switching on desktop', async () => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await themeHelpers.switchToColorTheme('orange');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'orange');
  });

  test('should reset to default theme', async () => {
    // Set custom theme
    await themeHelpers.switchToColorTheme('red');
    await themeHelpers.switchToColorVariant('blue');
    await themeHelpers.switchToDarkMode();
    
    // Reset to default
    await themeHelpers.resetToDefaultTheme();
    
    // Verify default theme is applied
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'neutral');
    await expect(page.locator('html')).toHaveAttribute('data-color-variant', 'neutral');
    expect(await themeHelpers.isLightMode()).toBe(true);
  });

  test('should handle rapid theme switching', async () => {
    // Rapidly switch between themes
    for (let i = 0; i < 5; i++) {
      await themeHelpers.switchToColorTheme('blue');
      await themeHelpers.switchToColorTheme('red');
      await themeHelpers.switchToColorTheme('green');
    }
    
    // Verify final theme is applied
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'green');
  });

  test('should maintain theme state in browser storage', async () => {
    // Set theme
    await themeHelpers.switchToColorTheme('purple');
    await themeHelpers.switchToDarkMode();
    
    // Check localStorage
    const themeData = await page.evaluate(() => {
      return {
        theme: localStorage.getItem('theme'),
        colorTheme: localStorage.getItem('colorTheme'),
        darkMode: localStorage.getItem('darkMode'),
      };
    });
    
    expect(themeData.theme).toBe('purple');
    expect(themeData.darkMode).toBe('true');
  });

  test('should handle theme switching with keyboard', async () => {
    // Focus on theme toggle button
    await page.focus('[data-testid="theme-toggle"]');
    
    // Press Enter to toggle
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    
    // Verify theme changed
    const isDarkMode = await themeHelpers.isDarkMode();
    expect(isDarkMode).toBe(true);
  });

  test('should handle theme switching with space key', async () => {
    // Focus on theme toggle button
    await page.focus('[data-testid="theme-toggle"]');
    
    // Press Space to toggle
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    
    // Verify theme changed
    const isDarkMode = await themeHelpers.isDarkMode();
    expect(isDarkMode).toBe(true);
  });

  test('should show theme preview on hover', async () => {
    // Hover over theme selector
    await page.hover('[data-testid="theme-selector"]');
    
    // Verify preview is shown
    await expect(page.locator('[data-testid="theme-preview"]')).toBeVisible();
  });

  test('should handle theme switching in modal', async () => {
    // Open settings modal
    await page.click('[data-testid="settings-button"]');
    await expect(page.locator('[data-testid="settings-modal"]')).toBeVisible();
    
    // Switch theme in modal
    await themeHelpers.switchToColorTheme('blue');
    
    // Verify theme is applied
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue');
  });

  test('should handle theme switching with system preference', async () => {
    // Set system preference to dark
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Reload page to apply system preference
    await page.reload();
    
    // Verify dark mode is applied
    expect(await themeHelpers.isDarkMode()).toBe(true);
  });

  test('should handle theme switching with system preference light', async () => {
    // Set system preference to light
    await page.emulateMedia({ colorScheme: 'light' });
    
    // Reload page to apply system preference
    await page.reload();
    
    // Verify light mode is applied
    expect(await themeHelpers.isLightMode()).toBe(true);
  });
});

/**
 * Theme accessibility tests
 */
test.describe('Theme Accessibility', () => {
  test('should maintain proper contrast ratios', async ({ page }) => {
    const themeHelpers = new ThemeHelpers(page);
    
    // Test all themes for proper contrast
    for (const theme of testThemes.lightThemes) {
      await themeHelpers.switchToColorTheme(theme);
      await themeHelpers.verifyThemeVariables(theme);
    }
  });

  test('should support high contrast mode', async ({ page }) => {
    // Enable high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    
    // Verify theme still works
    const themeHelpers = new ThemeHelpers(page);
    await themeHelpers.switchToDarkMode();
    expect(await themeHelpers.isDarkMode()).toBe(true);
  });

  test('should support reduced motion preference', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Verify theme switching still works
    const themeHelpers = new ThemeHelpers(page);
    await themeHelpers.switchToDarkMode();
    expect(await themeHelpers.isDarkMode()).toBe(true);
  });
});
