"use client";
import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { Utensils, LayoutGrid, TrendingUp, Boxes } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OperationalPlanningPage() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('OperationalPlanning.RecipesManagement.title'),
            href: '/operational-planning/recipe-management',
            icon: Utensils
        },
        {
            name: t('OperationalPlanning.menuEngineering'),
            href: '/operational-planning/menu-engineering',
            icon: LayoutGrid
        },
        {
            name: t('OperationalPlanning.demandForecasting'),
            href: '/operational-planning/demand-forecasting',
            icon: TrendingUp
        },
        {
            name: t('OperationalPlanning.inventoryPlanning'),
            href: '/operational-planning/inventory-planning',
            icon: Boxes
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('operationalPlanning')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
