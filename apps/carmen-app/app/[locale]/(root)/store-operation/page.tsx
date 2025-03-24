"use client";
import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { ClipboardList, PackagePlus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function StoreOperation() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('StoreOperations.storeRequisitions'),
            href: '/store-operation/store-requisition',
            icon: ClipboardList
        },
        {
            name: t('StoreOperations.stockReplenishment'),
            href: '/store-operation/stock-replenishment',
            icon: PackagePlus
        },
        {
            name: t('StoreOperations.wastageReporting'),
            href: '/store-operation/wastage-reporting',
            icon: Trash2
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('storeOperations')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
