import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale, defaultLocale } from '@/i18n';

export default getRequestConfig(async ({ locale }) => {
    // Ensure locale is a valid string from our locales, or fall back to defaultLocale
    const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

    console.log('Loading messages for locale:', validLocale);

    try {
        // ใช้ import แบบ dynamic แทน
        const messages = (await import(`@/messages/${validLocale}.json`)).default;
        console.log('Messages loaded successfully for', validLocale);

        return {
            locale: validLocale as string,
            messages
        };
    } catch (error) {
        console.error('Error loading messages for', validLocale, error);

        // พยายามโหลดไฟล์โดยใช้ path อื่น
        try {
            const messages = (await import(`../../messages/${validLocale}.json`)).default;
            console.log('Messages loaded successfully using alternative path for', validLocale);

            return {
                locale: validLocale as string,
                messages
            };
        } catch (altError) {
            console.error('Error loading messages using alternative path:', altError);

            // หากเกิดปัญหาในการโหลด messages ให้ใช้ค่าว่าง
            return {
                locale: validLocale as string,
                messages: {}
            };
        }
    }
}); 