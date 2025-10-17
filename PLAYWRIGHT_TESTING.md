# 🎭 Playwright E2E Testing Guide

This document provides comprehensive guidance for running and maintaining E2E tests using Playwright in our Next.js application.

## 📋 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [CI/CD Integration](#cicd-integration)

## 🎯 Overview

Our E2E testing suite uses Playwright to test the complete user experience across multiple browsers and devices. The tests cover:

- **Authentication flows** (login, register, OAuth)
- **Theme system** (dark/light mode, color variants)
- **Article management** (create, edit, view, publish)
- **Rich text editor** (TipTap editor functionality)
- **Responsive design** (mobile, tablet, desktop)
- **Internationalization** (EN/VI language switching)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Yarn package manager
- Playwright browsers installed

### Installation

```bash
# Install dependencies
yarn install

# Install Playwright browsers
yarn test:e2e:install
```

### First Run

```bash
# Start the development server
yarn dev

# In another terminal, run E2E tests
yarn test:e2e
```

## 🏃‍♂️ Running Tests

### Basic Commands

```bash
# Run all E2E tests
yarn test:e2e

# Run tests with UI mode (interactive)
yarn test:e2e:ui

# Run tests in headed mode (visible browser)
yarn test:e2e:headed

# Run tests in debug mode
yarn test:e2e:debug

# Show test report
yarn test:e2e:report
```

### Specific Test Suites

```bash
# Run only authentication tests
yarn test:e2e tests/e2e/auth/

# Run only theme tests
yarn test:e2e tests/e2e/theme/

# Run only article tests
yarn test:e2e tests/e2e/article/

# Run specific test file
yarn test:e2e tests/e2e/auth/login.spec.ts
```

### Browser-Specific Tests

```bash
# Run tests on specific browser
yarn test:e2e --project=chromium
yarn test:e2e --project=firefox
yarn test:e2e --project=webkit

# Run tests on mobile devices
yarn test:e2e --project="Mobile Chrome"
yarn test:e2e --project="Mobile Safari"
yarn test:e2e --project="iPad"
```

### Parallel Execution

```bash
# Run tests in parallel (4 workers)
yarn test:e2e --workers=4

# Run tests in parallel on specific browsers
yarn test:e2e --project=chromium --project=firefox --workers=2
```

## 📁 Test Structure

```
tests/
├── e2e/                    # E2E test files
│   ├── auth/              # Authentication tests
│   │   ├── login.spec.ts
│   │   ├── register.spec.ts
│   │   └── oauth.spec.ts
│   ├── theme/             # Theme system tests
│   │   ├── theme-switching.spec.ts
│   │   └── color-variants.spec.ts
│   ├── article/           # Article management tests
│   │   ├── create-article.spec.ts
│   │   ├── edit-article.spec.ts
│   │   └── view-article.spec.ts
│   ├── editor/            # Rich text editor tests
│   │   ├── rich-text-editor.spec.ts
│   │   └── markdown-rendering.spec.ts
│   ├── navigation/        # Navigation tests
│   │   ├── site-navigation.spec.ts
│   │   └── responsive-menu.spec.ts
│   └── i18n/              # Internationalization tests
│       └── language-switching.spec.ts
├── fixtures/              # Test data and mock responses
│   ├── test-data.ts
│   └── mock-responses.ts
├── utils/                 # Test utilities and helpers
│   ├── auth-helpers.ts
│   ├── theme-helpers.ts
│   ├── editor-helpers.ts
│   └── page-objects/
│       ├── login-page.ts
│       ├── article-page.ts
│       └── editor-page.ts
└── setup/                 # Global setup and teardown
    ├── global-setup.ts
    └── global-teardown.ts
```

## ✍️ Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../utils/page-objects/login-page';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', async () => {
    await loginPage.loginWithValidUser();
    await loginPage.waitForLoginSuccess();
    
    expect(await loginPage.isLoggedIn()).toBe(true);
  });
});
```

### Using Page Objects

```typescript
// Create page object
const loginPage = new LoginPage(page);

// Use page object methods
await loginPage.fillEmail('test@example.com');
await loginPage.fillPassword('password');
await loginPage.clickSubmit();
```

### Using Helpers

```typescript
// Create helper instance
const authHelpers = new AuthHelpers(page);

// Use helper methods
await authHelpers.loginWithValidUser();
await authHelpers.waitForLoginSuccess();
```

### Test Data

```typescript
import { testUsers, testArticles } from '../../fixtures/test-data';

