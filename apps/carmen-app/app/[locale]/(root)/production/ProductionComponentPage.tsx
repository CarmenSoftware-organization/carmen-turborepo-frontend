"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module-utils";
import { Factory } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProductionComponentPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/production",
        t,
        Factory
    );

    const title = t("production");
    return <GenericMenuPage title={title} subMenu={subMenu} />
}