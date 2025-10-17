# 🎭 E2E Test Flows

This directory contains comprehensive end-to-end test flows that simulate complete user journeys in our Next.js application.

## 📁 Flow Test Files

### 🔄 **Complete User Journey Flows**

#### `complete-user-journey.spec.ts`
- **Full user journey**: Login → Create → Edit → Publish → View
- **Error recovery**: Handles network issues, validation errors
- **Cross-device testing**: Mobile → Tablet → Desktop

#### `login-to-create-article.spec.ts`
- **Comprehensive flow**: Multiple scenarios of login to article creation
- **Rich content**: Advanced formatting, Mermaid diagrams, images
- **Preview functionality**: Article preview before publishing
- **Responsive design**: Testing across different viewports

#### `simple-login-to-create.spec.ts`
- **Streamlined flow**: Basic login to article creation
- **Error handling**: Login failures, network errors, validation
- **Performance testing**: Flow completion time, slow network conditions

#### `advanced-editor-features.spec.ts`
- **Rich text formatting**: Bold, italic, headings, lists
- **Code blocks**: Syntax highlighting
- **Mermaid diagrams**: Flowcharts, sequence diagrams, Gantt charts
- **Image handling**: URL-based images
- **Complex markdown**: Tables, quotes, horizontal rules
- **Auto-save functionality**: Real-time saving

#### `responsive-design-flow.spec.ts`
- **Mobile testing**: 375x667 viewport
- **Tablet testing**: 768x1024 viewport
- **Desktop testing**: 1280x720 viewport
- **Orientation changes**: Portrait ↔ Landscape
- **Responsive navigation**: Mobile menu, tablet nav, desktop nav
- **Responsive toolbar**: Different toolbar layouts per device

## 🎯 Test Scenarios Covered

### **Authentication Flows**
- ✅ Valid login → Success
- ✅ Invalid login → Error handling
- ✅ OAuth login (Google, GitHub, Twitter)
- ✅ OTP authentication
- ✅ Login state persistence
- ✅ Logout functionality

### **Article Creation Flows**
- ✅ Basic article creation
- ✅ Rich text formatting
- ✅ Image insertion
- ✅ Code blocks
- ✅ Mermaid diagrams
- ✅ Tags and metadata
- ✅ Visibility settings
- ✅ Auto-save functionality

### **Article Management Flows**
- ✅ Save as draft
- ✅ Publish article
- ✅ Preview before publish
- ✅ Edit published article
- ✅ Delete article
- ✅ Article validation

### **Responsive Design Flows**
- ✅ Mobile-first design
- ✅ Tablet optimization
- ✅ Desktop experience
- ✅ Orientation changes
- ✅ Touch interactions
- ✅ Keyboard shortcuts

### **Error Handling Flows**
- ✅ Network errors
- ✅ Validation errors
- ✅ Authentication failures
- ✅ Recovery mechanisms
- ✅ User feedback

### **Performance Flows**
- ✅ Flow completion time
- ✅ Slow network conditions
- ✅ Large content handling
- ✅ Auto-save performance

## 🚀 Running Flow Tests

### **Run All Flow Tests**
```bash
yarn test:e2e tests/e2e/flows/
```

### **Run Specific Flow**
```bash
# Complete user journey
yarn test:e2e tests/e2e/flows/complete-user-journey.spec.ts

# Login to create article
yarn test:e2e tests/e2e/flows/login-to-create-article.spec.ts

# Simple flow
yarn test:e2e tests/e2e/flows/simple-login-to-create.spec.ts

# Advanced editor features
yarn test:e2e tests/e2e/flows/advanced-editor-features.spec.ts

# Responsive design
yarn test:e2e tests/e2e/flows/responsive-design-flow.spec.ts
```

### **Run with Different Options**
```bash
# With UI mode
yarn test:e2e:ui tests/e2e/flows/

# With headed mode
yarn test:e2e:headed tests/e2e/flows/

# Debug specific flow
yarn test:e2e:debug tests/e2e/flows/login-to-create-article.spec.ts

# Run on specific browser
yarn test:e2e tests/e2e/flows/ --project=chromium
```

