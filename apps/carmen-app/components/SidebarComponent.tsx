'use client';

import { moduleItems } from "@/constants/modules-list";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { usePathname } from "next/navigation";

export default function SidebarComponent() {
    const t = useTranslations('Modules');
    const pathname = usePathname();

    // ตัด locale ออกจาก pathname ถ้ามี
    const pathWithoutLocale = pathname.split('/').slice(2).join('/');

    // หา module ที่ตรงกับ pathname ปัจจุบัน
    const activeModuleData = moduleItems.find(module =>
        ('/' + pathWithoutLocale).startsWith(module.href) && module.href !== "/"
    );

    // ถ้าไม่มี module ที่ตรงกับ pathname ไม่แสดงอะไร
    if (!activeModuleData) {
        return null;
    }

    // แยก key สำหรับการแปลภาษา
    const moduleKey = activeModuleData.labelKey.split('.').pop() ?? '';
    const Icon = activeModuleData.icon;

    return (
        <nav className="p-2 space-y-1">
            <div className="p-4 border-b flex items-center gap-2">
                {Icon && <Icon className="h-5 w-5" />}
                <h2 className="text-lg font-semibold">{t(moduleKey)}</h2>
            </div>

            {/* แสดง submenu เฉพาะเมื่อมี children */}
            {activeModuleData.children?.map((item) => {
                // แยก key สำหรับ submenu
                const segments = item.labelKey.split('.');

                if (segments.length >= 3) {
                    const section = segments[1];
                    const subItem = segments[2];

                    // เช็คว่า path ปัจจุบันตรงกับ submenu นี้หรือไม่
                    const fullItemPath = '/' + pathWithoutLocale;
                    const isActive = fullItemPath === item.href;

                    return (
                        <Link
                            key={item.labelKey}
                            href={item.href}
                            className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-accent hover:text-accent-foreground'
                                }`}
                        >
                            <span>{t(`${section}.${subItem}`)}</span>
                        </Link>
                    );
                }

                return null;
            })}
        </nav>
    );
} 