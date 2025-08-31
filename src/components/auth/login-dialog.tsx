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

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginDialog() {
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
      toast.success("Successfully logged in!");
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
            : "Login failed. Please check your credentials.";
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
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to your account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
