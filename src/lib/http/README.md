# HTTP Module

Modular HTTP client with automatic token management, refresh, and rate limiting.

## 📁 Structure

```
src/lib/http/
├── client.ts              # Axios instances (http, publicHttp)
├── token-manager.ts       # Token storage & management
├── token-refresh.ts       # Automatic token refresh logic
├── rate-limit-handler.ts  # Rate limit (429) handling
├── interceptors.ts        # Request/response interceptors
├── index.ts               # Main exports
└── README.md              # This file
```

## 🚀 Usage

### Basic HTTP Requests

```typescript
import { http, publicHttp } from '@/lib/http';

// Authenticated request (automatically adds Bearer token)
const response = await http.get('/users/me');

// Public request (no authentication)
const data = await publicHttp.get('/articles');

// POST request
const article = await http.post('/articles', {
  title: 'My Article',
  content: 'Content here...'
});

// PATCH request
const updated = await http.patch('/articles/123', {
  title: 'Updated Title'
});

// DELETE request
await http.delete('/articles/123');
```

### Token Management

```typescript
import { 
  setAccessToken, 
  getAccessToken,
  setRefreshToken,
  clearAllTokens,
  hasValidToken
} from '@/lib/http';

// After login, store tokens
setAccessToken(response.data.token.accessToken);
setRefreshToken(response.data.token.refreshToken);

// Check if user is authenticated
if (hasValidToken()) {
  console.log('User is logged in');
}

// Get current access token
const token = getAccessToken();

// Logout - clear all tokens
clearAllTokens();
```

### Rate Limit Handling

```typescript
import { 
  isRateLimited, 
  getRemainingCooldown,
  emitRateLimitEvent 
} from '@/lib/http';

// Check if currently rate limited
if (isRateLimited()) {
  const seconds = getRemainingCooldown();
  console.log(`Rate limited for ${seconds} more seconds`);
}

// Manually trigger rate limit UI notification
emitRateLimitEvent();
```

### Manual Token Refresh

```typescript
import { refreshAccessToken } from '@/lib/http';

try {
  const newToken = await refreshAccessToken();
  console.log('Token refreshed successfully');
} catch (error) {
  console.error('Failed to refresh token', error);
  // User will be logged out automatically
}
```

## 🔄 Automatic Features

### 1. Token Attachment
Every request automatically includes the access token:
```
Authorization: Bearer <access_token>
```

### 2. Automatic Token Refresh
When API returns 401 (Unauthorized):
- Automatically attempts to refresh the access token
- Retries the original request with new token
- Queues multiple requests during refresh
- Clears tokens and logs out if refresh fails

### 3. Rate Limit Protection
When API returns 429 (Too Many Requests):
- Blocks all requests during cooldown period
- Shows UI notification to user
- Respects `Retry-After` header from API
- Automatically resumes after cooldown

## 🏗️ Architecture

### Separation of Concerns

Each module has a single responsibility:

1. **client.ts** - HTTP client configuration
2. **token-manager.ts** - Token storage (memory + localStorage)
3. **token-refresh.ts** - Refresh logic & queue management
4. **rate-limit-handler.ts** - Rate limit detection & handling
5. **interceptors.ts** - Request/response interception

### Request Flow

```
┌─────────────────┐
│  Your Code      │
│  http.get(...)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Request         │
│ Interceptor     │──► Check rate limit
│                 │──► Attach token
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Server     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Response        │
│ Interceptor     │──► Handle 401 → Refresh token
│                 │──► Handle 429 → Rate limit
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Your Code      │
│  response.data  │
└─────────────────┘
```

### Token Refresh Flow

```
Request fails with 401
         │
         ▼
Is refresh in progress? ──Yes──► Add to queue
         │                       Wait for refresh
         No                      Retry with new token
         │
         ▼
Start refresh process
         │
         ▼
Call /auth/refresh-token
         │
    ┌────┴────┐
    │         │
Success    Failure
    │         │
    │         ▼
    │    Clear tokens
    │    Process queue (reject all)
    │    User logged out
    │
    ▼
Set new token
Process queue (resolve all)
Retry original request
```

