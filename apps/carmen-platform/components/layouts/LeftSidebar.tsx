'use client'

import { Link, usePathname } from "@/i18n/routing"
import Image from 'next/image'
import { useState } from 'react'
import { cn } from "@/lib/utils"
import { navigationItems } from "./menuItems"

export default function LeftSidebar() {

    const [isHovered, setIsHovered] = useState(false)
    const pathname = usePathname()

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    const sidebarWidth = isHovered ? "w-64" : "w-16";

    const isActivePath = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/')
    }

    return (
        <nav
            className={cn(
                "bg-background transition-all duration-300 ease-in-out",
                sidebarWidth
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex flex-col gap-y-2 p-1 mx-2">
                {navigationItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 p-1 rounded-lg transition-all duration-200 hover:bg-accent",
                            isActivePath(item.href) && "bg-accent text-accent-foreground",
                            !(isHovered) && "justify-center"
                        )}
                    >
                        <Image
                            src={item.icon}
                            alt={item.label}
                            width={24}
                            height={24}
                            className="flex-shrink-0"
                        />
                        {(isHovered) && (
                            <span className="text-sm font-medium whitespace-nowrap">
                                {item.label}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </nav>
    )
}