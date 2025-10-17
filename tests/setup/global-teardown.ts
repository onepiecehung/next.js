import { FullConfig } from '@playwright/test';

/**
 * Global teardown for Playwright tests
 * Handles cleanup tasks, test artifacts, and environment reset
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');
  
  try {
    // Clean up test artifacts
    const fs = require('fs');
    const path = require('path');
    
    // Remove temporary files
    const tempFiles = [
      path.join(__dirname, '../fixtures/auth-state.json'),
      path.join(__dirname, '../fixtures/test-uploads'),
    ];
    
    for (const file of tempFiles) {
      if (fs.existsSync(file)) {
        if (fs.statSync(file).isDirectory()) {
          fs.rmSync(file, { recursive: true, force: true });
        } else {
          fs.unlinkSync(file);
        }
        console.log(`🗑️  Removed: ${file}`);
      }
    }
    
    // Clean up test results if needed
    const testResultsDir = path.join(process.cwd(), 'test-results');
    if (fs.existsSync(testResultsDir)) {
      // Keep only failed test artifacts
      const files = fs.readdirSync(testResultsDir);
      for (const file of files) {
        if (file.endsWith('.json') || file.endsWith('.xml')) {
          // Keep reports
          continue;
        }
        const filePath = path.join(testResultsDir, file);
        if (fs.statSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        }
      }
    }
    
    // Reset environment variables
    delete process.env.TEST_BASE_URL;
    delete process.env.TEST_AUTH_STATE_PATH;
    
    console.log('✅ Global teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown;
