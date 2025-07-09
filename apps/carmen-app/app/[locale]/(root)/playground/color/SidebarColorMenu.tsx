import { MenuIcon } from "lucide-react";
import { useState } from "react";

interface SidebarColorMenuProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
  activeCategory: string;
}

export default function SidebarColorMenu({
  categories,
  onCategoryClick,
  activeCategory,
}: SidebarColorMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground p-2 rounded-md shadow-lg"
      >
        <MenuIcon className="h-4 w-4" />
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-background border-r border-border z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
      >
        <div className="p-3 border-b border-border">
          <h2 className="font-bold text-lg">Color Palette</h2>
        </div>
        <div className="p-3 space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onCategoryClick(category);
                setIsOpen(false);
              }}
              className={`w-full text-left p-2 rounded-md transition-colors text-xs ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay สำหรับ Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
