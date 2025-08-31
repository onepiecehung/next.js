# UI Components

This directory contains all reusable UI components organized by functionality.

## Structure

```
ui/
├── core/           # Fundamental UI components (Button, Input, Label, Avatar)
├── layout/         # Layout components (Dialog, Form, Dropdown)
├── theme/          # Theme-related components (ThemeToggle)
├── dracula/        # Dracula theme components (DraculaButton, DraculaCard)
├── icons/          # Custom icons (XIcon)
├── utilities/      # Utility components (ClientOnly, Toaster)
├── navigation/     # Navigation components (UserDropdown)
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

- **Core**: Basic building blocks used everywhere
- **Layout**: Components that structure the page
- **Theme**: Components related to theming
- **Dracula**: Specialized Dracula theme components
- **Icons**: Custom icon implementations
- **Utilities**: Helper and utility components
- **Navigation**: Navigation-related components

## Migration from Old Structure

See `REFACTOR_UI_STRUCTURE.md` for detailed migration guide.
