'use client'

import { Link } from "@/i18n/routing"
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

interface NavigationItem {
    icon: string
    label: string
    href: string
}

const navigationItems: NavigationItem[] = [
    { icon: '/icons/dashboard.svg', label: 'Dashboard', href: '/dashboard' },
    { icon: '/icons/business.svg', label: 'Business', href: '/business' },
    { icon: '/icons/department.svg', label: 'Department', href: '/department' },
    { icon: '/icons/user-group.svg', label: 'User', href: '/user' },
]

export default function LeftSidebar() {

    const [isHovered, setIsHovered] = useState(false)
    const pathname = usePathname()

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    // กำหนดขนาด sidebar ตาม state
    const sidebarWidth = isHovered ? "w-64" : "w-16"

    return (
        <nav
            className={cn(
                "border-r bg-background transition-all duration-300 ease-in-out",
                sidebarWidth
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex flex-col gap-y-2 p-1">
                {navigationItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 p-1 rounded-lg transition-all duration-200 hover:bg-accent",
                            pathname === item.href && "bg-accent text-accent-foreground",
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