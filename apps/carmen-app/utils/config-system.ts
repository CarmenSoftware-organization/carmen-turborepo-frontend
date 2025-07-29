import { format } from "date-fns";

interface FormatPriceConf {
    locales: string;
    minimumIntegerDigits: number;
}

export const formatPriceWithCurrency = (locale: string, currency: string, price: number) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(price);
}

export const formatPrice = (locale: string, price: number, minimumFractionDigits: number) => {
    return new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: minimumFractionDigits,
    }).format(price);
}

export const formatPriceConf = (price: number, config: FormatPriceConf, currency: string) => {
    return new Intl.NumberFormat(config.locales, {
        style: 'currency',
        currency: currency,
        minimumIntegerDigits: config.minimumIntegerDigits,
        maximumFractionDigits: 2
    }).format(price);
}

export const formatDateFns = (date: string, conf: string) => {
    return format(new Date(date), conf);
}
