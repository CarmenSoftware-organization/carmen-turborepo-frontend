import { MILLION, THOUSAND } from "../constants";

/**
 * Format large numbers to compact notation (K for thousands, M for millions)
 * @param value - Number to format
 * @returns Formatted string with K/M suffix
 * @example
 * formatLargeNumber(1500) // "1.5K"
 * formatLargeNumber(2000000) // "2.0M"
 * formatLargeNumber(500) // "500"
 */
export const formatLargeNumber = (value: number): string => {
  if (value >= MILLION) {
    return `${(value / MILLION).toFixed(1)}M`;
  }
  if (value >= THOUSAND) {
    return `${(value / THOUSAND).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Calculate percentage progress
 * @param checked - Number of checked/completed items
 * @param total - Total number of items
 * @returns Progress percentage (0-100)
 * @example
 * calculateProgress(5, 10) // 50
 * calculateProgress(0, 10) // 0
 * calculateProgress(10, 0) // 0
 */
export const calculateProgress = (checked: number, total: number): number => {
  return total > 0 ? Math.round((checked / total) * 100) : 0;
};

/**
 * Format number with custom locale and decimal places
 * @param value - Number to format
 * @param locale - Locale string (default: "en-US")
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 * @example
 * formatNumberWithLocale(1234.567, "en-US", 2) // "1,234.57"
 * formatNumberWithLocale(1234.567, "th-TH", 2) // "1,234.57"
 */
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

/**
 * Round number to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 * @example
 * roundToDecimals(1.2345, 2) // 1.23
 * roundToDecimals(1.2367, 2) // 1.24
 */
export const roundToDecimals = (value: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};
