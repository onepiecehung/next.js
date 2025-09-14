"use client";

import React, { useState } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input, Label } from "@/components/ui";
import { User, Lock } from "lucide-react";
import { LoginFormData } from "@/lib/validators/auth";

interface FormFieldProps {
  error?: FieldError;
  disabled?: boolean;
}

interface EmailFieldProps extends FormFieldProps {
  register: UseFormRegister<LoginFormData>;
}

interface PasswordFieldProps extends FormFieldProps {
  register: UseFormRegister<LoginFormData>;
  onForgotPassword?: () => void;
}

/**
 * Email input field component
 * Reusable email input with validation and accessibility
 */
export const EmailField: React.FC<EmailFieldProps> = ({
  register,
  error,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor="email" 
        className="text-sm font-medium text-foreground"
      >
        Email address
      </Label>
      <div className="relative">
        <User 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" 
          size={16}
        />
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="pl-10 h-11 text-base"
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? "email-error" : undefined}
          {...register("email")}
        />
      </div>
      {error && (
        <p 
          id="email-error" 
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </p>
      )}
    </div>
  );
};

/**
 * Password input field component
 * Reusable password input with show/hide toggle and forgot password link
 */
export const PasswordField: React.FC<PasswordFieldProps> = ({
  register,
  error,
  disabled = false,
  onForgotPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label 
          htmlFor="password" 
          className="text-sm font-medium text-foreground"
        >
          Password
        </Label>
        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            disabled={disabled}
          >
            Forgot password?
          </button>
        )}
      </div>
      <div className="relative">
        <Lock 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" 
          size={16}
        />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="pl-10 pr-10 h-11 text-base"
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? "password-error" : undefined}
          autoComplete="current-password"
          {...register("password")}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm p-1"
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && (
        <p 
          id="password-error" 
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </p>
      )}
    </div>
  );
};

/**
 * OTP input field component
 * Specialized input for OTP codes with number-only validation
 */
interface OTPFieldProps extends FormFieldProps {
  register: UseFormRegister<{ code: string }>;
  value?: string;
  onChange?: (value: string) => void;
}

export const OTPField: React.FC<OTPFieldProps> = ({
  register,
  error,
  disabled = false,
  value,
  onChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "").slice(0, 6);
    e.target.value = inputValue;
    onChange?.(inputValue);
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor="otp-code" 
        className="text-sm font-medium text-foreground"
      >
        Verification code
      </Label>
      <Input
        id="otp-code"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="123456"
        className="text-center text-lg tracking-widest h-11"
        maxLength={6}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? "otp-error" : undefined}
        onChange={handleInputChange}
        {...register("code")}
      />
      {error && (
        <p 
          id="otp-error" 
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </p>
      )}
    </div>
  );
};

/**
 * Form error display component
 * Displays server errors and general form errors
 */
interface FormErrorProps {
  error?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ 
  error, 
  className = "" 
}) => {
  if (!error) return null;

  return (
    <div 
      className={`p-3 rounded-md bg-destructive/10 border border-destructive/20 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <p className="text-sm text-destructive font-medium">
        {error}
      </p>
    </div>
  );
};

/**
 * Form success message component
 * Displays success messages
 */
interface FormSuccessProps {
  message?: string;
  className?: string;
}

export const FormSuccess: React.FC<FormSuccessProps> = ({ 
  message, 
  className = "" 
}) => {
  if (!message) return null;

  return (
    <div 
      className={`p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 ${className}`}
    >
      <output className="text-sm text-green-700 dark:text-green-400 font-medium">
        {message}
      </output>
    </div>
  );
};
