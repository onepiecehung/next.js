"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import {
  currentUserAtom,
  accessTokenAtom,
  loginAction,
  fetchMeAction,
} from "@/lib/auth-store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Button, Input, Label } from "@/components/ui";
import { useI18n } from "@/components/providers/i18n-provider";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Internationalized Login Dialog Component
 * Handles user authentication with form validation
 * Uses custom i18n hook for multi-language support
 */
export default function LoginDialog() {
  const { t } = useI18n();
  const [, setUser] = useAtom(currentUserAtom);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      // Attempt to login with provided credentials
      const user = await loginAction(values.email, values.password);

      // Update access token in Jotai state (optional, for UI sync)
      setAccessToken(null); // We keep the actual token in http layer memory

      // Fetch complete user data if not provided by login response
      const completeUser = user ?? (await fetchMeAction());
      setUser(completeUser);

      // Show success message and close dialog
      toast.success(t('toast.login.success', 'toast'));
      setOpen(false);
      reset(); // Clear form
    } catch (error: unknown) {
      // Handle login errors and show appropriate error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "response" in error &&
              typeof error.response === "object" &&
              error.response !== null &&
              "data" in error.response &&
              typeof error.response.data === "object" &&
              error.response.data !== null &&
              "message" in error.response.data &&
              typeof error.response.data.message === "string"
            ? error.response.data.message
            : t('auth.login.error.default', 'auth');
      toast.error(errorMessage);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset(); // Clear form when dialog closes
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">{t('auth.login.button', 'auth')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('auth.login.title', 'auth')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.form.email', 'auth')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.form.emailPlaceholder', 'auth')}
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.form.password', 'auth')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('auth.form.passwordPlaceholder', 'auth')}
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting 
              ? t('auth.login.signingIn', 'auth') 
              : t('auth.login.signIn', 'auth')
            }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
