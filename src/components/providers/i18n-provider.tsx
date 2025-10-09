"use client";

import { defaultLocale, locales, type Locale } from "@/i18n/config";
import React, { createContext, useContext, useEffect, useState } from "react";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: string) => void;
  t: (key: string, namespace?: string, variables?: Record<string, unknown>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<
    string,
    Record<string, string>
  > | null>(null);

  useEffect(() => {
    // Load messages for current locale
    const loadMessages = async () => {
      try {
        const localeMessages = await import(`@/i18n/locales/${locale}.ts`);
        setMessages(localeMessages.default);
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        // Fallback to default locale
        const fallbackMessages = await import(
          `@/i18n/locales/${defaultLocale}.ts`
        );
        setMessages(fallbackMessages.default);
        setLocaleState(defaultLocale);
      }
    };

    loadMessages();
  }, [locale]);

  const setLocale = (newLocale: string) => {
    if (locales.includes(newLocale as Locale)) {
      setLocaleState(newLocale as Locale);
      // Store in localStorage
      localStorage.setItem("app-locale", newLocale);
    }
  };

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("app-locale");
    if (savedLocale && locales.includes(savedLocale as Locale)) {
      setLocaleState(savedLocale as Locale);
    }
  }, []);

  const t = (
    key: string,
    namespace: string = "common",
    variables?: Record<string, unknown>
  ) => {
    if (!messages) return key;

    const keys = key.split(".");
    let value: string | Record<string, string> | undefined =
      messages[namespace];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    // If value is not a string, return the key as fallback
    if (typeof value !== "string") return key;

    // Replace placeholders with actual values
    // Supports both {variable} and {{variable}} syntax
    if (variables) {
      return value.replace(/\{\{?(\w+)\}?\}/g, (match, varName) => {
        return variables[varName] !== undefined
          ? String(variables[varName])
          : match;
      });
    }

    return value;
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
