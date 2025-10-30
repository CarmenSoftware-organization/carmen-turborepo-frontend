import { format } from "date-fns";

interface FormatPriceConf {
  locales: string;
  minimumFractionDigits: number;
}

export const formatPriceWithCurrency = (locale: string, currency: string, price: number) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);
};

export const formatPrice = (locale: string, price: number, minimumFractionDigits: number) => {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: minimumFractionDigits,
  }).format(price);
};

export const formatPriceConf = (price: number, config: FormatPriceConf, currency: string) => {
  return new Intl.NumberFormat(config.locales, {
    style: "currency",
    // currencyDisplay: 'symbol',
    // currencySign: 'standard',
    currency: currency,
    minimumFractionDigits: config.minimumFractionDigits ?? 2,
  }).format(price);
};

export const formatDateFns = (date: string | null | undefined, conf: string) => {
  if (!date) return "-";
  try {
    return format(new Date(date), conf);
  } catch (error) {
    console.warn("Invalid date format:", date, error);
    return "-";
  }
};

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
