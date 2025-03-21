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
    const [open, setOpen] = React.useState(false);

    // ตัด locale ออกจาก pathname ถ้ามี
    const pathWithoutLocale = pathname.split('/').slice(2).join('/');

    // หา active module จาก pathname ปัจจุบัน
    const activeModule = moduleItems.find(module =>
        ('/' + pathWithoutLocale).startsWith(module.href) && module.href !== "/"
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
                <Button variant="outline">
                    {activeModule?.icon &&
                        React.createElement(activeModule.icon, { className: "h-4 w-4 mr-2" })}
                    {activeModule ? t(activeModule.labelKey.split('.').pop() ?? '') : t('dashboard')}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px]">
                <div className="grid grid-cols-3 gap-2">
                    {moduleItems.map((module) => {
                        const key = module.labelKey.split('.').pop() ?? '';
                        const Icon = module.icon;
                        const isActive = activeModule?.labelKey === module.labelKey;

                        return (
                            <button
                                key={module.labelKey}
                                className={`w-full text-left cursor-pointer rounded-md border p-3 ${isActive ? 'bg-accent border-primary' : 'hover:bg-accent/50 border-gray-200'
                                    }`}
                                onClick={() => handleModuleClick(module.href)}
                                aria-label={t(key)}
                            >
                                <div className="flex flex-col items-center justify-center gap-2">
                                    {Icon && <Icon className="h-8 w-8" />}
                                    {t(key)}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
