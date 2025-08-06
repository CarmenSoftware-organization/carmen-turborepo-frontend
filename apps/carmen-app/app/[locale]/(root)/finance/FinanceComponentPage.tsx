"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module-utils";
import { FileCode } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FinanceComponentPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/finance",
        t,
        FileCode
    );

    const title = t("finance");
    return <GenericMenuPage title={title} subMenu={subMenu} />
}