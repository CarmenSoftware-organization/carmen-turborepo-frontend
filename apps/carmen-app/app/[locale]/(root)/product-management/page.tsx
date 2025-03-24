'use client';

import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { Package, FolderTree, Scale, BarChart } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProductManagement() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('ProductManagement.product'),
            href: '/product-management/product',
            icon: Package
        },
        {
            name: t('ProductManagement.category'),
            href: '/product-management/category',
            icon: FolderTree
        },
        {
            name: t('ProductManagement.unit'),
            href: '/product-management/unit',
            icon: Scale
        },
        {
            name: t('ProductManagement.report'),
            href: '/product-management/report',
            icon: BarChart
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('productManagement')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
