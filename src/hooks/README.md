# Hooks Directory

Custom React hooks organized by category for better maintainability and discoverability.

## 📁 Structure

```
hooks/
├── auth/           # Authentication & authorization hooks
├── article/        # Article management hooks
├── content/        # Content rendering & processing hooks
├── media/          # Media upload & management hooks
└── ui/             # UI utilities & theme hooks
```

## 🎯 Usage

### Import from category

```tsx
// Auth hooks
import { useLogin, useAuthRedirect, useRequireAuth } from '@/hooks/auth';

// Article hooks
import { useArticle, useArticleForm, useCreateArticle } from '@/hooks/article';

// Content hooks
import { useContentRenderer, useSyntaxHighlighting } from '@/hooks/content';

// Media hooks
import { useImageUpload } from '@/hooks/media';

// UI hooks
import { useTheme, useLoadingDelay } from '@/hooks/ui';
```

### Import from root (all hooks)

```tsx
import { useLogin, useArticle, useTheme } from '@/hooks';
```

## 📚 Categories

### Auth (`/auth`)
- `useLogin` - Email/password and OAuth login logic
- `useAuthRedirect` - Redirect authenticated users
- `useRequireAuth` - Protect routes requiring authentication

### Article (`/article`)
- `useArticle` - Fetch single article with retry mechanism
- `useArticleForm` - Article form state and validation
- `useCreateArticle` - Create/save article logic

### Content (`/content`)
- `useContentRenderer` - Render HTML with syntax highlighting & Mermaid
- `useCustomImageRenderer` - Process custom image tags
- `useSyntaxHighlighting` - Syntax highlighting for code blocks

### Media (`/media`)
- `useImageUpload` - Upload images via MediaAPI

### UI (`/ui`)
- `useTheme` - Theme management (dark/light/system)
- `useLoadingDelay` - Prevent loading flicker on fast requests

## 🔧 Adding New Hooks

1. **Determine category** - Choose appropriate folder or create new one
2. **Create hook file** - Add `useYourHook.ts` in category folder
3. **Export from index** - Add export to category's `index.ts`
4. **Update root index** - Export is automatically included via `export * from "./category"`

### Example: Adding new auth hook

```typescript
// 1. Create: src/hooks/auth/usePasswordReset.ts
export function usePasswordReset() {
  // ... implementation
}

// 2. Export: src/hooks/auth/index.ts
export { usePasswordReset } from "./usePasswordReset";

// 3. Use anywhere:
import { usePasswordReset } from '@/hooks/auth';
```

## 📝 Best Practices

- ✅ Keep hooks focused on single responsibility
- ✅ Use TypeScript for type safety
- ✅ Export types/interfaces alongside hooks
- ✅ Document complex hooks with JSDoc comments
- ✅ Write tests for hooks with complex logic
- ✅ Use meaningful names: `use[Action][Subject]`

## 🎨 Naming Conventions

- Hook files: `useFeatureName.ts` or `useFeatureName.tsx` (if JSX needed)
- Category folders: lowercase, plural (e.g., `auth`, `articles`)
- Exports: Named exports (not default)

