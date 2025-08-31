# Global Loading State Implementation

## Overview
This document explains the implementation of a global loading state management system using Jotai atoms and React Context. This solution addresses the issue where skeleton loading states work well during navigation but not during page reloads.

## Problem Analysis

### Why Skeleton Loading Failed on F5 Reload:
1. **Hydration Mismatch**: Server renders with `loading = true`, client hydrates with same state
2. **Fast State Changes**: `useEffect` runs immediately and sets `loading = false` too quickly
3. **Local State**: Each component manages its own loading state independently
4. **No Persistence**: Loading state is lost during page refresh

### Why Navigation Works:
1. **Client-side Routing**: Components mount with fresh state
2. **Controlled Timing**: Loading states are properly managed during transitions
3. **State Persistence**: Navigation preserves component state

## Solution Architecture

### 1. Global State Management with Jotai
```typescript
// src/lib/auth-store.ts
export const userProfileLoadingAtom = atom<boolean>(false);
```

### 2. Context Provider for Easy Access
```typescript
// src/components/providers/loading-provider.tsx
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [userProfileLoading, setUserProfileLoading] = useAtom(userProfileLoadingAtom);
  
  const value: LoadingContextType = {
    userProfileLoading,
    setUserProfileLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}
```

### 3. Custom Hook for Components
```typescript
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
```

## Implementation Steps

### Step 1: Add Loading Provider to Layout
```typescript
// src/app/layout.tsx
<LoadingProvider>
  <SiteNav />
  {children}
</LoadingProvider>
```

### Step 2: Use Global Loading State in Components
```typescript
// In any component
const { userProfileLoading, setUserProfileLoading } = useLoading();

// Start loading
setUserProfileLoading(true);

// Stop loading
setUserProfileLoading(false);
```

### Step 3: Wrap Content with Skeletonize
```typescript
<Skeletonize loading={userProfileLoading}>
  {/* Your content here */}
</Skeletonize>
```

## Benefits of This Approach

### 1. **Consistent Loading States**
- All components use the same loading state
- No more individual component loading management
- Centralized control over loading behavior

### 2. **Better User Experience**
- Skeleton loading works consistently on both navigation and reload
- Loading states persist across component re-renders
- Smooth transitions between loading and loaded states

### 3. **Scalable Architecture**
- Easy to add new loading states for different features
- Components can control loading states from anywhere
- Loading logic is separated from component logic

### 4. **Performance Improvements**
- Reduced component re-renders
- Better state synchronization
- Optimized loading timing

## Usage Examples

### Basic Usage
```typescript
import { useLoading } from "@/components/providers/loading-provider";

function MyComponent() {
  const { userProfileLoading, setUserProfileLoading } = useLoading();
  
  const fetchData = async () => {
    setUserProfileLoading(true);
    try {
      // Fetch data
      await api.getData();
    } finally {
      setUserProfileLoading(false);
    }
  };
  
  return (
    <Skeletonize loading={userProfileLoading}>
      {/* Content */}
    </Skeletonize>
  );
}
```

### Multiple Loading States
```typescript
// You can easily extend this pattern for other loading states
export const articleLoadingAtom = atom<boolean>(false);
export const commentLoadingAtom = atom<boolean>(false);
```

## Testing

### Test Component
```typescript
// src/components/test-loading.tsx
export default function TestLoading() {
  const { userProfileLoading, setUserProfileLoading } = useLoading();
  
  const toggleLoading = () => {
    setUserProfileLoading(!userProfileLoading);
  };
  
  return (
    <Button onClick={toggleLoading}>
      Toggle Loading: {userProfileLoading ? "ON" : "OFF"}
    </Button>
  );
}
```

## Migration Guide

### From Local Loading State
```typescript
// Before (Local State)
const [loading, setLoading] = useState(true);

// After (Global State)
const { userProfileLoading, setUserProfileLoading } = useLoading();
```

### From Direct Atom Usage
```typescript
// Before (Direct Atom)
const [loading, setLoading] = useAtom(userProfileLoadingAtom);

// After (Context Hook)
const { userProfileLoading, setUserProfileLoading } = useLoading();
```

## Best Practices

### 1. **Always Use the Hook**
- Don't access atoms directly in components
- Use `useLoading()` hook for consistent API

### 2. **Reset Loading States**
- Always set loading to `false` in `finally` blocks
- Handle errors properly to prevent stuck loading states

### 3. **Loading State Naming**
- Use descriptive names for different loading states
- Follow consistent naming conventions

### 4. **Error Handling**
- Ensure loading states are reset even when errors occur
- Provide fallback UI for error states

## Troubleshooting

### Common Issues

#### 1. **Loading State Stuck**
- Check if `setUserProfileLoading(false)` is called in finally block
- Verify error handling doesn't prevent state reset

#### 2. **Hydration Mismatch**
- Ensure LoadingProvider wraps all components that use loading states
- Check for server/client state differences

#### 3. **Performance Issues**
- Avoid unnecessary loading state changes
- Use React.memo for components that don't need loading updates

## Future Enhancements

### 1. **Loading State Persistence**
- Save loading states to localStorage for better UX
- Implement loading state recovery after page refresh

### 2. **Advanced Loading Patterns**
- Sequential loading states
- Loading state priorities
- Loading state timeouts

### 3. **Analytics Integration**
- Track loading times
- Monitor loading state usage
- Performance metrics

## Conclusion

This global loading state implementation provides a robust, scalable solution for managing loading states across the application. It addresses the core issues with skeleton loading during page reloads while maintaining the benefits of client-side navigation.

The solution is:
- **Consistent**: All components use the same loading state management
- **Scalable**: Easy to extend for new features
- **Maintainable**: Centralized logic with clear separation of concerns
- **User-friendly**: Better loading experience across all scenarios

By implementing this solution, you'll have a professional-grade loading state management system that works reliably in all scenarios.
