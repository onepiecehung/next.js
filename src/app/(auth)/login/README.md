# Login Components

This directory contains the refactored login components with improved UX/UI, accessibility, and developer experience.

## Components

### `LoginCard`
Main login card component that handles email/password authentication with social login options.

**Props:**
- `onSubmitEmailPassword?: (data: { email: string; password: string }) => Promise<void> | void`
- `onGoogle?: () => Promise<void> | void`
- `onGithub?: () => Promise<void> | void`
- `onForgotPassword?: () => void`
- `onOTPLogin?: () => void`
- `onRegister?: () => void`
- `onBack?: () => void`
- `showBackButton?: boolean`
- `title?: string`
- `description?: string`
- `successMessage?: string`
- `serverError?: string`
- `socialError?: string`

### `FormFields`
Reusable form field components with built-in validation and accessibility.

**Components:**
- `EmailField` - Email input with icon and validation
- `PasswordField` - Password input with show/hide toggle and forgot password link
- `OTPField` - OTP input with number-only validation
- `FormError` - Error message display
- `FormSuccess` - Success message display

### `SocialButtons`
Social login buttons with individual loading states.

**Components:**
- `SocialButtons` - Google and GitHub login buttons
- `SocialSeparator` - Visual separator between form and social login
- `SocialError` - Social login error display

## Features

### ✅ Accessibility
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Error announcements with `aria-live`

### ✅ UX/UI
- Mobile-first responsive design
- Loading states for all actions
- Clear visual hierarchy
- Consistent spacing and typography
- Hover and focus states

### ✅ Form Validation
- Client-side validation with Zod
- Real-time error display
- Server error mapping
- User-friendly error messages

### ✅ Developer Experience
- TypeScript support
- Comprehensive prop interfaces
- Reusable components
- Easy customization
- Storybook documentation

## Usage

### Basic Usage

```tsx
import { LoginCard } from "./_components/LoginCard";

function LoginPage() {
  const handleEmailPassword = async (data) => {
    // Handle email/password login
  };

  const handleGoogle = async () => {
    // Handle Google OAuth
  };

  const handleGithub = async () => {
    // Handle GitHub OAuth
  };

  return (
    <LoginCard
      onSubmitEmailPassword={handleEmailPassword}
      onGoogle={handleGoogle}
      onGithub={handleGithub}
      onForgotPassword={() => router.push("/forgot-password")}
      onOTPLogin={() => router.push("/auth/login?mode=otp")}
      onRegister={() => router.push("/auth/register")}
    />
  );
}
```

### NextAuth Integration

```tsx
import { signIn } from "next-auth/react";

const handleEmailPassword = async (data) => {
  await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });
};

const handleGoogle = async () => {
  await signIn("google", { redirect: false });
};

const handleGithub = async () => {
  await signIn("github", { redirect: false });
};
```

### Custom Styling

```tsx
<LoginCard
  className="custom-login-card"
  title="Welcome to our platform"
  description="Sign in to access your dashboard"
  // ... other props
/>
```

## Testing

Run the test suite:

```bash
npm test -- login.spec.tsx
```

## Storybook

View component stories:

```bash
npm run storybook
```

## Accessibility Checklist

- [x] All form inputs have proper labels
- [x] Error messages are announced to screen readers
- [x] Focus management is handled correctly
- [x] Keyboard navigation works properly
- [x] Color contrast meets WCAG standards
- [x] Touch targets are at least 44px
- [x] Text is readable at 200% zoom

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Support

- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 13+

## Performance

- Components are optimized for re-renders
- Form validation is debounced
- Loading states prevent multiple submissions
- Icons are optimized SVGs
