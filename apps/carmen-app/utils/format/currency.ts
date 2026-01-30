import {
  CURRENCY_SYMBOLS,
  CURRENCY_LOCALES,
  CURRENCY_DECIMAL_PLACES,
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_LOCALE,
} from "../constants";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

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

const PRICE_REGEX = /([^0-9.,]+)?\s?([\d,.]+)/;
export const formatCurrency = (value: number, currency: string): string => {
  const locale = getCurrencyLocale(currency);
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(value);

  const parts = PRICE_REGEX.exec(formatted);

  if (!parts) return formatted;

  const [, symbol = "", number] = parts;

  return `${number} ${symbol}`.trim();
};

export const formatPrice = (
  value: number,
  currency: string,
  locale: string = DEFAULT_LOCALE,
  minimumFractionDigits: number = DEFAULT_DECIMAL_PLACES
): string => {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
  }).format(safeValue);
};
