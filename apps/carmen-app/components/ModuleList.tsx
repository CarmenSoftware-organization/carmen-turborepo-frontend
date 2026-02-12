"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { moduleItems } from "@/constants/modules-list";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "@/lib/navigation";
import { LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ModuleList() {
  const t = useTranslations("Modules");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const pathWithoutLocale = pathname.split("/").slice(2).join("/");

  const activeModule = moduleItems.find(
    (module) => ("/" + pathWithoutLocale).startsWith(module.href) && module.href !== "/"
  );

  const handleModuleClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-7 h-7 hover:bg-muted/80 transition-colors">
          <LayoutGrid className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="end" sideOffset={8}>
        <div className="grid grid-cols-3 gap-2">
          {moduleItems.map((module) => {
            const key = module.labelKey.split(".").pop() ?? "";
            const Icon = module.icon;
            const isActive = activeModule?.labelKey === module.labelKey;

            return (
              <button
                key={module.labelKey}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all duration-200 group aspect-square ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-inner ring-1 ring-primary/20"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground hover:shadow-sm hover:-translate-y-0.5"
                }`}
                onClick={() => handleModuleClick(module.href)}
                aria-label={t(key)}
              >
                {Icon && (
                  <div
                    className={`p-1.5 rounded-lg transition-colors duration-200 ${
                      isActive ? "bg-primary/20" : "bg-muted group-hover:bg-background"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
                    />
                  </div>
                )}
                <span className="text-[10px] font-medium text-center leading-tight line-clamp-2">
                  {t(key)}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
