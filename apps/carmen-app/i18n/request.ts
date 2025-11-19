import { getRequestConfig } from "next-intl/server";
import { locales, type Locale, defaultLocale } from "@/i18n";

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

  const mainMessages = (await import(`../messages/${validLocale}.json`)).default;
  const legalMessages = (await import(`../messages/legal-${validLocale}.json`)).default;
  const homePageMessages = (await import(`../messages/home-${validLocale}.json`)).default;
  const procurementMessages = (await import(`../messages/procurement-${validLocale}.json`)).default;
  const vendorManagementMessages = (
    await import(`../messages/vendor-management-${validLocale}.json`)
  ).default;

  const configuration = (await import(`../messages/configuration-${validLocale}.json`)).default;
  const productMessage = (await import(`../messages/product-management-${validLocale}.json`))
    .default;

  const moduleMessage = (await import(`../messages/module-${validLocale}.json`)).default;

  try {
    const messages = {
      ...mainMessages,
      Legal: legalMessages,
      HomePage: homePageMessages,
      ...procurementMessages,
      ...vendorManagementMessages,
      ...configuration,
      ...productMessage,
      ...moduleMessage,
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
