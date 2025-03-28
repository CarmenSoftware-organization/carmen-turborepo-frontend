'use client';

import { useState, KeyboardEvent } from 'react';
import { moduleItems } from "@/constants/modules-list";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";

// Type definitions
type MenuIcon = React.ComponentType<{ className?: string }>;

interface MenuItem {
    labelKey: string;
    href: string;
    children?: MenuItem[];
    icon?: MenuIcon;
}

export default function SidebarComponent() {
    const t = useTranslations('Modules');
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

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

    // ฟังก์ชันสำหรับสลับการแสดงผลเมนูย่อย
    const toggleMenu = (key: string) => {
        setOpenMenus(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // ฟังก์ชันจัดการ Keyboard Event
    const handleKeyDown = (
        event: KeyboardEvent<HTMLDivElement>,
        key: string,
        hasChildren: boolean
    ) => {
        // ถ้ากด Enter หรือ Space
        if (hasChildren && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            toggleMenu(key);
        }
    };

    // ฟังก์ชันตรวจสอบเส้นทางที่เลือก
    const isPathActive = (href: string) => {
        const fullItemPath = '/' + pathWithoutLocale;
        return fullItemPath === href || fullItemPath.startsWith(href + '/');
    };

    // ฟังก์ชันแสดงเมนูย่อย (Recursive)
    const renderSubMenu = (items: MenuItem[], level = 0) => {
        return items.map((item) => {
            const segments = item.labelKey.split('.');
            const section = segments[1];
            const subItem = segments.slice(2).join('.');

            const isActive = isPathActive(item.href);
            const hasChildren = item.children && item.children.length > 0;

            return (
                <div key={item.labelKey} className="relative">
                    {hasChildren ? (
                        <div
                            role="button"
                            tabIndex={0}
                            aria-expanded={openMenus[item.href] || false}
                            aria-haspopup={hasChildren}
                            className={`
                                flex items-center justify-between p-2 rounded-md text-sm 
                                transition-all duration-300 ease-in-out
                                ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
                                cursor-pointer
                                ${level > 0 ? `pl-${4 * (level + 1)}` : ''}
                                ${openMenus[item.href] ? 'bg-accent/50' : ''}
                            `}
                            onClick={() => toggleMenu(item.href)}
                            onKeyDown={(e) => handleKeyDown(e, item.href, hasChildren)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">
                                    {t(`${section}.${subItem}`)}
                                </span>
                            </div>
                            {level === 0 && (
                                openMenus[item.href]
                                    ? <ChevronDown
                                        size={16}
                                        aria-hidden="true"
                                        className="transition-transform duration-300 rotate-180"
                                    />
                                    : <ChevronRight
                                        size={16}
                                        aria-hidden="true"
                                        className="transition-transform duration-300"
                                    />
                            )}
                        </div>
                    ) : (
                        <Link
                            href={item.href}
                            className={`
                                flex items-center justify-between p-2 rounded-md text-sm 
                                transition-colors duration-300 mt-1
                                ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
                                ${level > 0 ? `pl-${4 * (level + 1)}` : ''}
                            `}
                        >
                            <span className="text-xs font-medium">
                                {t(`${section}.${subItem}`)}
                            </span>
                        </Link>
                    )}

                    {hasChildren && openMenus[item.href] && (
                        <div
                            className={`
                                overflow-hidden
                                transition-all duration-300 ease-in-out
                                ${openMenus[item.href] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                            `}
                        >
                            {renderSubMenu(item.children!, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <nav
            className="p-4 space-y-1 border-r h-screen w-[250px] hidden md:block overflow-y-auto"
            aria-label="Sidebar Navigation"
        >
            <div>
                <span
                    className="text-2xl font-bold block tracking-wide"
                    data-id="sidebar-logo-text"
                >
                    CARMEN
                </span>
                <span
                    className="text-sm block tracking-wide"
                    data-id="sidebar-logo-text-sub"
                >
                    Hospitality Supply Chain
                </span>
            </div>
            <div className="p-4 flex items-center gap-2 border-b">
                {Icon && <Icon className="h-5 w-5" />}
                <h2 className="text-sm font-semibold">{t(moduleKey)}</h2>
            </div>

            <div className="mt-4 space-y-2">
                {activeModuleData.children && renderSubMenu(activeModuleData.children)}
            </div>
        </nav>
    );
}