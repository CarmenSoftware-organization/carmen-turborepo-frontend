"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module";
import { Boxes } from "lucide-react";
import { useTranslations } from "next-intl";

export default function InventoryPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/inventory-management",
        t,
        Boxes
    );

    const title = t("inventoryManagement");

    return <GenericMenuPage title={title} subMenu={subMenu} />
}