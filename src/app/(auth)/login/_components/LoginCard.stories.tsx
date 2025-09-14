import type { Meta, StoryObj } from "@storybook/react";
import { LoginCard } from "./LoginCard";
import { fn } from "@storybook/test";

const meta: Meta<typeof LoginCard> = {
  title: "Auth/LoginCard",
  component: LoginCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Main login card component with email/password authentication and social login options.",
      },
    },
  },
  argTypes: {
    onSubmitEmailPassword: { action: "email/password submitted" },
    onGoogle: { action: "Google login clicked" },
    onGithub: { action: "GitHub login clicked" },
    onForgotPassword: { action: "forgot password clicked" },
    onOTPLogin: { action: "OTP login clicked" },
    onRegister: { action: "register clicked" },
    onBack: { action: "back clicked" },
    showBackButton: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    successMessage: { control: "text" },
    serverError: { control: "text" },
    socialError: { control: "text" },
  },
  args: {
    onSubmitEmailPassword: fn(),
    onGoogle: fn(),
    onGithub: fn(),
    onForgotPassword: fn(),
    onOTPLogin: fn(),
    onRegister: fn(),
    onBack: fn(),
    showBackButton: false,
    title: "Welcome back",
    description: "Enter your credentials to access your account",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default login card state
 * Shows the basic login form with all available options
 */
export const Default: Story = {};

/**
 * Login card with back button
 * Shows the login form with a back button in the header
 */
export const WithBackButton: Story = {
  args: {
    showBackButton: true,
    title: "Sign in to continue",
    description: "Please enter your credentials to access your account",
  },
};

/**
 * Login card with success message
 * Shows a success message at the top of the form
 */
export const WithSuccessMessage: Story = {
  args: {
    successMessage: "Account created successfully! Please sign in to continue.",
  },
};

/**
 * Login card with server error
 * Shows a server error message at the top of the form
 */
export const WithServerError: Story = {
  args: {
    serverError: "Invalid email or password. Please try again.",
  },
};

/**
 * Login card with social error
 * Shows a social login error message
 */
export const WithSocialError: Story = {
  args: {
    socialError: "Google login is temporarily unavailable. Please try again later.",
  },
};

/**
 * Login card with custom title and description
 * Shows custom title and description text
 */
export const WithCustomContent: Story = {
  args: {
    title: "Welcome to our platform",
    description: "Sign in to access your dashboard and manage your account",
  },
};

/**
 * Login card without social login
 * Shows only email/password form without social login options
 */
export const EmailPasswordOnly: Story = {
  args: {
    onGoogle: undefined,
    onGithub: undefined,
  },
};

/**
 * Login card without OTP option
 * Shows login form without OTP login link
 */
export const WithoutOTP: Story = {
  args: {
    onOTPLogin: undefined,
  },
};

/**
 * Login card without register option
 * Shows login form without register link
 */
export const WithoutRegister: Story = {
  args: {
    onRegister: undefined,
  },
};

/**
 * Login card without forgot password
 * Shows login form without forgot password link
 */
export const WithoutForgotPassword: Story = {
  args: {
    onForgotPassword: undefined,
  },
};

/**
 * Minimal login card
 * Shows only essential elements: email, password, and submit button
 */
export const Minimal: Story = {
  args: {
    onGoogle: undefined,
    onGithub: undefined,
    onForgotPassword: undefined,
    onOTPLogin: undefined,
    onRegister: undefined,
    title: "Sign in",
    description: "Enter your credentials",
  },
};

/**
 * Mobile view
 * Optimized for mobile devices with proper spacing and sizing
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

/**
 * Tablet view
 * Optimized for tablet devices
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
};

/**
 * Desktop view
 * Optimized for desktop devices
 */
export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
};
