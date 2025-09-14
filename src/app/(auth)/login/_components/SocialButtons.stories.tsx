import type { Meta, StoryObj } from "@storybook/react";
import { SocialButtons, SocialSeparator, SocialError } from "./SocialButtons";
import { fn } from "@storybook/test";

const meta: Meta<typeof SocialButtons> = {
  title: "Auth/SocialButtons",
  component: SocialButtons,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Social login buttons with individual loading states and error handling.",
      },
    },
  },
  argTypes: {
    onGoogle: { action: "Google login clicked" },
    onGithub: { action: "GitHub login clicked" },
    disabled: { control: "boolean" },
    oauthLoading: { 
      control: "select", 
      options: [null, "google", "github"] 
    },
  },
  args: {
    onGoogle: fn(),
    onGithub: fn(),
    disabled: false,
    oauthLoading: null,
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
 * Default social buttons
 * Shows both Google and GitHub login buttons
 */
export const Default: Story = {};

/**
 * Google button only
 * Shows only Google login button
 */
export const GoogleOnly: Story = {
  args: {
    onGithub: undefined,
  },
};

/**
 * GitHub button only
 * Shows only GitHub login button
 */
export const GitHubOnly: Story = {
  args: {
    onGoogle: undefined,
  },
};

/**
 * Google button loading
 * Shows Google button in loading state
 */
export const GoogleLoading: Story = {
  args: {
    oauthLoading: "google",
  },
};

/**
 * GitHub button loading
 * Shows GitHub button in loading state
 */
export const GitHubLoading: Story = {
  args: {
    oauthLoading: "github",
  },
};

/**
 * Buttons disabled
 * Shows both buttons in disabled state
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * Social separator
 * Shows the separator component used between form and social buttons
 */
export const Separator: Story = {
  render: () => <SocialSeparator />,
};

/**
 * Social separator with custom text
 * Shows the separator with custom text
 */
export const SeparatorCustomText: Story = {
  render: () => <SocialSeparator text="or sign in with" />,
};

/**
 * Social error message
 * Shows social login error message
 */
export const ErrorMessage: Story = {
  render: () => <SocialError error="Google login is temporarily unavailable. Please try again later." />,
};

/**
 * Complete social login section
 * Shows the complete social login section with separator and error handling
 */
export const CompleteSection: Story = {
  render: () => (
    <div className="space-y-4">
      <SocialSeparator />
      <SocialButtons 
        onGoogle={fn()} 
        onGithub={fn()} 
      />
      <SocialError error="One or more social login providers are currently unavailable." />
    </div>
  ),
};

/**
 * Mobile view
 * Optimized for mobile devices
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
