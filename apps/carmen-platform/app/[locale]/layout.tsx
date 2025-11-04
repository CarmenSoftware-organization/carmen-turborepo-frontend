import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "@/providers/providers";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Carmen Platform",
  description: "Carmen Platform Description",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) {
    throw new Error("Unknown locale");
  }
  setRequestLocale(locale);
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Bangkok">
          <Providers>{children}</Providers>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
