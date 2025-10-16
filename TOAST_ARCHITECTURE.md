# Toast Message Architecture Pattern

## 🎯 Expert Developer Approach: Toast trong Hook

### ✅ **Recommended Pattern: Toast trong Hook**

```typescript
// ✅ GOOD: Toast logic trong hook
export function useCreateArticle() {
  const { t } = useI18n();
  
  return useMutation({
    mutationFn: ArticleAPI.createArticle,
    onSuccess: (article) => {
      // Business logic + Toast trong hook
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(t("articleCreateSuccess", "article"));
    },
    onError: (error) => {
      toast.error(t("articleCreateError", "article"));
    },
  });
}

// Component chỉ focus vào UI logic
export default function WritePage() {
  const { mutate: createArticle } = useCreateArticle();
  
  const handleSubmit = (data) => {
    createArticle(data, {
      onSuccess: (article) => {
        // Chỉ handle UI-specific logic
        resetForm();
        router.push(`/article/${article.id}`);
      },
    });
  };
}
```

### ❌ **Anti-pattern: Toast trong Component**

```typescript
// ❌ BAD: Toast logic scattered trong component
export default function WritePage() {
  const { mutate: createArticle } = useCreateArticle();
  
  const handleSubmit = (data) => {
    createArticle(data, {
      onSuccess: (article) => {
        // Toast logic duplicated across components
        toast.success("Article created!");
        resetForm();
        router.push(`/article/${article.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
}
```

## 🏗️ **Architecture Benefits**

### 1. **Separation of Concerns**
- **Hook**: Business logic + User feedback
- **Component**: UI logic + User interaction

### 2. **Reusability**
```typescript
// Hook có thể được sử dụng ở nhiều nơi
const CreateArticleDialog = () => {
  const { mutate: createArticle } = useCreateArticle(); // Toast tự động
};

const QuickPublishButton = () => {
  const { mutate: createArticle } = useCreateArticle(); // Toast tự động
};
```

### 3. **Consistency**
- Toast messages được standardize trong hook
- Không có duplicate toast logic
- Error handling consistent across app

### 4. **Testability**
```typescript
// Dễ dàng test toast behavior
const { result } = renderHook(() => useCreateArticle());
act(() => {
  result.current.mutate(mockData);
});
expect(mockToast.success).toHaveBeenCalledWith("Article created!");
```

### 5. **Maintainability**
- Thay đổi toast logic chỉ cần sửa ở hook
- Component không cần biết về toast implementation
- Centralized error handling

## 📊 **Pattern Comparison**

| Aspect | Toast trong Hook | Toast trong Component |
|--------|------------------|----------------------|
| **Reusability** | ✅ High | ❌ Low |
| **Consistency** | ✅ High | ❌ Low |
| **Testability** | ✅ Easy | ❌ Hard |
| **Maintainability** | ✅ Easy | ❌ Hard |
| **Separation of Concerns** | ✅ Good | ❌ Poor |
| **Code Duplication** | ✅ Low | ❌ High |

## 🎯 **Best Practices**

### 1. **Hook Design**
```typescript
export function useCreateArticle() {
  const { t } = useI18n();
  
  return useMutation({
    mutationFn: ArticleAPI.createArticle,
    onSuccess: (article) => {
      // 1. Business logic first
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      
      // 2. Toast with context-aware messages
      switch (article.status) {
        case 'draft':
          toast.info(t("draftSaved"));
          break;
        case 'published':
          toast.success(t("articlePublished"));
          break;
        case 'scheduled':
          toast.success(t("articleScheduled"));
          break;
      }
    },
    onError: (error) => {
      // 3. Error handling with meaningful messages
      const message = extractErrorMessage(error, t("defaultError"));
      toast.error(message);
    },
  });
}
```

### 2. **Component Design**
```typescript
export default function WritePage() {
  const { mutate: createArticle, isPending } = useCreateArticle();
  
  const handleSubmit = (data) => {
    createArticle(data, {
      onSuccess: (article) => {
        // Only UI-specific logic
        resetForm();
        router.push(`/article/${article.id}`);
      },
      // onError handled by hook
    });
  };
}
```

### 3. **Error Handling**
```typescript
// Centralized error message extraction
function extractErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error?.response?.data?.message) {
    return error.response.data.message;
  }
  return defaultMessage;
}
```

## 🚀 **Migration Strategy**

### Step 1: Move toast logic to hook
### Step 2: Update component to use simplified callback
### Step 3: Remove duplicate toast imports from components
### Step 4: Test toast behavior in hook tests
### Step 5: Verify consistency across app

## 📝 **Conclusion**

**Expert developers prefer toast trong hook** vì:
- Better separation of concerns
- Higher reusability and consistency
- Easier testing and maintenance
- Cleaner component code
- Centralized error handling

This pattern follows the **Single Responsibility Principle** và **Don't Repeat Yourself (DRY)** principle, making the codebase more maintainable và scalable.
