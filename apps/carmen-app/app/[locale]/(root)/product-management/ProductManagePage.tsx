"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProductManagePage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/product-management",
        t,
        Package
    );

    const title = t("productManagement");

    return <GenericMenuPage title={title} subMenu={subMenu} />
}