"use client";

import { GenericMenuPage, MenuCardItem } from "@/components/ui/menu-card";
import { convertModuleChildrenToMenuItems } from "@/utils/module";
import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ConfPage() {
  const t = useTranslations("Modules");

  const subMenu: MenuCardItem[] = convertModuleChildrenToMenuItems("/configuration", t, CreditCard);

  const title = t("configurationTitle");

  return <GenericMenuPage title={title} subMenu={subMenu} />;
}
