import { menuItems } from "@/constants/menu-items";
import { Sidebar, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { ChevronDown, LayoutDashboard, ShoppingCart, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function SidebarComponent() {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const getMenuIcon = (label: string) => {
        switch (label) {
            case "Dashboard":
                return <LayoutDashboard className="h-5 w-5" />;
            case "Procurement":
                return <ShoppingCart className="h-5 w-5" />;
            case "Configuration":
                return <Settings className="h-5 w-5" />;
            default:
                return null;
        }
    };

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
        const icon = level === 0 ? getMenuIcon(item.label) : null;

        const menuButton = (
            <SidebarMenuButton
                onClick={hasChildren ? () => handleToggleExpand(item.href) : undefined}
                className={cn(
                    "w-full p-2 rounded-md transition-colors duration-200",
                    hasChildren && "cursor-pointer",
                    isExpanded && "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
                )}
            >
                <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                        {icon && (
                            <span className="text-[hsl(var(--sidebar-primary))]">
                                {icon}
                            </span>
                        )}
                        <span className="text-[hsl(var(--sidebar-foreground))]">{item.label}</span>
                    </span>
                    {hasChildren && (
                        <span
                            className={cn(
                                "inline-flex ml-2 transition-transform duration-200",
                                isExpanded && "transform rotate-180"
                            )}
                        >
                            <ChevronDown className="h-4 w-4 text-[hsl(var(--sidebar-foreground))]" />
                        </span>
                    )}
                </div>
            </SidebarMenuButton>
        );

        return (
            <div key={item.href}>
                <SidebarMenuItem>
                    <div
                        className={cn(
                            "flex items-center w-full gap-2 rounded-md transition-all duration-200 ease-in-out",
                            level > 0 && "pl-4",
                            hasChildren && "hover:bg-[hsl(var(--sidebar-accent))]"
                        )}
                    >
                        <div className="flex items-center gap-2 flex-1">
                            {hasChildren ? (
                                menuButton
                            ) : (
                                <Link href={item.href} className="w-full">
                                    {menuButton}
                                </Link>
                            )}
                        </div>
                    </div>
                </SidebarMenuItem>
                {hasChildren && (
                    <div
                        className={cn(
                            "ml-2 overflow-hidden transition-all duration-200 ease-in-out",
                            isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                        )}
                    >
                        {item.children!.map((child) => renderMenuItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Sidebar className="bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))]">
            <SidebarGroup>
                <div className="flex h-12 items-center border-b border-[hsl(var(--sidebar-border))] px-4 mb-4">
                    <SidebarGroupLabel className="text-xl font-semibold text-[hsl(var(--sidebar-primary))]">
                        Carmen Platform
                    </SidebarGroupLabel>
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


