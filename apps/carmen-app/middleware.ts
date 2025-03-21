import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n";

export default createMiddleware({
    // List of all locales that are supported
    locales,
    // Used when no locale matches
    defaultLocale,
    // This is the strategy to determine which locale to use
    localePrefix: "always", // "always" | "as-needed" | "never" 
    // This will enable automatic locale detection
    localeDetection: true,
});

export const config = {
    // ตรวจสอบทุกเส้นทางยกเว้นไฟล์ static และ api
    matcher: ["/((?!api|_next|.*\\..*).*)"]
};