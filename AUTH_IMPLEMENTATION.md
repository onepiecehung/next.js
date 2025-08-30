# Email/Password Login Implementation with JWT

This document describes the complete implementation of an email/password authentication system with JWT tokens in a Next.js 14+ application.

## 🚀 Features

- **Modal-based Login Dialog** (similar to Zenn)
- **JWT Token Management** with automatic refresh
- **Secure Token Storage** (access tokens in memory, refresh tokens via HttpOnly cookies)
- **Fallback Support** for refresh tokens in localStorage (demo purposes)
- **Protected Routes** with client-side guards
- **Automatic Token Refresh** on 401 responses
- **Toast Notifications** for user feedback

## 🏗️ Architecture

### Security Model

1. **Primary (Recommended)**: Backend sets refresh tokens as HttpOnly Secure SameSite=Lax cookies
2. **Fallback**: Backend returns refresh tokens in response body (stored in localStorage for demo)

### Token Management

- **Access Token**: Stored in memory (Jotai atom) - not persisted
- **Refresh Token**: HttpOnly cookie (primary) or localStorage (fallback)
- **Auto-refresh**: Automatic token refresh on 401 responses with retry mechanism

## 📁 File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Toaster and AuthProvider
│   ├── page.tsx            # Home page with navigation
│   └── write/
│       └── page.tsx        # Protected write page
├── components/
│   ├── auth/
│   │   └── login-dialog.tsx # Login modal with form validation
│   ├── providers/
│   │   └── auth-provider.tsx # Jotai state provider
│   ├── site-nav.tsx        # Navigation with login/logout
│   └── ui/                 # shadcn/ui components
└── lib/
    ├── auth-store.ts       # Jotai atoms and auth actions
    └── http.ts             # Axios instance with interceptors
```

## 🔧 Setup Instructions

### 1. Environment Configuration

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### 2. Backend API Endpoints

Your backend should implement these endpoints:

#### POST /auth/login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "accessToken": "jwt_access_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

**With Refresh Token (Fallback):**
```json
{
  "accessToken": "jwt_access_token_here",
  "refreshToken": "jwt_refresh_token_here",
  "user": { ... }
}
```

**Cookie-based (Primary):**
- Set `Set-Cookie: refresh_token=jwt_refresh_token_here; HttpOnly; Secure; SameSite=Lax`

#### POST /auth/refresh

**Cookie-based:**
- No body required, reads refresh token from cookie
- Returns: `{ "accessToken": "new_jwt_token" }`

**Fallback:**
```json
{
  "refreshToken": "jwt_refresh_token_here"
}
```

#### POST /auth/logout
- Clears refresh token cookie (if cookie-based)
- Returns: `200 OK`

#### GET /me
- Requires `Authorization: Bearer <accessToken>` header
- Returns: `{ "id", "email", "name", "avatarUrl" }`

## 🔐 Security Features

### Token Security
- **Access tokens** are never stored in localStorage
- **Refresh tokens** are stored in HttpOnly cookies (primary) or localStorage (fallback)
- Automatic token refresh with request queuing
- Secure token clearing on logout

### Route Protection
- Client-side authentication guards
- Automatic redirects for unauthenticated users
- Protected routes (e.g., `/write`)

## 🎯 Usage Examples

### Login Flow
1. User clicks "Login" button in navigation
2. Modal opens with email/password form
3. Form validation using Zod schema
4. API call to `/auth/login`
5. Tokens stored and user state updated
6. Modal closes, user sees personalized navigation

### Protected Route Access
1. User navigates to `/write`
2. Component checks authentication state
3. If not authenticated: redirect to home
4. If authenticated: render protected content

### Automatic Token Refresh
1. API call returns 401 Unauthorized
2. Interceptor automatically calls `/auth/refresh`
3. New access token stored in memory
4. Original request retried with new token
5. User experience remains seamless

## 🧪 Testing

### Development Server
```bash
yarn dev
```

### Build Check
```bash
yarn build
```

### Test Scenarios
1. **Unauthenticated Access**: Visit `/write` → should redirect to home
2. **Login Flow**: Click login → enter credentials → should see user menu
3. **Protected Route**: After login, visit `/write` → should show editor
4. **Logout**: Click logout → should clear state and show login button

## ⚠️ Important Notes

### Production Considerations
- **Remove fallback localStorage refresh token storage**
- **Ensure backend sets HttpOnly cookies for refresh tokens**
- **Use HTTPS in production for secure cookie transmission**
- **Implement proper CSRF protection**

### Fallback Warning
The current implementation includes fallback refresh token storage in localStorage for demonstration purposes. This is **not secure for production** and should be removed once your backend properly implements HttpOnly cookie-based refresh tokens.

## 🔄 State Management

### Jotai Atoms
- `accessTokenAtom`: Current access token (in memory)
- `currentUserAtom`: Current user information
- `authLoadingAtom`: Authentication loading state

### Actions
- `loginAction(email, password)`: Handle login
- `fetchMeAction()`: Fetch current user
- `logoutAction()`: Handle logout

## 🎨 UI Components

### shadcn/ui Components Used
- `Dialog`: Login modal
- `Button`: Various buttons throughout
- `Input`: Form inputs
- `Label`: Form labels
- `Form`: Form handling with react-hook-form
- `Sonner`: Toast notifications

### Styling
- Tailwind CSS for styling
- Responsive design
- Consistent with shadcn/ui design system

## 🚨 Troubleshooting

### Common Issues

1. **Build Errors**: Check TypeScript path mapping in `tsconfig.json`
2. **Import Errors**: Ensure all components use correct `@/` import paths
3. **Authentication Failures**: Verify backend endpoints and CORS configuration
4. **Token Refresh Issues**: Check cookie settings and backend implementation

### Debug Mode
Enable console logging to debug authentication flow:
- Check browser console for token refresh logs
- Monitor network requests for authentication calls
- Verify cookie storage in browser dev tools

## 📚 Dependencies

```json
{
  "axios": "^1.11.0",
  "jotai": "^2.13.1",
  "react-hook-form": "^7.62.0",
  "zod": "^4.1.5",
  "@hookform/resolvers": "^5.2.1"
}
```

## 🔗 Related Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Jotai State Management](https://jotai.org/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
