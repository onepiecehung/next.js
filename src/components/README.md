# Components Directory Structure

This directory contains all React components organized by functionality and domain.

## Structure

```
src/components/
├── features/              # Feature-based components organized by domain
│   ├── auth/             # Authentication components
│   │   ├── login-dialog.tsx
│   │   ├── login-form-shared.tsx
│   │   ├── login-form.tsx
│   │   ├── otp-login-form.tsx
│   │   ├── protected-route.tsx
│   │   ├── signup-form.tsx
│   │   └── index.ts
│   ├── navigation/       # Navigation components
│   │   ├── site-nav.tsx
│   │   └── index.ts
│   ├── text-editor/      # Text editing components
│   │   ├── color-highlight-popover.tsx
│   │   ├── image-dialog.tsx
│   │   ├── link-dialog.tsx
│   │   ├── mermaid-extension.tsx
│   │   ├── mermaid-renderer.tsx
│   │   ├── tiptap-editor.tsx
│   │   ├── tiptap-editor.css
│   │   └── index.ts
│   └── index.ts          # Features exports
├── providers/            # Context providers and global state
│   ├── auth-provider.tsx
│   ├── i18n-provider.tsx
│   ├── loading-provider.tsx
│   ├── no-ssr.tsx
│   └── theme-provider.tsx
├── shared/               # Shared utility components
│   ├── skeletonize.tsx
│   ├── test-loading.tsx
│   ├── with-auto-skeleton.tsx
│   └── index.ts
├── ui/                   # Reusable UI components
│   ├── core/            # Basic building blocks
│   ├── layout/          # Layout components
│   ├── theme/           # Theme components
│   ├── dracula/         # Dracula theme components
│   ├── icons/           # Custom icons
│   ├── utilities/       # UI utilities
│   ├── navigation/      # UI navigation components
│   └── index.ts         # UI exports
└── index.ts             # Main exports
```

## Usage

### Import from Main Index (Recommended)
```typescript
import { 
  LoginDialog, 
  TipTapEditor, 
  Skeletonize,
  Button,
  ThemeProvider 
} from "@/components";
```

### Import from Specific Categories
```typescript
// Feature components
import { LoginDialog, SignupForm } from "@/components/features/auth";
import { SiteNav } from "@/components/features/navigation";
import { TipTapEditor } from "@/components/features/text-editor";

// UI components
import { Button, Input, Card } from "@/components/ui/core";
import { Dialog, Form } from "@/components/ui/layout";
import { ThemeToggle } from "@/components/ui/theme";

// Shared components
import { Skeletonize, WithAutoSkeleton } from "@/components/shared";

// Providers
import { AuthProvider, I18nProvider } from "@/components/providers";
```

## Organization Principles

### 1. **Features** (`/features/`)
- Components specific to a business domain or feature
- Contains business logic and domain-specific functionality
- Examples: auth, navigation, text-editor

### 2. **UI** (`/ui/`)
- Reusable, generic UI components
- No business logic, pure presentation
- Organized by component type (core, layout, theme, etc.)

### 3. **Shared** (`/shared/`)
- Utility components used across multiple features
- Common functionality that doesn't fit in UI or features
- Examples: skeleton loading, auto-skeleton wrapper

### 4. **Providers** (`/providers/`)
- Context providers and global state management
- App-wide configuration and state
- Examples: auth, theme, i18n, loading states

## Migration from Old Structure

This structure was refactored from a flatter organization to improve:
- **Scalability**: Easy to add new features
- **Maintainability**: Clear separation of concerns
- **Discoverability**: Intuitive organization
- **Reusability**: Clear distinction between UI and feature components

### Key Changes:
- Moved auth components from `/auth/` to `/features/auth/`
- Moved text-editor from `/ui/text-editor/` to `/features/text-editor/`
- Moved site-nav from root to `/features/navigation/`
- Created `/shared/` for utility components
- Consolidated all exports in main `index.ts`

## Adding New Components

1. **Determine the category**:
   - Feature-specific? → `/features/[domain]/`
   - Reusable UI? → `/ui/[category]/`
   - Shared utility? → `/shared/`
   - Global state? → `/providers/`

2. **Create the component** in the appropriate directory

3. **Export from the category's `index.ts`**

4. **Update main `index.ts`** if needed

5. **Update this README** with the new component
