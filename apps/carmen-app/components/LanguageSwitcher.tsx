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


export default function LanguageSwitcher() {
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
            <SelectTrigger className="border-none focus:ring-ring w-14 h-8 px-1.5">
                <SelectValue>
                    <p>{currentLocale.toUpperCase()}</p>
                </SelectValue>
            </SelectTrigger>
            <SelectContent className='w-16'>
                {locales.map((locale) => (
                    <SelectItem
                        key={locale}
                        value={locale}
                        className="cursor-pointer"
                    >
                        <p>{locale.toUpperCase()}</p>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
} 