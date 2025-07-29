import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrencyWithSymbol = (value: number, currency: string) => {
  const formattedNumber = Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  const currencySymbol = getCurrencySymbol(currency);
  return `${formattedNumber} ${currencySymbol}`;
};

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    THB: "฿",
    USD: "$",
    EUR: "€",
    JPY: "¥",
    GBP: "£",
    // Add more as needed
  };
  return symbols[currency] || currency;
};


export const formatCurrency = (value: number, currency: string) => {
  const formatted = Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(value);

  const parts = formatted.match(/([^0-9.,]+)?\s?([\d,\.]+)/);

  if (!parts) return formatted;

  const [, symbol = "", number] = parts;

  return `${number} ${symbol}`.trim();
};

export const currencyFormat = (value: number, locale: string = "en-US") => {
  return Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

