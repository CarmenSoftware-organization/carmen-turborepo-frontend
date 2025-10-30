export const locales = ["en", "th"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function getLocaleFromPathname(pathname: string): Locale | undefined {
  const segments = pathname.split("/");
  const firstSegment = segments[1];
  return locales.includes(firstSegment as Locale) ? (firstSegment as Locale) : undefined;
}
