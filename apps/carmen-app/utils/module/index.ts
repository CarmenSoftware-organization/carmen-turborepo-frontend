import { LucideIcon } from "lucide-react";
import { MenuCardItem } from "@/components/ui/menu-card";
import { moduleItems } from "@/constants/modules-list";
export const getTranslationKey = (labelKey: string): string => {
  const segments = labelKey.split(".");
  const section = segments[1];
  const subItem = segments.slice(2).join(".");
  return `${section}.${subItem}`;
};

export const convertModuleChildrenToMenuItems = (
  moduleHref: string,
  translateFunction: (key: string) => string,
  fallbackIcon?: LucideIcon
): MenuCardItem[] => {
  const module = moduleItems.find((module) => module.href === moduleHref);

  return (
    module?.children?.map((item) => ({
      name: translateFunction(getTranslationKey(item.labelKey)),
      href: item.href,
      icon: (item.icon as LucideIcon) || fallbackIcon,
    })) || []
  );
};
