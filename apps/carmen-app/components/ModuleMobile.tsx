"use client";

import { useRouter } from "@/lib/navigation";
import { usePathname } from "next/dist/client/components/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { moduleItems } from "@/constants/modules-list";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function ModuleMobile() {
  const t = useTranslations("Modules");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  // ตัด locale ออกจาก pathname ถ้ามี
  const pathWithoutLocale = pathname.split("/").slice(2).join("/");

  // หา active module จาก pathname ปัจจุบัน
  const activeModule = moduleItems.find(
    (module) => ("/" + pathWithoutLocale).startsWith(module.href) && module.href !== "/"
  );

  const handleModuleClick = (href: string) => {
    // ปิด popover
    setOpen(false);
    // นำทางไปยังหน้านั้น
    router.push(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-xs px-2 h-8 gap-1">
          {activeModule?.icon && <activeModule.icon className="h-3 w-3" />}
          {activeModule ? t(activeModule.labelKey.split(".").pop() ?? "") : t("dashboard")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-4">
        <SheetHeader>
          <SheetTitle className="text-base">
            {activeModule ? t(activeModule.labelKey.split(".").pop() ?? "") : t("dashboard")}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <div className="grid grid-cols-3 gap-1.5">
            {moduleItems.map((module) => {
              const key = module.labelKey.split(".").pop() ?? "";
              const Icon = module.icon;
              const isActive = activeModule?.labelKey === module.labelKey;
              return (
                <button
                  key={module.labelKey}
                  className={`w-full text-left cursor-pointer rounded-md p-2 ${
                    isActive ? "bg-accent border-primary" : "hover:bg-accent/50 border-gray-200"
                  }`}
                  onClick={() => handleModuleClick(module.href)}
                  aria-label={t(key)}
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    {Icon && <Icon className="h-6 w-6" />}
                    <span className="text-[10px] text-center">{t(key)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
