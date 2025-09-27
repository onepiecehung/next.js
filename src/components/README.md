# Components Architecture

This directory contains all React components organized by functionality and responsibility.

## 🏗️ **Architecture Overview**

```
src/components/
├── ui/                    # Pure UI components (reusable)
│   ├── primitives/        # Basic building blocks
│   ├── layout/           # Layout components
│   ├── forms/            # Form-related components
│   ├── icons/            # Icon system
│   └── theme/            # Theme system
├── features/             # Feature-specific components
│   ├── auth/             # Authentication
│   ├── navigation/       # Navigation
│   └── text-editor/      # Rich text editor
├── providers/            # Context providers
└── utilities/            # Utility components
```

## 📁 **Directory Structure**

### **UI Components** (`/ui/`)
Pure, reusable components with no business logic.

- **`primitives/`** - Basic building blocks (Button, Input, Card, etc.)
- **`layout/`** - Layout components (Dialog, Dropdown, Form, etc.)
- **`forms/`** - Form-related components (FormField, InputOTP, etc.)
- **`icons/`** - Icon system (Brand icons, UI icons)
- **`theme/`** - Theme system (ThemeToggle, ThemeProvider, etc.)

### **Feature Components** (`/features/`)
Business-specific components that use UI components.

- **`auth/`** - Authentication (LoginForm, SignupForm, OTPForm, etc.)
- **`navigation/`** - Navigation (SiteNav, UserDropdown, LanguageSwitcher)
- **`text-editor/`** - Rich text editor (TipTapEditor, Mermaid, etc.)

### **Providers** (`/providers/`)
Context providers and state management.

- **`auth-provider.tsx`** - Authentication state
- **`i18n-provider.tsx`** - Internationalization
- **`theme-provider.tsx`** - Theme management
- **`loading-provider.tsx`** - Loading states
- **`no-ssr.tsx`** - Client-side rendering

### **Utilities** (`/utilities/`)
Helper components and utilities.

- **`skeletonize.tsx`** - Skeleton loading
- **`content-renderer.tsx`** - Content rendering
- **`client-only.tsx`** - Client-side components
- **`visually-hidden.tsx`** - Accessibility utilities

## 🚀 **Usage Examples**

### Import UI Components
```typescript
// Import specific components
import { Button, Input, Dialog } from "@/components/ui";

// Import from specific category
import { Button } from "@/components/ui/primitives";
import { Dialog } from "@/components/ui/layout";
import { FormField } from "@/components/ui/forms";
```

### Import Feature Components
```typescript
// Import auth components
import { LoginForm, SignupForm, OTPLoginForm } from "@/components/features/auth";

// Import navigation components
import { SiteNav, UserDropdown } from "@/components/features/navigation";

// Import text editor
import { TipTapEditor } from "@/components/features/text-editor";
```

### Import Providers
```typescript
// Import all providers
import { AuthProvider, ThemeProvider, I18nProvider } from "@/components/providers";

// Import specific provider
import { useI18n } from "@/components/providers";
```

### Import Utilities
```typescript
// Import utilities
import { Skeletonize, ContentRenderer } from "@/components/utilities";
```

## 🎯 **Design Principles**

### 1. **Separation of Concerns**
- **UI components**: Pure, reusable, no business logic
- **Feature components**: Business-specific, can use UI components
- **Providers**: Context and state management
- **Utilities**: Helper components

### 2. **Clear Import Paths**
- **UI components**: `@/components/ui`
- **Features**: `@/components/features/{feature}`
- **Providers**: `@/components/providers`
- **Utilities**: `@/components/utilities`

### 3. **Consistent Naming**
- **Files**: kebab-case (e.g., `login-form.tsx`)
- **Components**: PascalCase (e.g., `LoginForm`)
- **Directories**: kebab-case (e.g., `text-editor/`)

### 4. **Index Files**
Each directory has an `index.ts` file for clean imports:
```typescript
// Instead of
import { Button } from "@/components/ui/primitives/button";

// Use
import { Button } from "@/components/ui/primitives";
```

## 🔧 **Adding New Components**

### 1. **Choose the Right Category**
- **UI Component**: Goes in `/ui/` (primitives, layout, forms, icons, theme)
- **Feature Component**: Goes in `/features/{feature}/`
- **Provider**: Goes in `/providers/`
- **Utility**: Goes in `/utilities/`

### 2. **Create the Component**
```typescript
// src/components/ui/primitives/my-component.tsx
export function MyComponent() {
  return <div>My Component</div>;
}
```

### 3. **Export from Index**
```typescript
// src/components/ui/primitives/index.ts
export { MyComponent } from "./my-component";
```

### 4. **Update Main Index** (if needed)
```typescript
// src/components/ui/index.ts
export * from "./primitives";
```

## 🧪 **Testing Strategy**

### 1. **UI Components**
- Test rendering and props
- Test accessibility
- Test styling variants

### 2. **Feature Components**
- Test business logic
- Test user interactions
- Test integration with UI components

### 3. **Providers**
- Test context values
- Test state changes
- Test provider composition

## 📚 **Migration Guide**

### From Old Structure
```typescript
// Old imports
import { Button } from "@/components/ui/core";
import { LoginForm } from "@/components/auth";
import { useI18n } from "@/components/providers/i18n-provider";

// New imports
import { Button } from "@/components/ui/primitives";
import { LoginForm } from "@/components/features/auth";
import { useI18n } from "@/components/providers";
```

## 🎨 **Best Practices**

### 1. **Component Design**
- Keep components small and focused
- Use TypeScript for type safety
- Follow React best practices
- Use proper prop validation

### 2. **Styling**
- Use Tailwind CSS classes
- Follow design system patterns
- Use CSS variables for theming
- Ensure responsive design

### 3. **Accessibility**
- Use semantic HTML
- Add proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers

### 4. **Performance**
- Use React.memo when appropriate
- Lazy load heavy components
- Optimize bundle size
- Use proper dependency arrays

## 🔍 **Troubleshooting**

### Common Issues

1. **Import Errors**
   - Check file paths
   - Verify exports in index files
   - Ensure proper TypeScript configuration

2. **Styling Issues**
   - Check Tailwind classes
   - Verify CSS variable values
   - Test in different themes

3. **Type Errors**
   - Check TypeScript definitions
   - Verify prop types
   - Update interface definitions

### Getting Help

1. Check component documentation
2. Review similar components
3. Test in isolation
4. Check console for errors

This architecture provides a scalable, maintainable structure for React components while keeping concerns properly separated.
