import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

// Mock jotai
jest.mock('jotai', () => ({
  useAtom: jest.fn(() => [null, jest.fn()]),
  atom: jest.fn(),
}))

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {} },
    setError: jest.fn(),
    clearErrors: jest.fn(),
  })),
}))

// Mock @hookform/resolvers
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}))

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}))

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
}))

// Mock i18n provider
jest.mock('@/components/providers/i18n-provider', () => ({
  useI18n: () => ({
    t: (key, namespace) => key,
  }),
}))

// Mock auth store
jest.mock('@/lib/auth-store', () => ({
  currentUserAtom: jest.fn(),
  accessTokenAtom: jest.fn(),
  authLoadingAtom: jest.fn(),
  loginAction: jest.fn(),
  loginWithGoogleAction: jest.fn(),
  loginWithGithubAction: jest.fn(),
}))

// Mock auth redirect hook
jest.mock('@/hooks/useAuthRedirect', () => ({
  useAuthRedirect: jest.fn(),
}))

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})

// Suppress console warnings in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
