import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginCard } from "@/app/(auth)/login/_components/LoginCard";
import {
  EmailField,
  PasswordField,
} from "@/app/(auth)/login/_components/FormFields";
import { SocialButtons } from "@/app/(auth)/login/_components/SocialButtons";

// Mock the i18n provider
jest.mock("@/components/providers/i18n-provider", () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        loginTitle: "Welcome back",
        loginSubtitle: "Enter your credentials to access your account",
        toastLoginSuccess: "Login successful!",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("LoginCard", () => {
  const mockOnSubmitEmailPassword = jest.fn();
  const mockOnGoogle = jest.fn();
  const mockOnGithub = jest.fn();
  const mockOnForgotPassword = jest.fn();
  const mockOnOTPLogin = jest.fn();
  const mockOnRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form with email and password fields", () => {
    render(
      <LoginCard
        onSubmitEmailPassword={mockOnSubmitEmailPassword}
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        onForgotPassword={mockOnForgotPassword}
        onOTPLogin={mockOnOTPLogin}
        onRegister={mockOnRegister}
      />,
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for invalid email", async () => {
    const user = userEvent.setup();
    render(
      <LoginCard
        onSubmitEmailPassword={mockOnSubmitEmailPassword}
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        onForgotPassword={mockOnForgotPassword}
        onOTPLogin={mockOnOTPLogin}
        onRegister={mockOnRegister}
      />,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i),
      ).toBeInTheDocument();
    });
  });

  it("shows validation errors for short password", async () => {
    const user = userEvent.setup();
    render(
      <LoginCard
        onSubmitEmailPassword={mockOnSubmitEmailPassword}
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        onForgotPassword={mockOnForgotPassword}
        onOTPLogin={mockOnOTPLogin}
        onRegister={mockOnRegister}
      />,
    );

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(passwordInput, "123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 6 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("calls onSubmitEmailPassword with valid data", async () => {
    const user = userEvent.setup();
    render(
      <LoginCard
        onSubmitEmailPassword={mockOnSubmitEmailPassword}
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        onForgotPassword={mockOnForgotPassword}
        onOTPLogin={mockOnOTPLogin}
        onRegister={mockOnRegister}
      />,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmitEmailPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("shows loading state when submitting", async () => {
    const user = userEvent.setup();
    mockOnSubmitEmailPassword.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <LoginCard
        onSubmitEmailPassword={mockOnSubmitEmailPassword}
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        onForgotPassword={mockOnForgotPassword}
        onOTPLogin={mockOnOTPLogin}
        onRegister={mockOnRegister}
      />,
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /signing in/i }),
      ).toBeDisabled();
    });
  });

  it("calls onGoogle when Google button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <LoginCard
        onSubmitEmailPassword={mockOnSubmitEmailPassword}
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        onForgotPassword={mockOnForgotPassword}
        onOTPLogin={mockOnOTPLogin}
        onRegister={mockOnRegister}
      />,
    );

    const googleButton = screen.getByRole("button", {
      name: /continue with google/i,
    });
    await user.click(googleButton);

    expect(mockOnGoogle).toHaveBeenCalled();
  });

  it("calls onGithub when GitHub button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <LoginCard
        onSubmitEmailPassword={mockOnSubmitEmailPassword}
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        onForgotPassword={mockOnForgotPassword}
        onOTPLogin={mockOnOTPLogin}
        onRegister={mockOnRegister}
      />,
    );

    const githubButton = screen.getByRole("button", {
      name: /continue with github/i,
    });
    await user.click(githubButton);

    expect(mockOnGithub).toHaveBeenCalled();
  });

  it("calls onForgotPassword when forgot password link is clicked", async () => {
    const user = userEvent.setup();
    render(
      <LoginCard
        onSubmitEmailPassword={mockOnSubmitEmailPassword}
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        onForgotPassword={mockOnForgotPassword}
        onOTPLogin={mockOnOTPLogin}
        onRegister={mockOnRegister}
      />,
    );

    const forgotPasswordLink = screen.getByText(/forgot password/i);
    await user.click(forgotPasswordLink);

    expect(mockOnForgotPassword).toHaveBeenCalled();
  });

  it("calls onOTPLogin when OTP login link is clicked", async () => {
    const user = userEvent.setup();
    render(
      <LoginCard
        onSubmitEmailPassword={mockOnSubmitEmailPassword}
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        onForgotPassword={mockOnForgotPassword}
        onOTPLogin={mockOnOTPLogin}
        onRegister={mockOnRegister}
      />,
    );

    const otpLink = screen.getByText(/sign in with verification code/i);
    await user.click(otpLink);

    expect(mockOnOTPLogin).toHaveBeenCalled();
  });

  it("calls onRegister when register link is clicked", async () => {
    const user = userEvent.setup();
    render(
      <LoginCard
        onSubmitEmailPassword={mockOnSubmitEmailPassword}
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        onForgotPassword={mockOnForgotPassword}
        onOTPLogin={mockOnOTPLogin}
        onRegister={mockOnRegister}
      />,
    );

    const registerLink = screen.getByText(/sign up/i);
    await user.click(registerLink);

    expect(mockOnRegister).toHaveBeenCalled();
  });
});

