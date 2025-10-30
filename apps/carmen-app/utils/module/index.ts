import { LucideIcon } from "lucide-react";
import { MenuCardItem } from "@/components/ui/menu-card";
import { moduleItems } from "@/constants/modules-list";

/**
 * แปลง labelKey เป็น key สำหรับการแปลภาษา
 * Convert label key to translation key
 * Removes the "Modules." prefix from label keys
 * @param labelKey - Label key in format "Modules.Section.item"
 * @returns Translation key in format "Section.item"
 * @example
 * getTranslationKey("Modules.Configuration.currency") // "Configuration.currency"
 * getTranslationKey("Modules.Procurement.purchaseOrder") // "Procurement.purchaseOrder"
 */
export const getTranslationKey = (labelKey: string): string => {
  const segments = labelKey.split(".");
  const section = segments[1];
  const subItem = segments.slice(2).join(".");
  return `${section}.${subItem}`;
};

/**
 * แปลง module children เป็น MenuCardItem[]
 * Convert module children to MenuCardItem array
 * Transforms module configuration into menu card items with translations
 * @param moduleHref - Module href to find in module items
 * @param translateFunction - Translation function from next-intl
 * @param fallbackIcon - Optional fallback icon if item doesn't have one
 * @returns Array of MenuCardItem for rendering
 * @example
 * const items = convertModuleChildrenToMenuItems(
 *   "/configuration",
 *   t,
 *   SettingsIcon
 * );
 */
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
