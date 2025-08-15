import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "th"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";
export const localePrefix = "always" as const; // URLs จะมี prefix เสมอ เช่น /en, /th

// ใช้ navigation แบบ generic เพื่อรองรับทุก path โดยไม่ต้องประกาศทีละเส้นทาง
export const { Link, redirect, usePathname, useRouter, permanentRedirect } =
    createNavigation({ locales, localePrefix });

