import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

/**
 * สร้าง metadata function สำหรับ Next.js page
 * ใช้สำหรับ export ใน page.tsx โดยตรง
 *
 * @example
 * // ใน page.tsx
 * export const generateMetadata = createMetadata("PriceList", "title");
 */
export function createMetadata(namespace: string, translationKey: string) {
  return async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace });

    return {
      title: t(translationKey),
    };
  };
}

/**
 * @deprecated ใช้ createMetadata แทน
 */
export async function generatePageMetadata(
  params: Promise<{ locale: string }>,
  namespace: string,
  translationKey: string
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace });

  return {
    title: t(translationKey),
  };
}
