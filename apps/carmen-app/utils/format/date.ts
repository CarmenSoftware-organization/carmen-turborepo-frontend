import { format } from "date-fns";

/**
 * Format date using date-fns with error handling
 * @param date - Date string, Date object, or null/undefined
 * @param formatString - Format pattern for date-fns (e.g., "dd/MM/yyyy", "yyyy-MM-dd")
 * @returns Formatted date string or "-" if date is invalid
 * @example
 * formatDate("2024-01-15", "dd/MM/yyyy") // "15/01/2024"
 * formatDate("2024-01-15", "MMM dd, yyyy") // "Jan 15, 2024"
 * formatDate(null, "dd/MM/yyyy") // "-"
 * formatDate("invalid", "dd/MM/yyyy") // "-"
 */
export const formatDate = (
  date: string | Date | null | undefined,
  formatString: string
): string => {
  if (!date) return "-";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.warn("Invalid date format:", date, error);
    return "-";
  }
};

/**
 * Format date to Thai format (DD/MM/YYYY)
 * @param date - Date to format
 * @returns Date in DD/MM/YYYY format
 * @example
 * formatDateThai("2024-01-15") // "15/01/2024"
 */
export const formatDateThai = (date: string | Date | null | undefined): string => {
  return formatDate(date, "dd/MM/yyyy");
};

/**
 * Format date to ISO format (YYYY-MM-DD)
 * @param date - Date to format
 * @returns Date in YYYY-MM-DD format
 * @example
 * formatDateISO(new Date("2024-01-15")) // "2024-01-15"
 */
export const formatDateISO = (date: string | Date | null | undefined): string => {
  return formatDate(date, "yyyy-MM-dd");
};

/**
 * Format date with time (DD/MM/YYYY HH:mm)
 * @param date - Date to format
 * @returns Date with time string
 * @example
 * formatDateTime("2024-01-15T14:30:00") // "15/01/2024 14:30"
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, "dd/MM/yyyy HH:mm");
};

/**
 * Format date to long format (e.g., "January 15, 2024")
 * @param date - Date to format
 * @returns Long format date string
 * @example
 * formatDateLong("2024-01-15") // "January 15, 2024"
 */
export const formatDateLong = (date: string | Date | null | undefined): string => {
  return formatDate(date, "MMMM dd, yyyy");
};
