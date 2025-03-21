import { getRequestConfig } from "next-intl/server";
import { locales } from "../src/config";
import { notFound } from "next/navigation";

type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
    // Validate that the locale is supported
    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    // Type assertion since we've checked the locale is valid
    const typedLocale = locale as Locale;

    return {
        locale: typedLocale,
        messages: (await import(`../src/messages/${typedLocale}.json`)).default
    };
}); 