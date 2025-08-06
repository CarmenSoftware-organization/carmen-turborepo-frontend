'use client';

import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { useTranslations } from "next-intl";
import { FileCode, DollarSign, Calculator } from "lucide-react";

export default function FinancePage() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('Finance.accountCodeMapping'),
            href: '/finance/account-code-mapping',
            icon: FileCode
        },
        {
            name: t('Finance.exchangeRates'),
            href: '/finance/exchange-rates',
            icon: DollarSign
        },
        {
            name: t('Finance.budgetPlanningAndControl'),
            href: '/finance/budget-planning-and-control',
            icon: Calculator
        }
    ]
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">{t('finance')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
