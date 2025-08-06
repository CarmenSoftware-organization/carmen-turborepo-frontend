"use client";
import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { useTranslations } from "next-intl";
import { BarChart2, DollarSign, Package, LineChart, PieChart, TrendingUp } from "lucide-react";

export default function ReportingAnalyticPage() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('ReportingAndAnalytics.operationalReports'),
            href: '/reporting-analytic/operational-reports',
            icon: BarChart2
        },
        {
            name: t('ReportingAndAnalytics.financialReports'),
            href: '/reporting-analytic/financial-reports',
            icon: DollarSign
        },
        {
            name: t('ReportingAndAnalytics.inventoryReports'),
            href: '/reporting-analytic/inventory-reports',
            icon: Package
        },
        {
            name: t('ReportingAndAnalytics.vendorPerformance'),
            href: '/reporting-analytic/vendor-performance',
            icon: LineChart
        },
        {
            name: t('ReportingAndAnalytics.costAnalysis'),
            href: '/reporting-analytic/cost-analysis',
            icon: PieChart
        },
        {
            name: t('ReportingAndAnalytics.salesAnalysis'),
            href: '/reporting-analytic/sales-analysis',
            icon: TrendingUp
        }
    ]
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">{t('reportingAndAnalytics')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
