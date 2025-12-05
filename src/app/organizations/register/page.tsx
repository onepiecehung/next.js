"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Button, Input, Label } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/layout/form";
import { useRequireAuth } from "@/hooks/auth";
import { useCreateOrganization } from "@/hooks/organizations";
import { BreadcrumbNav } from "@/components/features/navigation";
import { useBreadcrumb } from "@/hooks/ui";
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from "@/lib/validators/organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { extractErrorMessage } from "@/lib/utils/error-extractor";

/**
 * Organization Registration Page Component
 * Handles organization creation with form validation and edge cases
 * Uses custom i18n hook for multi-language support
 * Includes proper error handling and loading states
 */
export default function OrganizationRegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, authLoading } = useRequireAuth();
  const createOrganization = useCreateOrganization();
  const breadcrumbItems = useBreadcrumb();

  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      visibility: "public",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSubmit = async (values: CreateOrganizationFormData) => {
    try {
      // Prepare data for API (remove empty strings)
      const data = {
        name: values.name.trim(),
        slug: values.slug?.trim() || undefined,
        description: values.description?.trim() || undefined,
        websiteUrl: values.websiteUrl?.trim() || undefined,
        logoUrl: values.logoUrl?.trim() || undefined,
        logoId: values.logoId?.trim() || undefined,
        visibility: values.visibility || "public",
      };

      // Create organization
      const organization = await createOrganization.mutateAsync(data);

      // Reset form
      reset();

      // Redirect to organization page
      router.push(`/organizations/${organization.id}`);
    } catch (error: unknown) {
      // Error is already handled by the mutation hook
      console.error("Organization creation error:", error);
      const errorMessage = extractErrorMessage(
        error,
        t("organizationCreateError", "organizations") ||
          "Failed to create organization. Please try again.",
      );
    }
  };

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the form if user is not authenticated
  // The useRequireAuth hook will handle the redirect to login page
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-2xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 sm:mb-6">
          <BreadcrumbNav items={breadcrumbItems} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {t("register.cardTitle", "organizations") ||
                t("register.title", "organizations") ||
                "Create Organization"}
            </CardTitle>
            <CardDescription>
              {t("register.cardDescription", "organizations") ||
                "Fill in the information below to create your organization"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 sm:gap-6">
                  {/* Organization Name field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("register.name", "organizations") ||
                            "Organization Name"}
                          <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              t("register.namePlaceholder", "organizations") ||
                              "Enter organization name"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("register.nameRequired", "organizations") ||
                            "Organization name is required"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Slug field */}
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("register.slug", "organizations") || "Slug"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              t("register.slugPlaceholder", "organizations") ||
                              "organization-slug (optional, auto-generated if empty)"
                            }
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("register.slugDescription", "organizations") ||
                            "URL-friendly identifier for your organization"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("register.description", "organizations") ||
                            "Description"}
                          <span className="text-muted-foreground ml-1">
                            {t("register.descriptionOptional", "organizations") ||
                              "(optional)"}
                          </span>
                        </FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={
                              t(
                                "register.descriptionPlaceholder",
                                "organizations",
                              ) || "Tell us about your organization"
                            }
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Website URL field */}
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("register.websiteUrl", "organizations") ||
                            "Website URL"}
                          <span className="text-muted-foreground ml-1">
                            {t("register.websiteUrlOptional", "organizations") ||
                              "(optional)"}
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder={
                              t(
                                "register.websiteUrlPlaceholder",
                                "organizations",
                              ) || "https://example.com"
                            }
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Logo URL field */}
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("register.logoUrl", "organizations") || "Logo URL"}
                          <span className="text-muted-foreground ml-1">
                            {t("register.logoUrlOptional", "organizations") ||
                              "(optional)"}
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder={
                              t("register.logoUrlPlaceholder", "organizations") ||
                              "https://example.com/logo.png"
                            }
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Visibility field */}
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("register.visibility", "organizations") ||
                            "Visibility"}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  t(
                                    "register.visibilityDescription",
                                    "organizations",
                                  ) ||
                                  "Control who can view your organization"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">
                              {t("register.visibilityPublic", "organizations") ||
                                "Public"}
                            </SelectItem>
                            <SelectItem value="private">
                              {t("register.visibilityPrivate", "organizations") ||
                                "Private"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t("register.visibilityDescription", "organizations") ||
                            "Control who can view your organization. Public: Anyone can view and discover your organization. Private: Only members can view your organization."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit buttons */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => router.back()}
                      disabled={isSubmitting || createOrganization.isPending}
                    >
                      {t("register.cancelButton", "organizations") || "Cancel"}
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting || createOrganization.isPending}
                    >
                      {isSubmitting || createOrganization.isPending
                        ? t("register.creating", "organizations") ||
                          "Creating..."
                        : t("register.createButton", "organizations") ||
                          "Create Organization"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

