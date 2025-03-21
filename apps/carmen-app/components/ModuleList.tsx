'use client';

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { moduleItems } from "@/constants/modules-list"
import { useTranslations } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import React from "react"

export default function ModuleList() {
    const t = useTranslations('Modules');
    const router = useRouter();
    const pathname = usePathname();

    // ตัด locale ออกจาก pathname ถ้ามี
    const pathWithoutLocale = pathname.split('/').slice(2).join('/');

    // หา active module จาก pathname ปัจจุบัน
    const activeModule = moduleItems.find(module =>
        ('/' + pathWithoutLocale).startsWith(module.href) && module.href !== "/"
    );

    const handleModuleClick = (href: string) => {
        // นำทางไปยังหน้านั้น
        router.push(href);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    {activeModule?.icon &&
                        React.createElement(activeModule.icon, { className: "h-4 w-4 mr-2" })}
                    {activeModule ? t(activeModule.labelKey.split('.').pop() ?? '') : t('dashboard')}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px]">
                {moduleItems.map((module) => {
                    // จัดการ key ที่มีรูปแบบ "Modules.key"
                    const key = module.labelKey.split('.').pop() ?? '';
                    const Icon = module.icon;

                    // เช็คว่าเป็น active module หรือไม่
                    const isActive = activeModule?.labelKey === module.labelKey;

                    return (
                        <button
                            key={module.labelKey}
                            className={`w-full text-left py-1 cursor-pointer rounded-md ${isActive ? 'bg-accent' : 'hover:bg-accent/50'
                                }`}
                            onClick={() => handleModuleClick(module.href)}
                            aria-label={t(key)}
                        >
                            <div className="px-3 py-1 flex items-center">
                                {Icon && <Icon className="h-4 w-4 mr-2" />}
                                {t(key)}
                            </div>
                        </button>
                    );
                })}
            </PopoverContent>
        </Popover>
    );
}
