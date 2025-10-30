"use client";
import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { useTranslations } from "next-intl";
import { Factory, BookOpen, Tags } from "lucide-react";

export default function RecipeManagementPage() {
  const t = useTranslations("Modules");
  const subMenu: MenuCardItem[] = [
    {
      name: t("OperationalPlanning.RecipesManagement.recipe"),
      href: "/operational-planning/recipe-management/recipe",
      icon: Factory,
    },
    {
      name: t("OperationalPlanning.RecipesManagement.category"),
      href: "/operational-planning/recipe-management/category",
      icon: BookOpen,
    },
    {
      name: t("OperationalPlanning.RecipesManagement.cuisineType"),
      href: "/operational-planning/recipe-management/cuisine-type",
      icon: Tags,
    },
  ];

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-8">{t("operationalPlanning")}</h1>
      <MenuCardGrid items={subMenu} />
    </div>
  );
}
