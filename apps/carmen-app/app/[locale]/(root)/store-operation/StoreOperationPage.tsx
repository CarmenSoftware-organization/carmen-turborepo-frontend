"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module-utils";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";

export default function StoreOperationPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/store-operation",
        t,
        Package
    );

    const title = t("storeOperations");

    return <GenericMenuPage title={title} subMenu={subMenu} />
}