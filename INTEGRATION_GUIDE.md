# Login Components Integration Guide

This guide explains how to integrate the refactored login components into your Next.js application.

## Quick Start

### 1. Install Dependencies

```bash
npm install @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest jest-environment-jsdom
npm install --save-dev @storybook/nextjs @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-a11y @storybook/addon-viewport
```

### 2. Update Your Login Page

Replace your existing login page with the new refactored version:

```tsx
// src/app/(auth)/login/page.tsx
import { LoginCard } from "./_components/LoginCard";
// ... rest of the implementation
```

### 3. Configure Jest (if testing)

Add the Jest configuration files to your project root:
- `jest.config.js`
- `jest.setup.js`

### 4. Configure Storybook (if using)

Add the Storybook configuration files:
- `.storybook/main.ts`
- `.storybook/preview.ts`

## Component Structure

```
src/app/(auth)/login/
├── page.tsx                    # Main login page
├── _components/
│   ├── LoginCard.tsx          # Main login card component
│   ├── FormFields.tsx         # Reusable form field components
│   ├── SocialButtons.tsx      # Social login buttons
│   ├── LoginCard.stories.tsx  # Storybook stories
│   ├── FormFields.stories.tsx
│   └── SocialButtons.stories.tsx
└── README.md                  # Component documentation

src/lib/validators/
└── auth.ts                    # Zod validation schemas

src/components/
└── icons.tsx                  # Brand icons

src/__tests__/
└── login.spec.tsx            # Test suite
```

## API Integration

### Custom Auth API

```tsx
// Example with custom auth API
const handleEmailPassword = async (data: { email: string; password: string }) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const result = await response.json();
  // Handle successful login
};
```

### NextAuth Integration

```tsx
// Example with NextAuth
import { signIn } from 'next-auth/react';

const handleEmailPassword = async (data: { email: string; password: string }) => {
  await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirect: false,
  });
};

const handleGoogle = async () => {
  await signIn('google', { redirect: false });
};

const handleGithub = async () => {
  await signIn('github', { redirect: false });
};
```

### Firebase Integration

```tsx
// Example with Firebase
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const handleEmailPassword = async (data: { email: string; password: string }) => {
  await signInWithEmailAndPassword(auth, data.email, data.password);
};

const handleGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};
```

## Customization

### Styling

The components use Tailwind CSS classes and can be customized by:

1. **Passing custom className props:**
```tsx
<LoginCard className="custom-login-card" />
```

2. **Using CSS variables for theming:**
```css
:root {
  --primary: your-primary-color;
  --background: your-background-color;
  /* ... other CSS variables */
}
```

3. **Overriding component styles:**
```tsx
<EmailField 
  register={register}
  className="custom-email-field"
/>
```

### Internationalization

The components support i18n through the `useI18n` hook:

```tsx
// Add translations to your i18n files
const translations = {
  "loginTitle": "Welcome back",
  "loginSubtitle": "Enter your credentials",
  // ... more translations
};
```

### Error Handling

Customize error messages by updating the `AUTH_ERRORS` constant:

```tsx
// src/lib/validators/auth.ts
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Your custom error message",
  // ... other errors
};
```

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- login.spec.tsx
```

### Writing Tests

```tsx
// Example test
import { render, screen } from '@testing-library/react';
import { LoginCard } from './LoginCard';

test('renders login form', () => {
  render(<LoginCard onSubmitEmailPassword={jest.fn()} />);
  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
});
```

## Storybook

### Run Storybook

```bash
npm run storybook
```

### View Stories

Open http://localhost:6006 to view all component stories.

## Accessibility

The components are built with accessibility in mind:

- ✅ ARIA labels and descriptions
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ Error announcements
- ✅ Color contrast compliance

### Testing Accessibility

```bash
# Run accessibility tests
npm run test:a11y

# Or use the Storybook a11y addon
npm run storybook
```

## Performance

The components are optimized for performance:

- ✅ Minimal re-renders
- ✅ Debounced validation
- ✅ Lazy loading support
- ✅ Optimized icons
- ✅ Efficient state management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Support

- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 13+

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Make sure all dependencies are properly installed
2. **Styling issues**: Check that Tailwind CSS is properly configured
3. **Test failures**: Ensure Jest is configured correctly
4. **Storybook issues**: Verify Storybook configuration

### Getting Help

1. Check the component README files
2. Review the test files for usage examples
3. Check the Storybook stories for visual examples
4. Open an issue if you encounter bugs

## Migration from Old Components

If you're migrating from the old login components:

1. **Backup your existing code**
2. **Update imports** to use the new component paths
3. **Update props** to match the new component interfaces
4. **Test thoroughly** to ensure everything works as expected
5. **Update styling** if needed to match the new design

## Contributing

When contributing to these components:

1. Follow the existing code style
2. Add tests for new features
3. Update Storybook stories
4. Update documentation
5. Ensure accessibility compliance
