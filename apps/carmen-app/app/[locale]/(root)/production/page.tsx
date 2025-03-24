"use client";
import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { ChefHat, Layers, Trash2, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProductionPage() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('Production.recipeExecution'),
            href: '/production/recipe-execution',
            icon: ChefHat
        },
        {
            name: t('Production.batchProduction'),
            href: '/production/batch-production',
            icon: Layers
        },
        {
            name: t('Production.wastageTracking'),
            href: '/production/wastage-tracking',
            icon: Trash2
        },
        {
            name: t('Production.qualityControl'),
            href: '/production/quality-control',
            icon: ShieldCheck
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('production')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
