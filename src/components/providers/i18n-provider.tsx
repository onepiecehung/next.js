"use client";

import { defaultLocale, locales, type Locale } from "@/i18n/config";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: string) => void;
  isLoading: boolean;
  isReady: boolean; // True when messages are loaded and ready
  t: (
    key: string,
    namespace?: string,
    variables?: Record<string, unknown>,
    fallback?: string,
  ) => string;
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

// Cache for fallback messages to avoid re-importing
let fallbackMessagesCache: Record<string, Record<string, string>> | null = null;

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<
    string,
    Record<string, string>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Preload default locale messages immediately (synchronous if possible)
  useEffect(() => {
    // Load default locale messages first as fallback
    const loadFallbackMessages = async () => {
      if (!fallbackMessagesCache) {
        try {
          const fallbackMessages = await import(
            `@/i18n/locales/${defaultLocale}.ts`
          );
          fallbackMessagesCache = fallbackMessages.default;
        } catch (error) {
          console.error(
            `Failed to load fallback messages for locale: ${defaultLocale}`,
            error,
          );
        }
      }
    };

    loadFallbackMessages();
  }, []);

  // Load messages for current locale
  useEffect(() => {
    setIsLoading(true);
    const loadMessages = async () => {
      try {
        const localeMessages = await import(`@/i18n/locales/${locale}.ts`);
        setMessages(localeMessages.default);
        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        // Fallback to cached default locale messages
        if (fallbackMessagesCache) {
          setMessages(fallbackMessagesCache);
          setLocaleState(defaultLocale);
        } else {
          // If fallback cache is not ready, try to load it
          try {
            const fallbackMessages = await import(
              `@/i18n/locales/${defaultLocale}.ts`
            );
            fallbackMessagesCache = fallbackMessages.default;
            setMessages(fallbackMessages.default);
            setLocaleState(defaultLocale);
          } catch (fallbackError) {
            console.error(
              `Failed to load fallback messages: ${fallbackError}`,
            );
            // Last resort: set empty messages to prevent crashes
            setMessages({});
          }
        }
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [locale]);

  const setLocale = (newLocale: string) => {
    if (locales.includes(newLocale as Locale)) {
      setLocaleState(newLocale as Locale);
      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("app-locale", newLocale);
      }
    }
  };

  useEffect(() => {
    // Load saved locale from localStorage
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("app-locale");
      if (savedLocale && locales.includes(savedLocale as Locale)) {
        setLocaleState(savedLocale as Locale);
      }
    }
  }, []);

  const t = (
    key: string,
    namespace: string = "common",
    variables?: Record<string, unknown>,
    fallback?: string,
  ) => {
    // If messages are not loaded yet, use fallback text or key
    if (!messages || Object.keys(messages).length === 0) {
      // Try to use cached fallback messages
      if (fallbackMessagesCache) {
        const keys = key.split(".");
        let value: string | Record<string, string> | undefined =
          fallbackMessagesCache[namespace];

        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            return fallback || key;
          }
        }

        if (typeof value === "string") {
          return value;
        }
      }
      // Return fallback text if provided, otherwise return key
      return fallback || key;
    }

    const keys = key.split(".");
    let value: string | Record<string, string> | undefined =
      messages[namespace];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // If translation not found, try fallback messages
        if (fallbackMessagesCache && fallbackMessagesCache[namespace]) {
          let fallbackValue: string | Record<string, string> | undefined =
            fallbackMessagesCache[namespace];
          for (const fk of keys) {
            if (
              fallbackValue &&
              typeof fallbackValue === "object" &&
              fk in fallbackValue
            ) {
              fallbackValue = fallbackValue[fk];
            } else {
              return fallback || key;
            }
          }
          if (typeof fallbackValue === "string") {
            value = fallbackValue;
            break;
          }
        }
        return fallback || key;
      }
    }

    // If value is not a string, return fallback or key
    if (typeof value !== "string") return fallback || key;

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

  const isReady = messages !== null && Object.keys(messages).length > 0;

  const value: I18nContextType = useMemo(
    () => ({
      locale,
      setLocale,
      isLoading,
      isReady,
      t,
    }),
    [locale, isLoading, isReady],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
