import { menuItems } from "@/constants/menu-items";
import { Sidebar, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SidebarComponent() {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const handleToggleExpand = (href: string) => {
        setExpandedItems((prev) =>
            prev.includes(href)
                ? prev.filter((item) => item !== href)
                : [...prev, href]
        );
    };

    const renderMenuItem = (item: typeof menuItems[0], level = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.href);

        return (
            <div key={item.href}>
                <SidebarMenuItem>
                    <div
                        className={cn(
                            "flex items-center w-full gap-2",
                            level > 0 && "pl-4"
                        )}
                    >
                        <div className="flex items-center gap-2 flex-1">
                            <SidebarMenuButton
                                onClick={hasChildren ? () => handleToggleExpand(item.href) : undefined}
                                className={cn(hasChildren && "cursor-pointer")}
                            >
                                {item.label}
                                {hasChildren && (
                                    <span className="ml-2 inline-flex">
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </span>
                                )}
                            </SidebarMenuButton>
                        </div>
                    </div>
                </SidebarMenuItem>
                {hasChildren && isExpanded && (
                    <div className="ml-2">
                        {item.children!.map((child) => renderMenuItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Sidebar>
            <SidebarGroup>
                <div className="flex h-12 items-center border-b px-4 mb-4">
                    <SidebarGroupLabel className="text-xl font-semibold">Carmen Platform</SidebarGroupLabel>
                </div>
            </SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {menuItems.map((item) => renderMenuItem(item))}
                </SidebarMenu>
            </SidebarGroupContent>
        </Sidebar>
    );
}


