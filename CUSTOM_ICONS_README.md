# Custom Icons with Lucide React

## Overview
This guide explains how to create and use custom icons with lucide-react using the `createLucideIcon` function. This is particularly useful for icons that are no longer available in the main package (like the old Twitter icon) or for creating brand-specific icons.

## Why Custom Icons?

### 1. **Deprecated Icons**
- Some icons like `Twitter` have been removed from lucide-react
- New branding (like X/Twitter) requires custom implementation
- Maintains consistency with existing icon system

### 2. **Brand-Specific Icons**
- Company logos and brand icons
- Custom design requirements
- Unique icon needs

### 3. **Extended Functionality**
- Icons that don't exist in the main package
- Specialized use cases
- Custom styling requirements

## Implementation

### 1. **Create Custom Icon Component**

```typescript
// src/components/ui/x-icon.tsx
import { createLucideIcon } from "lucide-react";
import "./x-icon.css";

const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H.298Z",
      stroke: "none",
      fill: "currentColor",
      className: "x-icon",
    },
  ],
]);

export { XIcon };
```

### 2. **Add Custom Styling (Optional)**

```css
/* src/components/ui/x-icon.css */
.x-icon {
  display: inline-block;
  vertical-align: middle;
}

.x-icon:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
```

### 3. **Create Index File for Easy Importing**

```typescript
// src/components/ui/custom-icons.tsx
export { XIcon } from "./x-icon";
// Add more custom icons here
```

## Usage

### **Direct Import**
```typescript
import { XIcon } from "@/components/ui/x-icon";

function MyComponent() {
  return (
    <Button variant="ghost" size="sm">
      <XIcon className="h-4 w-4" />
    </Button>
  );
}
```

### **Index Import**
```typescript
import { XIcon } from "@/components/ui/custom-icons";

function MyComponent() {
  return <XIcon className="h-4 w-4" />;
}
```

## How `createLucideIcon` Works

### **Function Signature**
```typescript
createLucideIcon(name: string, paths: Array<[string, object]>)
```

### **Parameters**
- **name**: The name of the icon (used for accessibility)
- **paths**: Array of SVG path definitions

### **Path Structure**
```typescript
[
  "path",           // SVG element type
  {
    d: "...",       // SVG path data
    stroke: "...",  // Stroke color
    fill: "...",    // Fill color
    className: "...", // Custom CSS class
    // ... other SVG attributes
  }
]
```

## SVG Path Data

### **Getting SVG Path Data**
1. **From Design Tools**: Export SVG from Figma, Sketch, etc.
2. **From Existing Icons**: Inspect SVG elements in browser
3. **Manual Creation**: Create paths using vector tools

### **Example SVG to Path Conversion**
```svg
<!-- Original SVG -->
<svg viewBox="0 0 24 24">
  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H.298Z"/>
</svg>

<!-- Converted to createLucideIcon -->
const XIcon = createLucideIcon("X", [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H.298Z",
      stroke: "none",
      fill: "currentColor",
    },
  ],
]);
```

## Best Practices

### 1. **Icon Naming**
- Use descriptive names (e.g., `XIcon`, `BrandLogoIcon`)
- Follow PascalCase convention
- Include "Icon" suffix for clarity

### 2. **File Organization**
- Place custom icons in `src/components/ui/`
- Use consistent file naming (`icon-name.tsx`)
- Create index files for easy importing

### 3. **SVG Optimization**
- Remove unnecessary attributes
- Optimize path data
- Use appropriate viewBox dimensions

### 4. **Styling**
- Use CSS classes for custom styling
- Leverage existing design system colors
- Maintain consistency with other icons

## Advanced Features

### **Multiple Paths**
```typescript
const ComplexIcon = createLucideIcon("Complex", [
  ["path", { d: "M1 1h22v22H1z", fill: "currentColor" }],
  ["circle", { cx: "12", cy: "12", r: "3", fill: "white" }],
]);
```

### **Custom Attributes**
```typescript
const CustomIcon = createLucideIcon("Custom", [
  [
    "path",
    {
      d: "...",
      stroke: "currentColor",
      strokeWidth: "2",
      fill: "none",
      className: "custom-icon",
      "data-testid": "custom-icon",
    },
  ],
]);
```

### **Responsive Icons**
```typescript
const ResponsiveIcon = createLucideIcon("Responsive", [
  [
    "path",
    {
      d: "...",
      className: "responsive-icon",
      style: { minWidth: "1em", height: "auto" },
    },
  ],
]);
```

## Troubleshooting

### **Common Issues**

#### 1. **Icon Not Displaying**
- Check SVG path data is correct
- Verify viewBox dimensions
- Ensure proper import/export

#### 2. **Styling Issues**
- Check CSS class names
- Verify CSS file imports
- Use browser dev tools to inspect

#### 3. **TypeScript Errors**
- Ensure proper type definitions
- Check import paths
- Verify component exports

### **Debugging Tips**
- Use browser dev tools to inspect SVG elements
- Check console for import errors
- Verify file paths and exports
- Test with simple path data first

## Examples

### **Simple Icon**
```typescript
const StarIcon = createLucideIcon("Star", [
  ["path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" }],
]);
```

### **Icon with Multiple Elements**
```typescript
const MailIcon = createLucideIcon("Mail", [
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }],
  ["path", { d: "M22 7l-8 5-8-5" }],
]);
```

### **Brand Icon**
```typescript
const GitHubIcon = createLucideIcon("GitHub", [
  ["path", { d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" }],
]);
```

## Migration from Deprecated Icons

### **Before (Deprecated)**
```typescript
import { Twitter } from "lucide-react";

function Component() {
  return <Twitter className="h-4 w-4" />;
}
```

### **After (Custom Icon)**
```typescript
import { XIcon } from "@/components/ui/x-icon";

function Component() {
  return <XIcon className="h-4 w-4" />;
}
```

## Conclusion

Custom icons with lucide-react provide a powerful way to extend the icon system while maintaining consistency and functionality. By using `createLucideIcon`, you can:

- Replace deprecated icons
- Add brand-specific icons
- Create custom designs
- Maintain consistent API
- Leverage existing styling system

This approach ensures your icon system remains flexible and maintainable while providing the exact icons you need for your application.
