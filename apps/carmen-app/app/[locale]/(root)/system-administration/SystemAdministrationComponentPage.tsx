"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module-utils";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SystemAdministrationComponentPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/system-administration",
        t,
        Users
    );

    const title = t("systemAdministration");
    return <GenericMenuPage title={title} subMenu={subMenu} />
}