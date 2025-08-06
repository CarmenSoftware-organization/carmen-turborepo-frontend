"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module-utils";
import { Link } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SystemIntegrationComponentPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/system-integration",
        t,
        Link
    );

    const title = t("systemIntegration");
    return <GenericMenuPage title={title} subMenu={subMenu} />
}