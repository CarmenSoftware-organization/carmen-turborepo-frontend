'use client';

import { ComponentProps } from 'react';
import { useRouter as useNextRouter, usePathname, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import NextLink from 'next/link';
import { locales, type Locale } from '@/i18n';

// ใช้ ComponentProps ของ NextLink และกำหนด href ใหม่
type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
    href: string;
};

// ฟังก์ชันสำหรับการตรวจสอบและสร้างเส้นทางที่มี locale
function createLocalizedPath(path: string, locale: string): string {
    // ถ้า path เป็น URL ภายนอก หรือเริ่มต้นด้วย # หรือ ? ให้คืนค่าเดิม
    if (path.startsWith('http') || path.startsWith('#') || path.startsWith('?')) {
        return path;
    }

    // ตัดแบ่งเส้นทางตาม "/"
    const segments = path.split('/').filter(Boolean);

    // ถ้า path มี locale อยู่แล้ว ให้ตัดออกก่อน
    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
        segments.shift();
    }

    // สร้างเส้นทางใหม่โดยใส่ locale และตามด้วยส่วนที่เหลือ
    return `/${locale}${segments.length ? '/' + segments.join('/') : ''}`;
}

// ฟังก์ชันสำหรับการลบ locale ออกจาก pathname
function removeLocaleFromPathname(pathname: string): string {
    // ตัดแบ่งเส้นทางตาม "/"
    const segments = pathname.split('/').filter(Boolean);

    // ถ้า path มี locale อยู่ ให้ตัดออก
    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
        return '/' + segments.slice(1).join('/');
    }

    // ถ้าไม่มี locale ก็คืนค่าเดิม
    return pathname;
}

export function Link({ href, children, ...props }: LinkProps) {
    const locale = useLocale();
    const localizedHref = createLocalizedPath(href, locale);

    return (
        <NextLink href={localizedHref} {...props}>
            {children}
        </NextLink>
    );
}

export function useRouter() {
    const nextRouter = useNextRouter();
    const fullPathname = usePathname();
    const params = useParams();
    const locale = useLocale();

    // pathname ที่ไม่รวม locale
    const pathname = removeLocaleFromPathname(fullPathname);

    // params ที่ไม่รวม locale
    const paramsWithoutLocale = { ...params };
    if ('locale' in paramsWithoutLocale) {
        delete paramsWithoutLocale.locale;
    }

    return {
        ...nextRouter,
        // เพิ่ม pathname และ params ที่ไม่มี locale
        pathname,
        pathnameWithLocale: fullPathname,
        params: paramsWithoutLocale,
        fullParams: params,
        locale,
        // ฟังก์ชัน push และ replace ยังคงทำงานแบบเดิม (เพิ่ม locale อัตโนมัติ)
        push: (path: string) => {
            const localizedPath = createLocalizedPath(path, locale);
            nextRouter.push(localizedPath);
        },
        replace: (path: string) => {
            const localizedPath = createLocalizedPath(path, locale);
            nextRouter.replace(localizedPath);
        }
    };
} 