import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './routing';

export default getRequestConfig(async ({ locale }) => {
    const localeValue = (await locale) ?? defaultLocale;
    const resolvedLocale = (locales as readonly string[]).includes(localeValue)
        ? (localeValue as (typeof locales)[number])
        : defaultLocale;

    const messages = (await import(`../messages/${resolvedLocale}.json`)).default;

    return {
        locale: resolvedLocale,
        messages
    };
});


