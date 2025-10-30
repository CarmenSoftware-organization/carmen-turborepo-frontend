import { format } from "date-fns";

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

export const formatDateThai = (date: string | Date | null | undefined): string => {
  return formatDate(date, "dd/MM/yyyy");
};

export const formatDateISO = (date: string | Date | null | undefined): string => {
  return formatDate(date, "yyyy-MM-dd");
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, "dd/MM/yyyy HH:mm");
};

export const formatDateLong = (date: string | Date | null | undefined): string => {
  return formatDate(date, "MMMM dd, yyyy");
};
