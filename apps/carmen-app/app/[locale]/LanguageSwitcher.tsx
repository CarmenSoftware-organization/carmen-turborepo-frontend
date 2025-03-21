'use client';

import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { locales } from '@/i18n';

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = router.pathname; // pathname ที่ไม่รวม locale
    const currentLocale = useLocale();

    // ฟังก์ชันสำหรับเปลี่ยนภาษาโดยใช้การ reload หน้า
    const handleLocaleChange = (newLocale: string) => {
        if (currentLocale === newLocale) return;

        console.log('Changing locale from', currentLocale, 'to', newLocale);
        console.log('Current pathname (without locale):', pathname);

        // คำนวณ URL ใหม่อย่างระมัดระวัง
        const baseUrl = window.location.origin;
        let newPath = `/${newLocale}`;

        // ถ้า pathname ไม่ใช่หน้าหลัก (/) ให้เพิ่มเข้าไป
        if (pathname !== '/') {
            newPath += pathname;
        }

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