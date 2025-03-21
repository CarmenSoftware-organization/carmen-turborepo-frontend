import { getRequestConfig } from "next-intl/server";
import { locales } from "./config";
import { notFound } from "next/navigation";

type Locale = typeof locales[number];

// Type guard function to check if a value is a valid locale
function isValidLocale(locale: string | undefined): locale is Locale {
    return typeof locale === 'string' && locales.includes(locale as Locale);
}

export default getRequestConfig(async ({ locale }) => {
    // Validate the locale
    if (!isValidLocale(locale)) notFound();

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
