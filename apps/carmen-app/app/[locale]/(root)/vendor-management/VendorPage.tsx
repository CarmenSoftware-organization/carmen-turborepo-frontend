"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module";
import { Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function VendorPage() {
    const t = useTranslations("Modules");

    const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems(
        "/vendor-management",
        t,
        Building2
    );

    const title = t("vendorManagement");

    return <GenericMenuPage title={title} subMenu={subMenu} />
}