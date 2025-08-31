import { notFound } from "next/navigation";
import { getRequestConfig, type RequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = ["en", "vi"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }): Promise<RequestConfig> => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./locales/${locale}.ts`)).default,
    locale: locale as Locale,
  };
});
