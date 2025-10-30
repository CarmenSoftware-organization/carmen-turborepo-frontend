"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OperationalPlaningPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/operational-planning",
        t,
        Calendar
    );

    const title = t("operationalPlanning");

    return <GenericMenuPage title={title} subMenu={subMenu} />
}