// Use test data
await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
await editorPage.createArticle(testArticles.sampleArticle);
```

## 🎯 Best Practices

### 1. Test Organization

- **Group related tests** using `test.describe()`
- **Use descriptive test names** that explain what is being tested
- **Keep tests independent** - each test should be able to run in isolation
- **Use beforeEach/afterEach** for setup and cleanup

### 2. Page Objects

- **Encapsulate page interactions** in page object classes
- **Use meaningful method names** that describe the action
- **Return values when needed** for assertions
- **Handle waiting and timeouts** within page objects

### 3. Assertions

- **Use specific assertions** instead of generic ones
- **Wait for elements** before asserting
- **Test both positive and negative cases**
- **Verify the complete user flow**

### 4. Data Management

- **Use test fixtures** for consistent test data
- **Avoid hardcoded values** in tests
- **Clean up test data** after tests
- **Use realistic test data** that matches production

### 5. Error Handling

- **Handle network errors** gracefully
- **Use proper timeouts** for async operations
- **Test error scenarios** and edge cases
- **Provide meaningful error messages**

### 6. Performance

- **Run tests in parallel** when possible
- **Use headless mode** for CI/CD
- **Optimize test data** and setup
- **Monitor test execution time**

## 🔧 Troubleshooting

### Common Issues

#### 1. Tests Failing Due to Timing

```typescript
// ❌ Bad - no waiting
await page.click('button');
await expect(page.locator('.result')).toBeVisible();

// ✅ Good - proper waiting
await page.click('button');
await page.waitForSelector('.result');
await expect(page.locator('.result')).toBeVisible();
```

#### 2. Element Not Found

```typescript
// ❌ Bad - immediate check
await expect(page.locator('.element')).toBeVisible();

// ✅ Good - wait for element
await page.waitForSelector('.element');
await expect(page.locator('.element')).toBeVisible();
```

#### 3. Network Issues

```typescript
// Wait for network to be idle
await page.goto('/page', { waitUntil: 'networkidle' });

// Wait for specific network request
await page.waitForResponse(response => 
  response.url().includes('/api/data') && response.status() === 200
);
```

#### 4. Authentication Issues

```typescript
// Use auth helpers for consistent authentication
const authHelpers = new AuthHelpers(page);
await authHelpers.setupAuthenticatedState();
```

### Debug Mode

```bash
# Run tests in debug mode
yarn test:e2e:debug

# Run specific test in debug mode
yarn test:e2e:debug tests/e2e/auth/login.spec.ts
```

### Test Reports

```bash
# Generate and view test report
yarn test:e2e:report
```

## 🚀 CI/CD Integration

### GitHub Actions

Our CI/CD pipeline automatically runs E2E tests on:

- **Push to main/develop branches**
- **Pull requests**
- **Manual workflow dispatch**

### Test Matrix

Tests run on multiple configurations:

- **Browsers**: Chromium, Firefox, WebKit
- **Devices**: Mobile Chrome, Mobile Safari, iPad
- **Parallel execution** for faster feedback

### Artifacts

- **Test reports** (HTML, JSON, JUnit)
- **Screenshots** on failure
- **Videos** on failure
- **Test results** for analysis

### Environment Variables

```bash
# Required for CI/CD
PLAYWRIGHT_BASE_URL=http://localhost:3001
NODE_ENV=test
```

## 📊 Test Coverage

### Current Coverage

- ✅ Authentication flows
- ✅ Theme system
- ✅ Article management
- ✅ Rich text editor
- ✅ Responsive design
- ✅ Navigation
- ✅ Internationalization

### Future Enhancements

- 🔄 User profile management
- 🔄 Comment system
- 🔄 Search functionality
- 🔄 File uploads
- 🔄 Performance testing

## 🤝 Contributing

### Adding New Tests

1. **Create test file** in appropriate directory
2. **Use existing page objects** and helpers
3. **Add test data** to fixtures if needed
4. **Follow naming conventions**
5. **Add proper documentation**

### Updating Tests

1. **Update page objects** when UI changes
2. **Update test data** when requirements change
3. **Maintain test independence**
4. **Update documentation**

### Code Review

- **Check test coverage** for new features
- **Verify test reliability** and stability
- **Ensure proper error handling**
- **Review test performance**

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## 🆘 Support

If you encounter issues with E2E tests:

1. **Check the troubleshooting section** above
2. **Review test reports** for specific errors
3. **Run tests in debug mode** for detailed investigation
4. **Check CI/CD logs** for environment issues
5. **Create an issue** with detailed information

---

**Happy Testing! 🎭✨**
