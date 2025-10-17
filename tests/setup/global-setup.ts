import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Handles authentication state, test data preparation, and environment setup
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // Get base URL from config
  const baseURL = (config as any).use?.baseURL || 'http://localhost:3001';
  
  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...');
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    
    // Check if the application is running
    const isAppReady = await page.locator('body').isVisible();
    if (!isAppReady) {
      throw new Error('Application is not ready');
    }
    
    console.log('✅ Application is ready');
    
    // Set up test environment variables
    await page.addInitScript(() => {
      // Set test mode flag
      (window as any).__TEST_MODE__ = true;
      
      // Mock external services if needed
      (window as any).__MOCK_SERVICES__ = {
        analytics: true,
        tracking: true,
      };
    });
    
    // Store authentication state for reuse
    const authState = await context.storageState();
    
    // Save auth state to file for reuse in tests
    const fs = require('fs');
    const path = require('path');
    
    const authStatePath = path.join(__dirname, '../fixtures/auth-state.json');
    fs.writeFileSync(authStatePath, JSON.stringify(authState, null, 2));
    
    console.log('💾 Authentication state saved');
    
    // Set environment variables for tests
    process.env.TEST_BASE_URL = baseURL;
    process.env.TEST_AUTH_STATE_PATH = authStatePath;
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
