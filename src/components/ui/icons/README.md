# Custom Icons System

This directory contains custom icon components built using `lucide-react`'s `createLucideIcon` function. **Only brand icons that are not available in lucide-react are included here.** For standard UI icons, use lucide-react directly.

## Structure

```
src/components/ui/icons/
├── index.ts                 # Main export file
├── custom-icons.tsx         # Centralized exports
├── README.md               # This documentation
├── google-icon.tsx         # Google brand icon
├── google-icon.css         # Google icon styles
├── github-icon.tsx         # GitHub brand icon
├── github-icon.css         # GitHub icon styles
├── x-icon.tsx              # X (Twitter) icon
├── x-icon.css              # X icon styles
└── custom-icons.tsx        # Centralized exports
```

## Usage

### Import Icons

```tsx
// Import custom brand icons
import { GoogleIcon, GitHubIcon, XIcon } from "@/components/ui/icons";

// Import standard UI icons from lucide-react
import { Mail, Lock, User, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
```

### Use in Components

```tsx
import { GoogleIcon, GitHubIcon } from "@/components/ui/icons";
import { Mail, Lock, User, Loader2 } from "lucide-react";

function LoginForm() {
  return (
    <div>
      {/* Brand icons - custom */}
      <GoogleIcon className="w-4 h-4" />
      <GitHubIcon className="w-5 h-5" />
      
      {/* UI icons - from lucide-react */}
      <Mail className="w-6 h-6" />
      <Lock className="w-4 h-4" />
      <User className="w-4 h-4" />
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>
  );
}
```

## Available Icons

### Custom Brand Icons (Only these are custom)
- **GoogleIcon** - Google brand icon with official colors
- **GitHubIcon** - GitHub brand icon  
- **XIcon** - X (formerly Twitter) brand icon

### Standard UI Icons (Use lucide-react directly)
- **Mail** - Email/mail icon for OTP forms
- **Lock** - Lock icon for password fields
- **User** - User icon for email fields
- **ArrowLeft** - Back navigation arrow
- **RefreshCw** - Refresh/resend functionality
- **Loader2** - Loading spinner with built-in animation
- **Eye, EyeOff** - Show/hide password
- **And many more...** - Check [lucide-react icons](https://lucide.dev/icons)

## Icon Properties

All icons support standard Lucide React props:

```tsx
interface IconProps {
  className?: string;        // CSS classes
  size?: number;            // Icon size in pixels
  color?: string;           // Icon color
  strokeWidth?: number;     // Stroke width for outlined icons
  // ... other Lucide props
}
```

## Styling

Each icon has its own CSS file for custom styling:

```css
/* Example: google-icon.css */
.google-icon {
  display: inline-block;
  vertical-align: middle;
}

.google-icon:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
```

## Creating New Icons

**Only create custom icons for brand icons that are not available in lucide-react.**

### Before Creating Custom Icons
1. **Check lucide-react first**: Visit [lucide.dev/icons](https://lucide.dev/icons) to see if the icon already exists
2. **Use lucide-react icons**: For standard UI icons, use lucide-react directly
3. **Only create custom for brands**: Only create custom icons for brand logos (Google, GitHub, etc.)

### Creating Custom Brand Icons

1. **Create the icon component:**
```tsx
// new-brand-icon.tsx
import { createLucideIcon } from "lucide-react";
import "./new-brand-icon.css";

const NewBrandIcon = createLucideIcon("NewBrandIcon", [
  [
    "path",
    {
      d: "your-svg-path-data",
      stroke: "none",
      fill: "currentColor", // or specific brand colors
      className: "new-brand-icon",
      key: "new-brand-icon",
    },
  ],
]);

export { NewBrandIcon };
```

2. **Create the CSS file:**
```css
/* new-brand-icon.css */
.new-brand-icon {
  display: inline-block;
  vertical-align: middle;
}

.new-brand-icon:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
```

3. **Export from custom-icons.tsx:**
```tsx
export { NewBrandIcon } from "./new-brand-icon";
```

4. **Export from index.ts:**
```tsx
export { NewBrandIcon } from "./new-brand-icon";
```

## Best Practices

### 1. **Consistent Naming**
- Use PascalCase for component names
- Use kebab-case for file names
- Use descriptive names that indicate purpose

### 2. **SVG Optimization**
- Use `currentColor` for stroke/fill when possible
- Keep paths simple and optimized
- Use appropriate strokeWidth (usually 2)

### 3. **Accessibility**
- Always include `aria-hidden="true"` for decorative icons
- Provide meaningful `className` for styling
- Use semantic names that describe the icon's purpose

### 4. **Performance**
- Icons are tree-shakable
- Import only what you need
- Use CSS for hover effects instead of JavaScript

## Migration from Old Icons

If migrating from the old `src/components/icons.tsx`:

1. **Update imports:**
```tsx
// Old
import { GoogleIcon } from "@/components/icons";

// New
import { GoogleIcon } from "@/components/ui/icons";
```

2. **Update usage:**
```tsx
// Old usage with size prop
<GoogleIcon size={16} className="w-4 h-4" />

// New usage (size is handled by className)
<GoogleIcon className="w-4 h-4" />
```

3. **Remove old file:**
```bash
rm src/components/icons.tsx
```

## Troubleshooting

### Common Issues

1. **Icon not displaying:**
   - Check import path
   - Verify icon is exported from index.ts
   - Check for typos in component name

2. **Styling not applied:**
   - Ensure CSS file is imported
   - Check className is applied correctly
   - Verify CSS specificity

3. **TypeScript errors:**
   - Ensure proper type definitions
   - Check import/export statements
   - Verify component props

### Getting Help

1. Check the icon's CSS file for styling issues
2. Verify the icon is properly exported
3. Check the component's TypeScript definitions
4. Review the Lucide React documentation

## Examples

### Login Form with Icons
```tsx
import { GoogleIcon, GitHubIcon } from "@/components/ui/icons";
import { User, Lock, Loader2 } from "lucide-react";

function LoginForm() {
  return (
    <form>
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
        <input type="email" placeholder="Email" />
      </div>
      
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
        <input type="password" placeholder="Password" />
      </div>
      
      <button type="button">
        <GoogleIcon className="w-4 h-4" />
        Continue with Google
      </button>
    </form>
  );
}
```

### Loading State
```tsx
import { Loader2 } from "lucide-react";

function LoadingButton() {
  return (
    <button disabled>
      <Loader2 className="w-4 h-4 animate-spin" />
      Loading...
    </button>
  );
}
```

This icon system provides a consistent, maintainable way to use icons throughout your application while following best practices for accessibility and performance.
