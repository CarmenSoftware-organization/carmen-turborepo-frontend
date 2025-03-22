import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale, defaultLocale } from '@/i18n';

export default getRequestConfig(async ({ locale }) => {
    const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

    try {
        const messages = (await import(`../messages/${validLocale}.json`)).default;

        return {
            locale: validLocale as string,
            messages
        };
    } catch (error) {
        console.error('Error loading messages for', validLocale, error);
        return {
            locale: validLocale as string,
            messages: {}
        };
    }
}); 