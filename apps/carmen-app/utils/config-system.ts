export const formatPriceWithCurrency = (locale: string, currency: string, price: number) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(price);
}

export const formatPrice = (locale: string, price: number) => {
    return new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
}
