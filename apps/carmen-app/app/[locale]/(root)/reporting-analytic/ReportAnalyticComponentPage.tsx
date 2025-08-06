"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module-utils";
import { BarChart } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ReportAnalyticComponentPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/reporting-analytic",
        t,
        BarChart
    );

    const title = t("reportingAndAnalytics");
    return <GenericMenuPage title={title} subMenu={subMenu} />
}