"use client";
import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { useTranslations } from "next-intl";
import { ClipboardList, PackagePlus } from "lucide-react";

export default function StoreOperationPage() {
    const t = useTranslations('Modules');

    const subMenu: MenuCardItem[] = [
        {
            name: t('InventoryManagement.storeOperation.storeRequisition'),
            href: '/inventory-management/store-operation/store-requisition',
            icon: ClipboardList
        },
        {
            name: t('InventoryManagement.storeOperation.stockReplenishment'),
            href: '/inventory-management/store-operation/stock-replenishment',
            icon: PackagePlus
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('InventoryManagement.storeOperation.title')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