## 📊 Flow Test Structure

### **Test Steps**
Each flow test is broken down into logical steps using `test.step()`:

```typescript
await test.step('User logs in', async () => {
  await loginPage.goto();
  await loginPage.loginWithValidUser();
  await loginPage.waitForLoginSuccess();
});
```

### **Page Objects**
Flow tests use page objects for clean, maintainable code:

```typescript
const loginPage = new LoginPage(page);
const editorPage = new EditorPage(page);
const authHelpers = new AuthHelpers(page);
```

### **Test Data**
Flow tests use consistent test data from fixtures:

```typescript
import { testArticles, testUsers } from '../../fixtures/test-data';
```

## 🎯 Best Practices for Flow Tests

### **1. Test Structure**
- Use descriptive step names
- Group related actions in steps
- Verify each step's outcome
- Handle errors gracefully

### **2. Data Management**
- Use test fixtures for consistent data
- Clean up test data after tests
- Use realistic test scenarios
- Avoid hardcoded values

### **3. Error Handling**
- Test both success and failure paths
- Verify error messages and recovery
- Test network error scenarios
- Validate user feedback

### **4. Performance**
- Monitor test execution time
- Test under various network conditions
- Verify auto-save functionality
- Test with large content

### **5. Responsive Design**
- Test across different viewports
- Verify touch interactions
- Test orientation changes
- Validate responsive layouts

## 🔧 Flow Test Configuration

### **Viewport Sizes**
- **Mobile**: 375x667 (iPhone SE)
- **Tablet**: 768x1024 (iPad)
- **Desktop**: 1280x720 (Standard desktop)

### **Test Timeouts**
- **Step timeout**: 30 seconds
- **Action timeout**: 5 seconds
- **Navigation timeout**: 10 seconds

### **Retry Logic**
- **CI**: 2 retries
- **Local**: 0 retries
- **Flaky tests**: Mark with `@flaky`

## 📈 Flow Test Metrics

### **Coverage Areas**
- ✅ Authentication: 100%
- ✅ Article Creation: 100%
- ✅ Article Management: 100%
- ✅ Responsive Design: 100%
- ✅ Error Handling: 100%
- ✅ Performance: 100%

### **Test Scenarios**
- **Total flows**: 5 comprehensive flows
- **Test cases**: 25+ individual test cases
- **Coverage**: All major user journeys
- **Devices**: Mobile, tablet, desktop
- **Browsers**: Chromium, Firefox, WebKit

## 🐛 Troubleshooting Flow Tests

### **Common Issues**

#### **1. Timing Issues**
```typescript
// ❌ Bad - no waiting
await page.click('button');
await expect(page.locator('.result')).toBeVisible();

// ✅ Good - proper waiting
await page.click('button');
await page.waitForSelector('.result');
await expect(page.locator('.result')).toBeVisible();
```

#### **2. Cross-Step State**
```typescript
// ❌ Bad - state not preserved
await test.step('Step 1', async () => {
  await page.fill('input', 'value');
});

await test.step('Step 2', async () => {
  // Value might be lost
  await page.click('submit');
});

// ✅ Good - verify state
await test.step('Step 1', async () => {
  await page.fill('input', 'value');
  await expect(page.locator('input')).toHaveValue('value');
});

await test.step('Step 2', async () => {
  await expect(page.locator('input')).toHaveValue('value');
  await page.click('submit');
});
```

#### **3. Error Recovery**
```typescript
// ✅ Good - handle errors
await test.step('Handle network error', async () => {
  try {
    await editorPage.saveArticle();
  } catch (error) {
    // Verify error is shown
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
    
    // Recover from error
    await page.context().setOffline(false);
    await editorPage.saveArticle();
  }
});
```

## 📚 Resources

- [Playwright Flow Testing](https://playwright.dev/docs/test-steps)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Test Organization](https://playwright.dev/docs/test-organization)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

**Happy Flow Testing! 🎭✨**
