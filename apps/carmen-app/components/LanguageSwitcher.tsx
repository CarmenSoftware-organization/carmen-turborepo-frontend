"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  dense?: boolean;
}

export default function LanguageSwitcher({ dense = false }: Props = {}) {
  const currentPathname = usePathname();
  const currentLocale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    if (currentLocale === newLocale) return;

    const baseUrl = globalThis.window.location.origin;

    let pathname = currentPathname;
    const localePrefix = `/${currentLocale}`;

    if (pathname.startsWith(localePrefix)) {
      pathname = pathname.substring(localePrefix.length) || "/";
    }

    const newPath = pathname === "/" ? `/${newLocale}` : `/${newLocale}${pathname}`;

    globalThis.window.location.href = baseUrl + newPath;
  };

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger
        className={cn(
          "border border-border text-muted-foreground",
          dense ? "w-10 h-7 px-1 text-[11px]" : "w-[80px] h-7 text-[11px] focus:ring-ring"
        )}
      >
        <SelectValue>
          {dense ? (
            <p>{currentLocale.toUpperCase()}</p>
          ) : (
            <div className="flex items-center gap-1">
              <span>{currentLocale === "en" ? "English" : "ไทย"}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale} className="cursor-pointer text-[11px] py-1">
            <p>{locale.toUpperCase()}</p>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
