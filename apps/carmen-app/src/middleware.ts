import createMiddleware from "next-intl/middleware";
import { locales } from "./config";

export default createMiddleware({
    locales,
    defaultLocale: "en",
    localePrefix: "as-needed"
});

// Only need to include the matcher in production
export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
