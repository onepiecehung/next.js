# Animation Components

Reusable animation components inspired by [Animate UI](https://animate-ui.com) patterns, built with framer-motion and Tailwind CSS.

## Components

### `AnimatedSection`

Wrapper for page sections with automatic fade + slide up animation.

```tsx
import { AnimatedSection } from "@/components/shared";

<AnimatedSection loading={isLoading} data={data} className="py-8">
  <div>Your content here</div>
</AnimatedSection>
```

**Props:**
- `loading?: boolean` - Animation only plays when loading is false
- `data?: unknown` - Animation only plays when data exists
- `scrollTriggered?: boolean` - Use scroll-triggered animation (default: false)
- `variants?: Variants` - Custom animation variants
- All standard `motion.section` props

### `AnimatedGrid`

Wrapper for grid layouts with stagger animations. Automatically wraps children with motion.div.

```tsx
import { AnimatedGrid } from "@/components/shared";

<AnimatedGrid 
  loading={isLoading} 
  data={items} 
  className="grid grid-cols-3 gap-4"
>
  {items.map((item) => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</AnimatedGrid>
```

**Props:**
- `loading?: boolean` - Animation only plays when loading is false
- `data?: unknown[]` - Animation only plays when data exists and has items
- `scrollTriggered?: boolean` - Use scroll-triggered animation (default: false)
- `containerVariants?: Variants` - Custom container variants
- `itemVariants?: Variants` - Custom item variants
- All standard `motion.div` props

### `AnimatedHeader`

Wrapper for section headers with fade + slide down animation.

```tsx
import { AnimatedHeader } from "@/components/shared";

<AnimatedHeader loading={isLoading} data={data} className="mb-4">
  <h2>Section Title</h2>
</AnimatedHeader>
```

**Props:**
- `loading?: boolean` - Animation only plays when loading is false
- `data?: unknown` - Animation only plays when data exists
- `scrollTriggered?: boolean` - Use scroll-triggered animation (default: false)
- `variants?: Variants` - Custom animation variants
- All standard `motion.div` props

## Animation Variants

Pre-configured animation variants available in `@/lib/utils/animations`:

- `sectionVariants` - Fade + slide up for sections
- `containerVariants` - Stagger container for grids
- `itemVariants` - Stagger items for grids
- `headerVariants` - Fade + slide down for headers
- `slideRightVariants` - Slide in from right (for sidebars)
- `fadeVariants` - Simple fade in/out
- `scaleVariants` - Scale from center

## Integration with Skeletonize

All animation components automatically prevent conflicts with `Skeletonize`:

- When `loading = true`: Animation stays in "hidden" state
- When `loading = false` and data exists: Animation transitions to "visible"
- No animation plays on skeleton placeholders

## Example Usage

```tsx
import {
  AnimatedSection,
  AnimatedHeader,
  AnimatedGrid,
  Skeletonize,
} from "@/components/shared";

export default function MyPage() {
  const { data, isLoading } = useMyData();

  return (
    <AnimatedSection loading={isLoading} data={data} className="py-8">
      <div className="container mx-auto">
        <AnimatedHeader loading={isLoading} data={data} className="mb-4">
          <h1>My Page Title</h1>
        </AnimatedHeader>

        <Skeletonize loading={isLoading}>
          {data && (
            <AnimatedGrid
              loading={isLoading}
              data={data.items}
              className="grid grid-cols-3 gap-4"
            >
              {data.items.map((item) => (
                <Card key={item.id}>{item.name}</Card>
              ))}
            </AnimatedGrid>
          )}
        </Skeletonize>
      </div>
    </AnimatedSection>
  );
}
```

## Best Practices

1. **Always pass `loading` and `data` props** to prevent animation conflicts
2. **Use `Skeletonize` wrapper** for loading states
3. **Keep animations subtle** - users should notice smooth transitions, not jarring effects
4. **Use `scrollTriggered` for long pages** where sections appear on scroll
5. **Customize variants** only when needed - defaults are optimized for most cases

## Performance

- Animations use `framer-motion` with optimized spring physics
- `viewport={{ once: true }}` prevents re-animations on scroll
- Animation state is calculated once per render cycle
- No performance impact when `loading = true`

