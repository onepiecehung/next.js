# 🎭 E2E Testing Suite

This directory contains the complete E2E testing suite for our Next.js application using Playwright.

## 📁 Directory Structure

```
tests/
├── e2e/                    # E2E test files
│   ├── auth/              # Authentication tests
│   ├── theme/             # Theme system tests
│   ├── article/           # Article management tests
│   ├── editor/            # Rich text editor tests
│   ├── navigation/        # Navigation tests
│   └── i18n/              # Internationalization tests
├── fixtures/              # Test data and mock responses
├── utils/                 # Test utilities and helpers
│   └── page-objects/      # Page object models
├── setup/                 # Global setup and teardown
└── README.md              # This file
```

## 🚀 Quick Start

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

### Running Tests

```bash
# Run all E2E tests
yarn test:e2e

# Run tests with UI mode
yarn test:e2e:ui

# Run tests in headed mode
yarn test:e2e:headed

# Run specific test suite
yarn test:e2e tests/e2e/auth/
```

## 📋 Test Categories

### 🔐 Authentication Tests (`tests/e2e/auth/`)

- **Login Flow** - Email/password authentication
- **Registration** - User registration process
- **OAuth** - Google, GitHub, Twitter login
- **OTP** - One-time password authentication
- **Logout** - User logout functionality

### 🎨 Theme Tests (`tests/e2e/theme/`)

- **Dark/Light Mode** - Theme switching
- **Color Variants** - Multiple color themes
- **Theme Persistence** - Theme state across sessions
- **Accessibility** - Contrast and accessibility compliance

### 📝 Article Tests (`tests/e2e/article/`)

- **Create Article** - Article creation flow
- **Edit Article** - Article editing functionality
- **View Article** - Article viewing and display
- **Publish Article** - Article publishing process
- **Delete Article** - Article deletion

### ✏️ Editor Tests (`tests/e2e/editor/`)

- **Rich Text Editor** - TipTap editor functionality
- **Formatting** - Bold, italic, underline, etc.
- **Lists** - Bullet, numbered, task lists
- **Code Blocks** - Syntax highlighting
- **Images** - Image insertion and handling
- **Mermaid** - Diagram rendering

### 🧭 Navigation Tests (`tests/e2e/navigation/`)

- **Site Navigation** - Main navigation menu
- **Responsive Menu** - Mobile/tablet navigation
- **User Menu** - User dropdown menu
- **Breadcrumbs** - Navigation breadcrumbs

### 🌍 i18n Tests (`tests/e2e/i18n/`)

- **Language Switching** - EN/VI language toggle
- **Content Translation** - Translated content display
- **RTL Support** - Right-to-left language support

## 🛠️ Test Utilities

### Page Objects (`tests/utils/page-objects/`)

- **LoginPage** - Login page interactions
- **ArticlePage** - Article page interactions
- **EditorPage** - Article editor interactions

### Helpers (`tests/utils/`)

- **AuthHelpers** - Authentication utilities
- **ThemeHelpers** - Theme switching utilities
- **EditorHelpers** - Rich text editor utilities

### Test Data (`tests/fixtures/`)

- **test-data.ts** - Test users, articles, themes
- **mock-responses.ts** - API mock responses

## 🎯 Best Practices

### 1. Test Organization

- Group related tests using `test.describe()`
- Use descriptive test names
- Keep tests independent
- Use proper setup/teardown

### 2. Page Objects

- Encapsulate page interactions
- Use meaningful method names
- Handle waiting and timeouts
- Return values for assertions

### 3. Assertions

- Use specific assertions
- Wait for elements before asserting
- Test both positive and negative cases
- Verify complete user flows

### 4. Data Management

- Use test fixtures for consistent data
- Avoid hardcoded values
- Clean up test data after tests
- Use realistic test data

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

- **Browsers**: Chromium, Firefox, WebKit
- **Devices**: Mobile, Tablet, Desktop
- **Parallel Execution**: Configurable workers
- **Retries**: Automatic retry on failure
- **Timeouts**: Configurable timeouts

### Global Setup (`tests/setup/`)

- **global-setup.ts** - Application startup and auth state
- **global-teardown.ts** - Cleanup and artifact management

## 🚀 CI/CD Integration

### GitHub Actions (`.github/workflows/e2e-tests.yml`)

- **Trigger**: Push to main/develop, PRs
- **Matrix**: Multiple browsers and devices
- **Artifacts**: Test reports, screenshots, videos
- **Parallel**: Optimized for speed

### Test Reports

- **HTML Report** - Interactive test results
- **JSON Report** - Machine-readable results
- **JUnit Report** - CI/CD integration
- **GitHub Integration** - PR status checks

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

## 🐛 Troubleshooting

### Common Issues

1. **Tests Failing Due to Timing**
   - Use proper waiting strategies
   - Wait for elements before interacting

2. **Element Not Found**
   - Check selectors and timing
   - Use data-testid attributes

3. **Network Issues**
   - Wait for network idle
   - Handle API responses properly

4. **Authentication Issues**
   - Use auth helpers consistently
   - Check auth state management

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

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## 🤝 Contributing

### Adding New Tests

1. Create test file in appropriate directory
2. Use existing page objects and helpers
3. Add test data to fixtures if needed
4. Follow naming conventions
5. Add proper documentation

### Updating Tests

1. Update page objects when UI changes
2. Update test data when requirements change
3. Maintain test independence
4. Update documentation

---

**Happy Testing! 🎭✨**
