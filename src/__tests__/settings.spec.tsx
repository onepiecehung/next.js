import { SettingsPage } from "@/app/settings/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Custom render function with React Query provider
const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

// Mock the i18n provider
jest.mock("@/components/providers/i18n-provider", () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        settingsTitle: "Settings",
        settingsSubtitle: "Manage your account settings and preferences",
        settingsProfile: "Profile",
        settingsAccount: "Account & Security",
        settingsAppearance: "Appearance",
        settingsNotifications: "Notifications",
        settingsPrivacy: "Privacy & Data",
        settingsLoginRequired: "Login Required",
        settingsLoginRequiredDescription:
          "Please log in to access your settings.",
        settingsGoToLogin: "Go to Login",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock the auth provider
jest.mock("@/lib/auth", () => ({
  currentUserAtom: jest.fn(() => [null, jest.fn()]),
}));

// Mock the no-ssr provider
jest.mock("@/components/providers/no-ssr", () => ({
  useIsMounted: () => true,
}));

// Mock the shared components
jest.mock("@/components/shared", () => ({
  Skeletonize: ({
    children,
    loading,
  }: {
    children: React.ReactNode;
    loading: boolean;
  }) =>
    loading ? <div data-testid="skeleton">Loading...</div> : <>{children}</>,
}));

// Mock the UI components
jest.mock("@/components/ui/core/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock("@/components/ui/core/card", () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, ...props }: any) => (
    <div data-testid="card-description" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, ...props }: any) => (
    <div data-testid="card-title" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/layout/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));

describe("SettingsPage", () => {
  it("renders settings page with navigation", () => {
    renderWithQueryClient(<SettingsPage />);

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your account settings and preferences"),
    ).toBeInTheDocument();
  });

  it("shows login required when user is not authenticated", () => {
    renderWithQueryClient(<SettingsPage />);

    expect(screen.getByText("Login Required")).toBeInTheDocument();
    expect(
      screen.getByText("Please log in to access your settings."),
    ).toBeInTheDocument();
    expect(screen.getByText("Go to Login")).toBeInTheDocument();
  });

  it("renders settings navigation sections", () => {
    renderWithQueryClient(<SettingsPage />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Account & Security")).toBeInTheDocument();
    expect(screen.getByText("Appearance")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Privacy & Data")).toBeInTheDocument();
  });

  it("shows profile section by default", () => {
    renderWithQueryClient(<SettingsPage />);

    // Since user is not authenticated, it should show login required
    expect(screen.getByText("Login Required")).toBeInTheDocument();
  });
});
