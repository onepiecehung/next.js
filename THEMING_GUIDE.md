# Theming System Guide

Hệ thống theming hoàn chỉnh đã được triển khai với tất cả các base colors và tính năng chuyển đổi theme.

## 🎨 Available Themes

### Base Colors
1. **Neutral** - Clean and minimal (default)
2. **Stone** - Warm and earthy
3. **Zinc** - Cool and modern  
4. **Gray** - Professional and balanced
5. **Slate** - Sophisticated and elegant
6. **Dracula** - Dark and vibrant

### Color Schemes
- **Light** - Light mode
- **Dark** - Dark mode
- **System** - Follows system preference

## 🚀 Usage

### 1. Theme Switcher Component

```tsx
import { ThemeSwitcher } from "@/components/ui/theme"

function MyComponent() {
  return (
    <div>
      <ThemeSwitcher />
    </div>
  )
}
```

### 2. Theme Toggle Components

```tsx
import { 
  ThemeToggle, 
  FullThemeToggle, 
  SimpleThemeToggle, 
  DraculaModeToggle 
} from "@/components/ui/theme"

function MyComponent() {
  return (
    <div className="flex gap-2">
      {/* Complete theme selector */}
      <FullThemeToggle showLabels={true} />
      
      {/* Quick light/dark toggle */}
      <SimpleThemeToggle />
      
      {/* Dracula-themed toggle */}
      <DraculaModeToggle />
      
      {/* Default variant */}
      <ThemeToggle variant="default" />
    </div>
  )
}
```

### 3. Theme Hook

```tsx
import { useTheme } from "@/components/providers/theme-provider"

function MyComponent() {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Current mode: {colorScheme}</p>
      <button onClick={() => setTheme("dracula")}>
        Switch to Dracula
      </button>
    </div>
  )
}
```

### 4. Theme Provider Setup

Đảm bảo ThemeProvider được wrap trong layout:

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/providers/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 5. CSS Variables

Tất cả themes sử dụng CSS variables với format OKLCH:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... more variables */
}
```

### 6. Tailwind Classes

Sử dụng các utility classes của Tailwind:

```tsx
<div className="bg-background text-foreground">
  <h1 className="text-primary">Primary Text</h1>
  <p className="text-muted-foreground">Muted Text</p>
  <button className="bg-primary text-primary-foreground">
    Primary Button
  </button>
</div>
```

## 🎯 Demo Page

Truy cập `/demo/theming` để xem:
- Tất cả themes available
- Component showcase
- Live CSS variables
- Interactive theme switcher

## 🔧 Configuration

### components.json
```json
{
  "tailwind": {
    "cssVariables": true,
    "baseColor": "neutral"
  }
}
```

### CSS Variables Structure
Mỗi theme có đầy đủ các variables:
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`
- `--border`, `--input`, `--ring`
- `--chart-1` đến `--chart-5`
- `--sidebar` và các variants

## 🎨 Adding New Themes

1. Thêm theme vào `globals.css`:

```css
[data-theme="new-theme"] {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... other variables */
}

[data-theme="new-theme"].dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... other variables */
}
```

2. Cập nhật theme switcher:

```tsx
const themes = [
  // ... existing themes
  { value: "new-theme", label: "New Theme", description: "Description" }
]
```

## 🌟 Features

- ✅ 6 base color themes (Neutral, Stone, Zinc, Gray, Slate, Dracula)
- ✅ Light/Dark/System color schemes
- ✅ CSS variables với OKLCH colors
- ✅ Persistent theme storage
- ✅ Smooth transitions
- ✅ TypeScript support
- ✅ Responsive design
- ✅ Accessibility friendly
- ✅ Multiple theme toggle variants
- ✅ Theme provider context
- ✅ Backward compatibility

## 📱 Responsive

Tất cả themes đều responsive và hoạt động tốt trên:
- Desktop
- Tablet  
- Mobile

## ♿ Accessibility

- High contrast ratios
- Color-blind friendly
- Keyboard navigation
- Screen reader support
- Reduced motion support

## 🔄 Migration

Nếu bạn đang sử dụng theme cũ, migration rất đơn giản:

1. Theme Dracula cũ vẫn hoạt động
2. Chỉ cần thêm `data-theme` attribute
3. CSS variables tự động apply

## 🐛 Troubleshooting

### Theme không apply
- Kiểm tra `data-theme` attribute trên `<html>`
- Verify CSS variables được load
- Check localStorage có theme data

### Colors không đúng
- Clear browser cache
- Check CSS variables syntax
- Verify Tailwind config

### Performance issues
- Themes được cache trong localStorage
- CSS variables được optimize
- Minimal re-renders

## 📚 Resources

- [Tailwind CSS Colors](https://tailwindcss.com/docs/colors)
- [OKLCH Color Space](https://oklch.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Radix UI Themes](https://www.radix-ui.com/themes)

---

**Happy Theming! 🎨✨**
