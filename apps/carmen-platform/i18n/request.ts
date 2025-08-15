import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './routing';

export default getRequestConfig(async ({ locale }) => {
    // รองรับทั้งกรณีที่ locale เป็น string และเป็น Promise<string>
    const resolvedParam = await Promise.resolve(locale as unknown as Promise<string> | string);
    const localeValue = resolvedParam ?? defaultLocale;

    const resolvedLocale = (locales as readonly string[]).includes(localeValue)
        ? (localeValue as (typeof locales)[number])
        : defaultLocale;

    const messages = (await import(`../messages/${resolvedLocale}.json`)).default;

    return {
        locale: resolvedLocale,
        messages
    };
});


