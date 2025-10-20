"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { moduleItems } from "@/constants/modules-list";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "@/lib/navigation";
import { LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  // ตัด locale ออกจาก pathname ถ้ามี
  const pathWithoutLocale = pathname.split("/").slice(2).join("/");

  // หา active module จาก pathname ปัจจุบัน
  const activeModule = moduleItems.find(
    (module) =>
      ("/" + pathWithoutLocale).startsWith(module.href) && module.href !== "/"
  );

  const handleModuleClick = (href: string) => {
    // ปิด popover
    setOpen(false);
    // นำทางไปยังหน้านั้น
    router.push(href);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-8 h-8">
          <LayoutGrid className="h-5 w-5" strokeWidth={0.95} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[360px]">
        <div className="grid grid-cols-3 gap-2">
          {moduleItems.map((module) => {
            const key = module.labelKey.split(".").pop() ?? "";
            const Icon = module.icon;
            const isActive = activeModule?.labelKey === module.labelKey;

            return (
              <button
                key={module.labelKey}
                className={`w-full text-left cursor-pointer rounded-md p-3 ${isActive
                  ? "bg-accent border-primary"
                  : "hover:bg-accent/50 border-gray-200"
                  }`}
                onClick={() => handleModuleClick(module.href)}
                aria-label={t(key)}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  {Icon && <Icon className="h-8 w-8" />}
                  <span className="text-xs text-center">{t(key)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
