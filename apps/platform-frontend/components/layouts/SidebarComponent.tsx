'use client';

import React, { useEffect, useState } from 'react'
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
import { usePathname } from 'next/navigation'
import { SidebarItem } from '@/types/main'
import { sidebarItems } from '@/constants/menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context';

const SidebarComponent = () => {
    const pathname = usePathname()
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const { user } = useAuth();

    const isActiveRoute = (href: string) => pathname === href

    const isParentOfActiveRoute = (item: SidebarItem) => {
        return item.children?.some(child => child.href === pathname) || false
    }

    // กรองเมนูตามบทบาทของผู้ใช้
    const filteredSidebarItems = sidebarItems.filter(item => {
        // ถ้าไม่มีการกำหนด allowedRoles หรือผู้ใช้ไม่มี role_user ให้แสดงเมนูนั้น
        if (!item.allowedRoles || !user?.role_user) return true;

        // แสดงเฉพาะเมนูที่ผู้ใช้มีสิทธิ์เข้าถึงเท่านั้น
        return item.allowedRoles.includes(user.role_user);
    }).map(item => {
        // กรองเมนูย่อยด้วยเช่นกัน
        if (item.children) {
            const filteredChildren = item.children.filter(child => {
                if (!child.allowedRoles || !user?.role_user) return true;
                return child.allowedRoles.includes(user.role_user);
            });

            return {
                ...item,
                children: filteredChildren
            };
        }

        return item;
    });

    useEffect(() => {
        const defaultExpanded = filteredSidebarItems
            .filter(item => isParentOfActiveRoute(item))
            .map(item => item.title)
        setExpandedItems(defaultExpanded)
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            {filteredSidebarItems.map((item) => (
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
                                                                : "-translate-y-2 opacity-0"
                                                        )}
                                                        style={{
                                                            transitionDelay: `${(index + 1) * 50}ms`
                                                        }}
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

export default SidebarComponent;