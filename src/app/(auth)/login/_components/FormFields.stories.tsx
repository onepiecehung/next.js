import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validators/auth";
import { EmailField, PasswordField, OTPField, FormError, FormSuccess } from "./FormFields";

// Wrapper component for form fields that need react-hook-form
const FormWrapper = ({ children, ...props }: any) => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  return (
    <div className="w-full max-w-sm space-y-4">
      {typeof children === "function" ? children(form) : children}
    </div>
  );
};

const meta: Meta<typeof EmailField> = {
  title: "Auth/FormFields",
  component: EmailField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Reusable form field components for authentication forms.",
      },
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

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Email field in default state
 * Shows email input with icon and proper accessibility
 */
export const EmailFieldDefault: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <EmailField register={form.register} />
      )}
    </FormWrapper>
  ),
};

/**
 * Email field with error
 * Shows email input with validation error
 */
export const EmailFieldWithError: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <EmailField 
          register={form.register} 
          error={{ message: "Please enter a valid email address" }}
        />
      )}
    </FormWrapper>
  ),
};

/**
 * Email field disabled
 * Shows disabled email input
 */
export const EmailFieldDisabled: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <EmailField 
          register={form.register} 
          disabled={true}
        />
      )}
    </FormWrapper>
  ),
};

/**
 * Password field in default state
 * Shows password input with show/hide toggle
 */
export const PasswordFieldDefault: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <PasswordField register={form.register} />
      )}
    </FormWrapper>
  ),
};

/**
 * Password field with forgot password link
 * Shows password input with forgot password link
 */
export const PasswordFieldWithForgot: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <PasswordField 
          register={form.register} 
          onForgotPassword={() => console.log("Forgot password clicked")}
        />
      )}
    </FormWrapper>
  ),
};

/**
 * Password field with error
 * Shows password input with validation error
 */
export const PasswordFieldWithError: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <PasswordField 
          register={form.register} 
          error={{ message: "Password must be at least 6 characters" }}
        />
      )}
    </FormWrapper>
  ),
};

/**
 * Password field disabled
 * Shows disabled password input
 */
export const PasswordFieldDisabled: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <PasswordField 
          register={form.register} 
          disabled={true}
        />
      )}
    </FormWrapper>
  ),
};

/**
 * OTP field in default state
 * Shows OTP input with number-only validation
 */
export const OTPFieldDefault: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <OTPField register={form.register} />
      )}
    </FormWrapper>
  ),
};

/**
 * OTP field with error
 * Shows OTP input with validation error
 */
export const OTPFieldWithError: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <OTPField 
          register={form.register} 
          error={{ message: "OTP code must be 6 digits" }}
        />
      )}
    </FormWrapper>
  ),
};

/**
 * OTP field disabled
 * Shows disabled OTP input
 */
export const OTPFieldDisabled: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <OTPField 
          register={form.register} 
          disabled={true}
        />
      )}
    </FormWrapper>
  ),
};

/**
 * Form error message
 * Shows error message with proper styling
 */
export const FormErrorMessage: Story = {
  render: () => (
    <FormError error="Invalid email or password. Please try again." />
  ),
};

/**
 * Form success message
 * Shows success message with proper styling
 */
export const FormSuccessMessage: Story = {
  render: () => (
    <FormSuccess message="Account created successfully! Please sign in to continue." />
  ),
};

/**
 * All form fields together
 * Shows all form fields in a complete form layout
 */
export const AllFields: Story = {
  render: () => (
    <FormWrapper>
      {(form: any) => (
        <div className="space-y-4">
          <EmailField register={form.register} />
          <PasswordField 
            register={form.register} 
            onForgotPassword={() => console.log("Forgot password clicked")}
          />
          <OTPField register={form.register} />
          <FormError error="Please check your input and try again." />
          <FormSuccess message="Form submitted successfully!" />
        </div>
      )}
    </FormWrapper>
  ),
};
