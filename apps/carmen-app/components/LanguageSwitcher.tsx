'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n';

export default function LanguageSwitcher() {
    const currentPathname = usePathname();
    const currentLocale = useLocale();

    // ฟังก์ชันสำหรับเปลี่ยนภาษาโดยใช้การ reload หน้า
    const handleLocaleChange = (newLocale: string) => {
        if (currentLocale === newLocale) return;

        console.log('Changing locale from', currentLocale, 'to', newLocale);
        console.log('Current full pathname:', currentPathname);

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

        console.log('New URL will be:', baseUrl + newPath);

        // ใช้การ reload หน้าเพื่อให้แน่ใจว่าทุกอย่างถูกโหลดใหม่
        window.location.href = baseUrl + newPath;
    };

    return (
        <div className="fixed top-4 right-4 flex gap-2">
            {locales.map((locale) => (
                <button
                    key={locale}
                    onClick={() => handleLocaleChange(locale)}
                    className={`px-3 py-1 rounded ${currentLocale === locale
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    aria-label={`Switch to ${locale} language`}
                >
                    {locale.toUpperCase()}
                </button>
            ))}
        </div>
    );
} 