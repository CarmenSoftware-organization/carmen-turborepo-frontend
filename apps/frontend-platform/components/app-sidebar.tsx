"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { sidebarItems, type SidebarItem } from "@/lib/menuSidebar"
import { ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const AppSidebar = () => {
    const pathname = usePathname()
    const [expandedItems, setExpandedItems] = useState<string[]>([])

    const isActiveRoute = (href: string) => pathname === href

    const isParentOfActiveRoute = (item: SidebarItem) => {
        return item.children?.some(child => child.href === pathname) || false
    }

    useEffect(() => {
        const defaultExpanded = sidebarItems
            .filter(item => isParentOfActiveRoute(item))
            .map(item => item.title)
        setExpandedItems(defaultExpanded)
    }, [pathname])

    const toggleItem = (title: string) => {
        setExpandedItems(current =>
            current.includes(title)
                ? current.filter(item => item !== title)
                : [...current, title]
        )
    }

    const hasChildren = (item: SidebarItem) => {
        return item.children && item.children.length > 0
    }

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <div className="flex h-12 items-center border-b px-4 mb-4">
                        <SidebarGroupLabel className="text-xl font-semibold">Carmen Platform</SidebarGroupLabel>
                    </div>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarItems.map((item) => (
                                <div key={item.title}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "group w-full",
                                                hasChildren(item) && "justify-between",
                                                (isActiveRoute(item.href) || isParentOfActiveRoute(item)) && "bg-accent"
                                            )}
                                        >
                                            <div className="flex w-full items-center">
                                                <Link
                                                    href={item.href}
                                                    className="flex flex-1 items-center gap-2 p-2"
                                                    onClick={(e) => {
                                                        if (hasChildren(item)) {
                                                            e.preventDefault()
                                                            toggleItem(item.title)
                                                        }
                                                    }}
                                                >
                                                    {item.icon && (
                                                        <div className="flex items-center transition-transform duration-200 ease-in-out group-hover:scale-110">
                                                            <item.icon className={cn(
                                                                "h-4 w-4",
                                                                (isActiveRoute(item.href) || isParentOfActiveRoute(item)) && "text-foreground"
                                                            )} />
                                                        </div>
                                                    )}
                                                    <span className={cn(
                                                        (isActiveRoute(item.href) || isParentOfActiveRoute(item)) && "font-medium text-foreground"
                                                    )}>{item.title}</span>
                                                    {hasChildren(item) && (
                                                        <ChevronDown
                                                            className={cn(
                                                                "ml-auto h-4 w-4 transition-transform duration-200 ease-in-out",
                                                                expandedItems.includes(item.title) && "rotate-180"
                                                            )}
                                                        />
                                                    )}
                                                </Link>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    {hasChildren(item) && (
                                        <div
                                            className={cn(
                                                "ml-6 grid border-l pl-2 transition-all duration-200 ease-in-out",
                                                expandedItems.includes(item.title)
                                                    ? "grid-rows-[1fr] opacity-100"
                                                    : "grid-rows-[0fr] opacity-0"
                                            )}
                                        >
                                            <div className="overflow-hidden">
                                                {(item.children as Required<SidebarItem>["children"]).map((child, index) => (
                                                    <div
                                                        key={child.title}
                                                        className={cn(
                                                            "transform transition-all duration-200 ease-in-out",
                                                            expandedItems.includes(item.title)
                                                                ? "translate-y-0 opacity-100"
                                                                : "-translate-y-2 opacity-0",
                                                            {
                                                                "delay-[50ms]": index === 0,
                                                                "delay-[100ms]": index === 1,
                                                                "delay-[150ms]": index === 2,
                                                                "delay-[200ms]": index === 3,
                                                                "delay-[250ms]": index >= 4,
                                                            }
                                                        )}
                                                    >
                                                        <SidebarMenuItem>
                                                            <SidebarMenuButton asChild>
                                                                <Link
                                                                    href={child.href}
                                                                    className={cn(
                                                                        "block p-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                                                                        isActiveRoute(child.href) && "font-medium text-accent"
                                                                    )}
                                                                >
                                                                    {child.title}
                                                                </Link>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
