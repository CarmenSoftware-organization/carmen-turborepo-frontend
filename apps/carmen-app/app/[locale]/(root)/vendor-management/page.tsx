"use client";

import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { Building2, CircleDollarSign, LineChart } from "lucide-react";
import { useTranslations } from "next-intl";

export default function VendorManagement() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('VendorManagement.manageVendors'),
            href: '/vendor-management/vendor',
            icon: Building2
        },
        {
            name: t('VendorManagement.priceLists'),
            href: '/vendor-management/price-list',
            icon: CircleDollarSign
        },
        {
            name: t('VendorManagement.priceComparisons'),
            href: '/vendor-management/price-comparison',
            icon: LineChart
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('vendorManagement')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
