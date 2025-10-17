/**
 * Test data fixtures for E2E tests
 * Contains mock data for users, articles, and other test entities
 */

// Test user accounts
export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    username: 'testuser',
    name: 'Test User',
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'AdminPassword123!',
    username: 'admin',
    name: 'Admin User',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
    username: 'invaliduser',
    name: 'Invalid User',
  },
} as const;

// Test article data
export const testArticles = {
  sampleArticle: {
    title: 'Test Article Title',
    content: 'This is a test article content with **bold text** and *italic text*.',
    excerpt: 'This is a test article excerpt',
    tags: ['test', 'e2e', 'playwright'],
    published: true,
  },
  longArticle: {
    title: 'Long Test Article for Performance Testing',
    content: `
# Long Test Article

This is a comprehensive test article designed to test the performance and functionality of the rich text editor and article rendering system.

## Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Features

- Rich text editing
- Image uploads
- Code highlighting
- Mermaid diagrams
- Task lists

## Code Example

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

## Mermaid Diagram

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`

## Task List

- [ ] Task 1
- [x] Task 2
- [ ] Task 3

## Conclusion

This article demonstrates various features of the rich text editor and content rendering system.
    `.trim(),
    excerpt: 'A comprehensive test article for performance and functionality testing',
    tags: ['test', 'performance', 'features', 'editor'],
    published: true,
  },
  draftArticle: {
    title: 'Draft Article',
    content: 'This is a draft article that should not be published.',
    excerpt: 'Draft article excerpt',
    tags: ['draft'],
    published: false,
  },
} as const;

// Test theme data
export const testThemes = {
  lightThemes: ['neutral', 'stone', 'zinc', 'gray', 'slate'],
  darkThemes: ['neutral', 'stone', 'zinc', 'gray', 'slate', 'dracula'],
  colorThemes: ['red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet'],
} as const;

// Test language data
export const testLanguages = {
  english: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
  vietnamese: {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳',
  },
} as const;

// Test file uploads
export const testFiles = {
  smallImage: {
    name: 'small-image.jpg',
    type: 'image/jpeg',
    size: 1024 * 100, // 100KB
  },
  largeImage: {
    name: 'large-image.jpg',
    type: 'image/jpeg',
    size: 1024 * 1024 * 5, // 5MB
  },
  invalidFile: {
    name: 'invalid-file.txt',
    type: 'text/plain',
    size: 1024 * 10, // 10KB
  },
} as const;

// Test API responses
export const mockApiResponses = {
  loginSuccess: {
    user: {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      avatar: null,
      createdAt: '2024-01-01T00:00:00Z',
    },
    token: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    },
  },
  loginError: {
    error: 'Invalid credentials',
    message: 'Email or password is incorrect',
  },
  articleCreated: {
    id: '1',
    title: 'Test Article Title',
    content: 'This is a test article content',
    excerpt: 'This is a test article excerpt',
    tags: ['test', 'e2e'],
    published: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
} as const;

// Test selectors for common elements
export const testSelectors = {
  // Authentication
  loginForm: {
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
    errorMessage: '[data-testid="error-message"]',
  },
  
  // Navigation
  navigation: {
    logo: '[data-testid="site-logo"]',
    menuButton: '[data-testid="menu-button"]',
    userMenu: '[data-testid="user-menu"]',
    themeToggle: '[data-testid="theme-toggle"]',
    languageToggle: '[data-testid="language-toggle"]',
  },
  
  // Article
  article: {
    title: '[data-testid="article-title"]',
    content: '[data-testid="article-content"]',
    editButton: '[data-testid="edit-article"]',
    deleteButton: '[data-testid="delete-article"]',
    likeButton: '[data-testid="like-button"]',
  },
  
  // Editor
  editor: {
    titleInput: 'input[name="title"]',
    contentEditor: '[data-testid="content-editor"]',
    publishButton: '[data-testid="publish-button"]',
    saveButton: '[data-testid="save-button"]',
    previewButton: '[data-testid="preview-button"]',
  },
  
  // Theme
  theme: {
    themeSelector: '[data-testid="theme-selector"]',
    colorVariantSelector: '[data-testid="color-variant-selector"]',
    darkModeToggle: '[data-testid="dark-mode-toggle"]',
  },
} as const;

// Test URLs
export const testUrls = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  write: '/write',
  settings: '/settings',
  profile: (userId: string) => `/user/${userId}`,
  article: (articleId: string, slug: string) => `/article/${articleId}/${slug}`,
} as const;
