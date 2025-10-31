import { ReadonlyURLSearchParams } from "next/navigation";
export const returnUrl = (
  targetUrl: string,
  baseUrl: string,
  searchParams: ReadonlyURLSearchParams
): string => {
  const windowParams =
    globalThis.window === undefined ? "" : globalThis.window.location.search.slice(1);
  const currentParams = windowParams || searchParams.toString();

  if (currentParams) {
    const returnUrl = `${baseUrl}?${currentParams}`;
    return `${targetUrl}?returnUrl=${encodeURIComponent(returnUrl)}`;
  }
  return targetUrl;
};
