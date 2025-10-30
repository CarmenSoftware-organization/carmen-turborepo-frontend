"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module";
import { HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HelpAndSupportPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/help-support",
        t,
        HelpCircle
    );

    const title = t("helpAndSupport");
    return <GenericMenuPage title={title} subMenu={subMenu} />
}