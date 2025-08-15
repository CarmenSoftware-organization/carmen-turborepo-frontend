export const locales = ["en", "th"] as const;
export type AppLocale = typeof locales[number];

export const defaultLocale: AppLocale = "en";
export const localePrefix = "always" as const; // URLs จะมี prefix เสมอ เช่น /en, /th


