import {
  CURRENCY_SYMBOLS,
  CURRENCY_LOCALES,
  CURRENCY_DECIMAL_PLACES,
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_LOCALE,
  DEFAULT_CURRENCY,
} from "../constants";

/**
 * Currency type definition
 */
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

/**
 * Available currencies in the system
 */
export const CURRENCIES: Currency[] = [
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
];

/**
 * Get currency symbol by currency code
 * @param currency - Currency code (e.g., "THB", "USD")
 * @returns Currency symbol or the code itself if not found
 * @example
 * getCurrencySymbol("THB") // "฿"
 * getCurrencySymbol("USD") // "$"
 */
export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency] || currency;
};

/**
 * Get locale string by currency code
 * @param currency - Currency code
 * @returns Locale string for the currency
 * @example
 * getCurrencyLocale("THB") // "th-TH"
 */
export const getCurrencyLocale = (currency: string): string => {
  return CURRENCY_LOCALES[currency] || DEFAULT_LOCALE;
};

/**
 * Get decimal places for a currency
 * @param currency - Currency code
 * @returns Number of decimal places
 */
export const getCurrencyDecimalPlaces = (currency: string): number => {
  return CURRENCY_DECIMAL_PLACES[currency] ?? CURRENCY_DECIMAL_PLACES.default;
};

/**
 * Format number as currency with proper decimal places
 * @param value - Number to format
 * @param locale - Locale for formatting (default: "en-US")
 * @param minimumFractionDigits - Minimum decimal places (default: 2)
 * @returns Formatted number string
 * @example
 * formatNumber(1234.56) // "1,234.56"
 * formatNumber(1234.56, "th-TH") // "1,234.56"
 */
export const formatNumber = (
  value: number,
  locale: string = DEFAULT_LOCALE,
  minimumFractionDigits: number = DEFAULT_DECIMAL_PLACES
): string => {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
};

/**
 * Format currency with symbol at the end
 * @param value - Number to format
 * @param currency - Currency code
 * @returns Formatted string with number and symbol (e.g., "1,234.56 ฿")
 * @example
 * formatCurrencyWithSymbol(1234.56, "THB") // "1,234.56 ฿"
 * formatCurrencyWithSymbol(1234.56, "USD") // "1,234.56 $"
 */
export const formatCurrencyWithSymbol = (value: number, currency: string): string => {
  const formattedNumber = formatNumber(value, DEFAULT_LOCALE, DEFAULT_DECIMAL_PLACES);
  const symbol = getCurrencySymbol(currency);
  return `${formattedNumber} ${symbol}`;
};

/**
 * Format currency with symbol using Intl.NumberFormat
 * Number comes before symbol (e.g., "1,234.56 $")
 * @param value - Number to format
 * @param currency - Currency code
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234.56, "THB") // "1,234.56 ฿"
 * formatCurrency(1234.56, "USD") // "1,234.56 $"
 */
export const formatCurrency = (value: number, currency: string): string => {
  const locale = getCurrencyLocale(currency);
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(value);

  // Extract number and symbol, reformat to have number first
  const parts = formatted.match(/([^0-9.,]+)?\s?([\d,\.]+)/);

  if (!parts) return formatted;

  const [, symbol = "", number] = parts;

  return `${number} ${symbol}`.trim();
};

/**
 * Format currency using full Intl.NumberFormat with all options
 * @param value - Number to format
 * @param currencyCode - Currency code
 * @returns Formatted currency string
 * @example
 * formatCurrencyIntl(1234.56, "THB") // "฿1,234.56" or "1,234.56 ฿" depending on locale
 */
export const formatCurrencyIntl = (value: number, currencyCode: string): string => {
  const currency = CURRENCIES.find((c) => c.code === currencyCode);

  if (!currency) {
    return value.toFixed(DEFAULT_DECIMAL_PLACES);
  }

  const locale = getCurrencyLocale(currencyCode);
  const decimalPlaces = getCurrencyDecimalPlaces(currencyCode);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: decimalPlaces,
  }).format(value);
};

/**
 * Format Thai Baht currency
 * Convenience function for Thai Baht formatting
 * @param value - Amount in THB
 * @returns Formatted Thai Baht string
 * @example
 * formatThaiCurrency(1234.56) // "฿1,234.56"
 */
export const formatThaiCurrency = (value: number): string => {
  return formatCurrencyIntl(value, DEFAULT_CURRENCY);
};

/**
 * Format price with currency and custom configuration
 * @param value - Price to format
 * @param currency - Currency code
 * @param locale - Locale for formatting
 * @param minimumFractionDigits - Minimum decimal places
 * @returns Formatted price string
 * @example
 * formatPrice(1234.56, "THB", "th-TH", 2) // "฿1,234.56"
 */
export const formatPrice = (
  value: number,
  currency: string,
  locale: string = DEFAULT_LOCALE,
  minimumFractionDigits: number = DEFAULT_DECIMAL_PLACES
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
  }).format(value);
};
