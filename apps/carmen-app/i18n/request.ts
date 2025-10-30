import { getRequestConfig } from "next-intl/server";
import { locales, type Locale, defaultLocale } from "@/i18n";

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

  try {
    const mainMessages = (await import(`../messages/${validLocale}.json`)).default;
    const legalMessages = (await import(`../messages/legal-${validLocale}.json`)).default;
    const homePageMessages = (await import(`../messages/home-${validLocale}.json`)).default;
    const messages = {
      ...mainMessages,
      Legal: legalMessages,
      HomePage: homePageMessages,
    };

    return {
      locale: validLocale as string,
      messages,
    };
  } catch (error) {
    console.error("Error loading messages for", validLocale, error);
    try {
      const messages = (await import(`../messages/${validLocale}.json`)).default;
      return {
        locale: validLocale as string,
        messages,
      };
    } catch (fallbackError) {
      console.error("Error loading fallback messages for", validLocale, fallbackError);
      return {
        locale: validLocale as string,
        messages: {},
      };
    }
  }
});
