"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: string) => void;
  t: (key: string, namespace?: string) => string;
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
  const [messages, setMessages] = useState<Record<string, Record<string, string>> | null>(null);

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

  const t = (key: string, namespace: string = "common") => {
    if (!messages) return key;

    const keys = key.split(".");
    let value: string | Record<string, string> | undefined = messages[namespace];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