## 🎯 Design Principles

### 1. **Modularity**
Each concern is in its own file, making it easy to:
- Test individual components
- Understand the codebase
- Modify specific behaviors
- Reuse logic elsewhere

### 2. **Type Safety**
Full TypeScript support with:
- Proper type definitions
- Type inference
- No `any` types
- Clear interfaces

### 3. **Error Handling**
Graceful error handling:
- Network errors
- Token refresh failures
- Rate limit violations
- API errors

### 4. **Performance**
Optimized for performance:
- In-memory token storage (fast)
- Request queuing during refresh (no duplicate refreshes)
- Efficient rate limit checking

### 5. **Developer Experience**
Easy to use:
- Simple import: `import { http } from '@/lib/http'`
- Automatic token management
- Clear error messages
- Comprehensive documentation

## 📝 Configuration

### Environment Variables

```env
# API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

### Axios Configuration

Modify `client.ts` to customize:

```typescript
export const http = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false,
  timeout: 30000,              // Request timeout
  headers: {
    'Content-Type': 'application/json',
    // Add custom headers here
  },
});
```

## 🔐 Security

### Access Token
- Stored in **memory only** (not localStorage)
- Lost on page refresh (requires re-login or refresh token)
- Never exposed to XSS attacks via localStorage

### Refresh Token
- Stored in **localStorage** as fallback
- Should ideally be in HttpOnly cookie (backend feature)
- Automatically cleared on refresh failure

### Best Practices
1. Use HTTPS in production
2. Set short access token expiry (e.g., 15 minutes)
3. Set longer refresh token expiry (e.g., 7 days)
4. Implement refresh token rotation on backend
5. Clear tokens on logout

## 🧪 Testing

### Unit Tests Example

```typescript
import { 
  setAccessToken, 
  getAccessToken, 
  clearAllTokens 
} from '@/lib/http';

describe('Token Manager', () => {
  it('should store and retrieve access token', () => {
    setAccessToken('test-token');
    expect(getAccessToken()).toBe('test-token');
  });

  it('should clear all tokens', () => {
    setAccessToken('test-token');
    clearAllTokens();
    expect(getAccessToken()).toBeNull();
  });
});
```

## 🔄 Migration Guide

### From Old `http.ts`

The old monolithic `http.ts` has been refactored into a modular structure. All exports remain the same:

**Before:**
```typescript
import { http, setAccessToken } from '@/lib/http.ts';
```

**After:**
```typescript
import { http, setAccessToken } from '@/lib/http';
```

The old `http.ts` file has been removed. All imports now point to the new modular structure in `src/lib/http/`.

## 📚 Related Files

- `src/lib/rate-limit.ts` - Rate limit state management
- `src/lib/api/` - API wrapper classes using this HTTP client
- `src/hooks/auth/` - Authentication hooks
- `src/components/providers/auth-provider.tsx` - Auth context

## 🐛 Troubleshooting

### Token not being attached
```typescript
// Make sure token is set after login
setAccessToken(token);

// Verify token is stored
console.log(getAccessToken()); // Should not be null
```

### Infinite refresh loop
```typescript
// Check if refresh endpoint is excluded from interceptors
// The refresh call uses a separate axios instance
```

### Rate limit not working
```typescript
// Verify rate-limit module is properly imported
import { getRateLimitUntil } from '@/lib/rate-limit';
```

## 🚀 Future Improvements

- [ ] Add request retry logic with exponential backoff
- [ ] Implement request cancellation
- [ ] Add request/response logging in development
- [ ] Support multiple API base URLs
- [ ] Add request caching layer
- [ ] Implement offline queue for failed requests

## 📖 References

- [Axios Documentation](https://axios-http.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

