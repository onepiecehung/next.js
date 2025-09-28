# UI Components

This directory contains all reusable UI components organized by functionality.

## Structure

```
ui/
├── core/           # Fundamental UI components (Button, Input, Label, Avatar, Badge, Card)
├── layout/         # Layout components (Dialog, Form, Dropdown, Separator)
├── theme/          # Theme-related components (ThemeToggle, ThemeSwitcher, etc.)
├── dracula/        # Dracula theme components (DraculaButton, DraculaCard)
├── icons/          # Custom icons (XIcon, GitHubIcon)
├── utilities/      # Utility components (ClientOnly, Toaster, ContentRenderer)
├── navigation/     # Navigation components (UserDropdown, LanguageSwitcher)
├── text-editor/    # Text editor components (moved to features/text-editor)
└── index.ts        # Main export file
```

## Usage

### Import from Main Index (Recommended)
```typescript
import { Button, Avatar, Dialog, XIcon } from "@/components/ui";
```

### Import from Specific Category
```typescript
import { Button } from "@/components/ui/core";
import { Dialog } from "@/components/ui/layout";
import { XIcon } from "@/components/ui/icons";
import { UserDropdown } from "@/components/ui/navigation";
import { ContentRenderer } from "@/components/ui/utilities";
import { TipTapEditor } from "@/components/features/text-editor";
```

### Import Entire Category
```typescript
import * as Core from "@/components/ui/core";
import * as Layout from "@/components/ui/layout";

// Usage
<Core.Button>Click me</Core.Button>
<Layout.Dialog>Content</Layout.Dialog>
```

## Adding New Components

1. **Choose appropriate category** based on component functionality
2. **Create component file** in the category directory
3. **Export from category index.ts**
4. **Update main index.ts** if needed
5. **Update this README** with new component

## Categories Explained

- **Core**: Basic building blocks used everywhere (Button, Input, Label, Avatar, Badge, Card)
- **Layout**: Components that structure the page (Dialog, Form, Dropdown, Separator)
- **Theme**: Components related to theming (ThemeToggle, ThemeSwitcher, ThemeComparison, etc.)
- **Dracula**: Specialized Dracula theme components (DraculaButton, DraculaCard)
- **Icons**: Custom icon implementations (XIcon, GitHubIcon)
- **Utilities**: Helper and utility components (ClientOnly, Toaster, ContentRenderer)
- **Navigation**: Navigation-related components (UserDropdown, LanguageSwitcher)
- **Text Editor**: Rich text editing components (moved to features/text-editor)

## Migration from Old Structure

See `REFACTOR_UI_STRUCTURE.md` for detailed migration guide.
