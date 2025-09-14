"use client";

import LoginDialog from "@/components/auth/login-dialog";
import LoginFormShared from "@/components/auth/login-form-shared";

/**
 * Login Components Demo
 * Demonstrates both the login dialog and shared login form
 */
export default function LoginDemo() {
  const handleLoginSuccess = () => {
    console.log("Login successful!");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  const handleOTPLogin = () => {
    console.log("OTP login clicked");
  };

  const handleRegister = () => {
    console.log("Register clicked");
  };

  const handleBack = () => {
    console.log("Back clicked");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Login Components Demo</h1>
          <p className="text-muted-foreground text-lg">
            Demonstrating the refactored login components with shared code
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Dialog Demo */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Login Dialog</h2>
            <p className="text-muted-foreground">
              Click the button to open the login dialog
            </p>
            <LoginDialog />
          </div>

          {/* Shared Login Form Demo */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Shared Login Form</h2>
            <p className="text-muted-foreground">
              The same form used in the dialog, but as a standalone component
            </p>
            <div className="border rounded-lg p-6">
              <LoginFormShared
                onSuccess={handleLoginSuccess}
                onForgotPassword={handleForgotPassword}
                onOTPLogin={handleOTPLogin}
                onRegister={handleRegister}
                onBack={handleBack}
                showBackButton={true}
                title="Welcome back!"
                description="Please login to continue"
              />
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Login Methods Available</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">📧 Email & Password</h4>
              <p>Traditional login with email and password</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🔐 OTP Login</h4>
              <p>Secure one-time password via email</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🌐 Social Login</h4>
              <p>Google, GitHub, and X (Twitter) integration</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Benefits of Refactoring</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🔄 Code Reuse</h4>
              <p>Same login logic and UI used in both dialog and page</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🛠️ Easy Maintenance</h4>
              <p>Update login functionality in one place</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🎨 Consistent UI</h4>
              <p>Identical design and behavior across all login forms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
