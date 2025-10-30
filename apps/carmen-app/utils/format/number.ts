import { MILLION, THOUSAND } from "../constants";

export const formatLargeNumber = (value: number): string => {
  if (value >= MILLION) {
    return `${(value / MILLION).toFixed(1)}M`;
  }
  if (value >= THOUSAND) {
    return `${(value / THOUSAND).toFixed(1)}K`;
  }
  return value.toString();
};

export const calculateProgress = (checked: number, total: number): number => {
  return total > 0 ? Math.round((checked / total) * 100) : 0;
};

export const formatNumberWithLocale = (
  value: number,
  locale: string = "en-US",
  decimals: number = 2
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const roundToDecimals = (value: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};