describe("EmailField", () => {
  it("renders email input with proper accessibility attributes", () => {
    const mockRegister = jest.fn();
    render(<EmailField register={mockRegister} />);

    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("placeholder", "you@example.com");
  });

  it("shows error message when error is provided", () => {
    const mockRegister = jest.fn();
    const error = { message: "Email is required" };

    render(<EmailField register={mockRegister} error={error} />);

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toHaveAttribute(
      "role",
      "alert",
    );
  });

  it("disables input when disabled prop is true", () => {
    const mockRegister = jest.fn();
    render(<EmailField register={mockRegister} disabled={true} />);

    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeDisabled();
  });
});

describe("PasswordField", () => {
  it("renders password input with show/hide toggle", () => {
    const mockRegister = jest.fn();
    render(<PasswordField register={mockRegister} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByLabelText(/show password/i);

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(toggleButton).toBeInTheDocument();
  });

  it("toggles password visibility when toggle button is clicked", async () => {
    const user = userEvent.setup();
    const mockRegister = jest.fn();
    render(<PasswordField register={mockRegister} />);

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByLabelText(/show password/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByLabelText(/hide password/i)).toBeInTheDocument();
  });

  it("shows forgot password link when onForgotPassword is provided", () => {
    const mockRegister = jest.fn();
    const mockOnForgotPassword = jest.fn();

    render(
      <PasswordField
        register={mockRegister}
        onForgotPassword={mockOnForgotPassword}
      />,
    );

    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it("calls onForgotPassword when forgot password link is clicked", async () => {
    const user = userEvent.setup();
    const mockRegister = jest.fn();
    const mockOnForgotPassword = jest.fn();

    render(
      <PasswordField
        register={mockRegister}
        onForgotPassword={mockOnForgotPassword}
      />,
    );

    const forgotPasswordLink = screen.getByText(/forgot password/i);
    await user.click(forgotPasswordLink);

    expect(mockOnForgotPassword).toHaveBeenCalled();
  });
});

describe("SocialButtons", () => {
  it("renders Google button when onGoogle is provided", () => {
    const mockOnGoogle = jest.fn();
    render(<SocialButtons onGoogle={mockOnGoogle} />);

    expect(
      screen.getByRole("button", { name: /continue with google/i }),
    ).toBeInTheDocument();
  });

  it("renders GitHub button when onGithub is provided", () => {
    const mockOnGithub = jest.fn();
    render(<SocialButtons onGithub={mockOnGithub} />);

    expect(
      screen.getByRole("button", { name: /continue with github/i }),
    ).toBeInTheDocument();
  });

  it("shows loading state for Google button when oauthLoading is google", () => {
    const mockOnGoogle = jest.fn();
    render(<SocialButtons onGoogle={mockOnGoogle} oauthLoading="google" />);

    expect(screen.getByText(/connecting/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue with google/i }),
    ).toBeDisabled();
  });

  it("shows loading state for GitHub button when oauthLoading is github", () => {
    const mockOnGithub = jest.fn();
    render(<SocialButtons onGithub={mockOnGithub} oauthLoading="github" />);

    expect(screen.getByText(/connecting/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue with github/i }),
    ).toBeDisabled();
  });

  it("disables all buttons when disabled prop is true", () => {
    const mockOnGoogle = jest.fn();
    const mockOnGithub = jest.fn();

    render(
      <SocialButtons
        onGoogle={mockOnGoogle}
        onGithub={mockOnGithub}
        disabled={true}
      />,
    );

    expect(
      screen.getByRole("button", { name: /continue with google/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /continue with github/i }),
    ).toBeDisabled();
  });
});
