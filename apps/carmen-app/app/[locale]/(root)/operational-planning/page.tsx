"use client";
import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { Utensils, LayoutGrid, TrendingUp, Boxes, Factory, BookOpen, Tags } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OperationalPlanningPage() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('OperationalPlanning.recipesManagement'),
            href: '/operational-planning/recipes-management',
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
        },
        {
            name: t('OperationalPlanning.productionPlanning'),
            href: '/operational-planning/production-planning',
            icon: Factory
        },
        {
            name: t('OperationalPlanning.recipeManagement'),
            href: '/operational-planning/recipe-management',
            icon: BookOpen
        },
        {
            name: t('OperationalPlanning.recipeCuisineTypes'),
            href: '/operational-planning/recipe-management/cuisine-types',
            icon: Tags
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('operationalPlanning')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
