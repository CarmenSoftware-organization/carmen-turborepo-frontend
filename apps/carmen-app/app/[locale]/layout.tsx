import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans_Thai } from "next/font/google";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "@/providers/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carmen",
  description: "Carmen Inventory Description",
  icons: {
    icon: "/fav.ico",
    shortcut: "/fav-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${notoSansThai.variable} h-screen overflow-auto`}>
      <body className="antialiased h-screen overflow-auto">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
