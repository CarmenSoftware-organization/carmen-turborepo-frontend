import {
  CURRENCY_SYMBOLS,
  CURRENCY_LOCALES,
  CURRENCY_DECIMAL_PLACES,
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_LOCALE,
  DEFAULT_CURRENCY,
} from "../constants";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const CURRENCIES: Currency[] = [
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
];

export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency] || currency;
};

export const getCurrencyLocale = (currency: string): string => {
  return CURRENCY_LOCALES[currency] || DEFAULT_LOCALE;
};

export const getCurrencyDecimalPlaces = (currency: string): number => {
  return CURRENCY_DECIMAL_PLACES[currency] ?? CURRENCY_DECIMAL_PLACES.default;
};

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

export const formatCurrencyWithSymbol = (value: number, currency: string): string => {
  const formattedNumber = formatNumber(value, DEFAULT_LOCALE, DEFAULT_DECIMAL_PLACES);
  const symbol = getCurrencySymbol(currency);
  return `${formattedNumber} ${symbol}`;
};

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

export const formatThaiCurrency = (value: number): string => {
  return formatCurrencyIntl(value, DEFAULT_CURRENCY);
};

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
