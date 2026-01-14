import { NextRequest, NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";

const locales = ["en", "th"];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  // Get Accept-Language header
  const acceptLanguage = request.headers.get("Accept-Language") ?? "";
  // Split languages by comma and trim whitespace
  const languages = acceptLanguage.split(",").map((lang) => lang.split(";")[0].trim());

  // Add default language if no Accept-Language header
  if (languages.length === 0) {
    languages.push(defaultLocale);
  }

  // Find best matching locale
  const locale = matchLocale(languages, locales, defaultLocale);
  return locale;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the request is for a locale route
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
    );
  }

  // Skip auth check in proxy since we can't access sessionStorage
  // Auth will be handled by client-side components using AuthContext
  try {
    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy:", error);
    throw error;
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    String.raw`/((?!_next|api|.*\..*).*)`
  ],
};
