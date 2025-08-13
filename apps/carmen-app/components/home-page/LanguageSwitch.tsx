'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function LanguageSwitch() {
    const currentPathname = usePathname();
    const currentLocale = useLocale();

    // ฟังก์ชันสำหรับเปลี่ยนภาษาโดยใช้การ reload หน้า
    const handleLocaleChange = (newLocale: string) => {
        if (currentLocale === newLocale) return;

        // คำนวณ URL ใหม่อย่างระมัดระวัง
        const baseUrl = window.location.origin;

        // แยก pathname ออกจาก locale
        let pathname = currentPathname;
        const localePrefix = `/${currentLocale}`;

        // ตัด locale ปัจจุบันออก
        if (pathname.startsWith(localePrefix)) {
            pathname = pathname.substring(localePrefix.length) || '/';
        }

        // ถ้าเป็น root path ให้ใช้แค่ locale
        const newPath = pathname === '/' ? `/${newLocale}` : `/${newLocale}${pathname}`;

        // ใช้การ reload หน้าเพื่อให้แน่ใจว่าทุกอย่างถูกโหลดใหม่
        window.location.href = baseUrl + newPath;
    };

    return (
        <Select
            value={currentLocale}
            onValueChange={handleLocaleChange}
        >
            <SelectTrigger className="w-[100px] border-none focus:ring-ring">
                <SelectValue>
                    <div className="flex items-center gap-2">
                        <span>{currentLocale === 'en' ? 'English' : 'ไทย'}</span>
                    </div>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {locales.map((locale) => (
                    <SelectItem
                        key={locale}
                        value={locale}
                        className="cursor-pointer"
                    >
                        <div className="flex items-center">
                            <span>{locale === 'en' ? 'English' : 'ไทย'}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
} 