"use client";

import { ColorDto, colorPalette } from "@/constants/colors";
import { useRef, useState } from "react";
import { ColorSection } from "./ColorSection";
import SidebarColorMenu from "./SidebarColorMenu";


export default function ColorPage() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const baseRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const utilityRef = useRef<HTMLDivElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    Base: baseRef,
    Component: componentRef,
    Brand: brandRef,
    Utility: utilityRef,
    Interface: interfaceRef,
    Chart: chartRef,
    Sidebar: sidebarRef,
  };

  const colorGroups = colorPalette.reduce(
    (groups, color) => {
      if (!groups[color.category]) {
        groups[color.category] = [];
      }
      groups[color.category].push(color);
      return groups;
    },
    {} as Record<string, ColorDto[]>
  );

  const categories = Object.keys(colorGroups);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    const ref = sectionRefs[category];
    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidebarColorMenu
        categories={categories}
        onCategoryClick={handleCategoryClick}
        activeCategory={activeCategory}
      />
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-2">
          <div className="space-y-4">
            {categories.map((category) => (
              <ColorSection
                key={category}
                title={category}
                colors={colorGroups[category]}
                sectionRef={sectionRefs[category]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
