# Types Organization

This directory contains all TypeScript types and interfaces used throughout the application, organized by category for better maintainability and reusability.

## 📁 File Structure

```
src/lib/types/
├── index.ts          # Main export file - exports all types
├── api.ts            # API-related types (requests, responses, entities)
├── forms.ts          # Form validation schemas and types
├── ui.ts             # UI component types and common interfaces
└── README.md         # This documentation file
```

## 🚀 Usage

### Import from index (Recommended)
```typescript
import type { User, ApiResponse, LoginFormData, ButtonProps } from "@/lib/types"
```

### Import from specific files
```typescript
import type { User } from "@/lib/types/api"
import type { LoginFormData } from "@/lib/types/forms"
import type { ButtonProps } from "@/lib/types/ui"
```

## 📋 Type Categories

### 1. **API Types** (`api.ts`)
- **Base Response**: `ApiResponse<T>`, `ApiErrorResponse`, `SuccessResponse`
- **User Entity**: `User` interface matching your API response
- **Authentication**: `LoginRequest`, `LoginResponse`, `RefreshTokenResponse`
- **User Management**: `UpdateProfileRequest`, `ChangePasswordRequest`
- **Pagination**: `PaginatedResponse<T>`, `PaginationMeta`

### 2. **Form Types** (`forms.ts`)
- **Validation Schemas**: Zod schemas for form validation
- **Form Data Types**: Inferred types from validation schemas
- **Forms Covered**: Login, Registration, Profile Update, Password Management

### 3. **UI Types** (`ui.ts`)
- **Component Props**: `ButtonProps`, `InputProps`, `DialogProps`
- **Navigation**: `NavItem`, `BreadcrumbItem`
- **Tables**: `TableProps<T>`, `TableColumn<T>`
- **Forms**: `FormField`, `FormSection`
- **Common**: `LoadingState`, `SearchFilters`, `PaginationProps`

## 🔧 Adding New Types

### 1. **API Types**
Add to `api.ts`:
```typescript
export interface NewApiResponse {
  // your interface here
}
```

### 2. **Form Types**
Add to `forms.ts`:
```typescript
export const newFormSchema = z.object({
  // your schema here
})

export type NewFormData = z.infer<typeof newFormSchema>
```

### 3. **UI Types**
Add to `ui.ts`:
```typescript
export interface NewComponentProps {
  // your props here
}
```

### 4. **Export from index**
Update `index.ts`:
```typescript
export * from "./new-category"
```

## 📝 Best Practices

1. **Use Generic Types**: `ApiResponse<T>`, `PaginatedResponse<T>`
2. **Extend Base Interfaces**: Create specific types that extend common ones
3. **Use Zod for Forms**: Leverage Zod's type inference for form data
4. **Consistent Naming**: Use descriptive names like `UserProfileResponse` not `UserResp`
5. **Document Complex Types**: Add JSDoc comments for complex interfaces

## 🔄 Type Updates

When your API response structure changes:

1. **Update the interface** in `api.ts`
2. **Update related functions** that use the type
3. **Update tests** if you have them
4. **Update documentation** if needed

## 🎯 Example Usage

### In Components
```typescript
import type { User, ButtonProps } from "@/lib/types"

interface UserCardProps {
  user: User
  onEdit: () => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  // Component implementation
}
```

### In API Functions
```typescript
import type { ApiResponse, LoginRequest, LoginResponse } from "@/lib/types"

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await http.post<ApiResponse<LoginResponse>>("/auth/login", credentials)
  
  if (!response.data.success) {
    throw new Error(response.data.message)
  }
  
  return response.data.data
}
```

### In Forms
```typescript
import type { LoginFormData } from "@/lib/types"
import { loginFormSchema } from "@/lib/types"

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema)
  })
  
  // Form implementation
}
```

## 🚨 Common Issues

1. **Circular Dependencies**: Avoid importing types from components
2. **Type Conflicts**: Use unique names for different concepts
3. **Missing Exports**: Always export new types from index.ts
4. **Generic Constraints**: Use proper constraints for generic types

## 🔗 Related Files

- `src/lib/http.ts` - Uses API types for HTTP requests
- `src/lib/auth-store.ts` - Uses authentication types
- `src/components/` - Components use UI types
- `src/app/` - Pages use various types
