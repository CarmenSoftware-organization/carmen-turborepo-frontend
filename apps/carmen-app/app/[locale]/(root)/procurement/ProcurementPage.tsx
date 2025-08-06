"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module-utils";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProcurementPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/procurement",
        t,
        ShoppingCart
    );

    const title = t("procurement");

    return <GenericMenuPage title={title} subMenu={subMenu} />
}