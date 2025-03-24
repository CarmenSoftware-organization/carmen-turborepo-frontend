"use client";

import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { Users, FileText, BarChart2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function VendorManagement() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('VendorManagement.manageVendors'),
            href: '/vendor-management/vendor',
            icon: Users
        },
        {
            name: t('VendorManagement.priceLists'),
            href: '/vendor-management/vendor-group',
            icon: FileText
        },
        {
            name: t('VendorManagement.priceComparisons'),
            href: '/vendor-management/vendor-category',
            icon: BarChart2
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('vendorManagement')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
