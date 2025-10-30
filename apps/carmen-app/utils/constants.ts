export const MILLION = 1_000_000;
export const THOUSAND = 1_000;

// ID generation constants
export const NANOID_LENGTH = 5;
export const NANOID_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  THB: "฿",
  USD: "$",
  EUR: "€",
  JPY: "¥",
  GBP: "£",
  SGD: "S$",
  MYR: "RM",
} as const;

// Currency locales
export const CURRENCY_LOCALES: Record<string, string> = {
  THB: "th-TH",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  JPY: "ja-JP",
  SGD: "en-SG",
  MYR: "ms-MY",
} as const;

// Default formatting options
export const DEFAULT_DECIMAL_PLACES = 2;
export const DEFAULT_LOCALE = "en-US";
export const DEFAULT_CURRENCY = "THB";

// Decimal places by currency
export const CURRENCY_DECIMAL_PLACES: Record<string, number> = {
  JPY: 0, // Japanese Yen has no decimal places
  default: 2,
} as const;
