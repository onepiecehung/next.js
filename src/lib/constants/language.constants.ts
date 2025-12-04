/**
 * Language Constants
 * Defines supported languages for the application
 * Used in language selectors, filters, and segment uploads
 */

export interface Language {
  code: string;
  name: string;
  native: string;
}

/**
 * Supported languages list
 * Ordered by popularity/common usage
 */
export const LANGUAGES: readonly Language[] = [
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { code: "en", name: "English", native: "English" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "th", name: "Thai", native: "ไทย" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "nl", name: "Dutch", native: "Nederlands" },
  { code: "sv", name: "Swedish", native: "Svenska" },
] as const;

/**
 * Language codes array for easy lookup
 */
export const LANGUAGE_CODES = LANGUAGES.map(
  (lang) => lang.code,
) as readonly string[];

/**
 * Default language code
 */
export const DEFAULT_LANGUAGE_CODE = "vi" as const;

/**
 * Get language by code
 */
export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Get language native name by code
 */
export function getLanguageNativeName(code: string): string {
  return getLanguageByCode(code)?.native || code.toUpperCase();
}

/**
 * Language constants object
 */
export const LANGUAGE_CONSTANTS = {
  LANGUAGES,
  LANGUAGE_CODES,
  DEFAULT_LANGUAGE_CODE,
  getLanguageByCode,
  getLanguageNativeName,
} as const;
