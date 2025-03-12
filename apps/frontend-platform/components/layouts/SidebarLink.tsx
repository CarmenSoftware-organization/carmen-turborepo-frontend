import { SidebarItem } from '@/lib/menuSidebar'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

const SidebarLink = ({ item, isChild = false }: { item: SidebarItem, isChild?: boolean }) => {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(
        item.children?.some(child => pathname === child.href || pathname.startsWith(child.href + '/'))
    )

    const isActive = item.matchPath
        ? pathname.startsWith(item.matchPath)
        : pathname === item.href || pathname.startsWith(item.href + '/')

    if (!item.children || isChild) {
        return (
            <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all duration-200 ease-in-out hover:text-foreground",
                    isActive && "bg-muted text-foreground",
                    isChild && "pl-9"
                )}
            >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.title}
            </Link>
        )
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-muted-foreground transition-all duration-200 ease-in-out hover:text-foreground",
                    isActive && "text-foreground"
                )}
            >
                <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.title}
                </div>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 transition-transform duration-200 ease-in-out",
                        isOpen && "rotate-180"
                    )}
                />
            </button>
            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="space-y-1 pt-1">
                    {item.children.map((child, index) => (
                        <SidebarLink key={index} item={child} isChild />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SidebarLink;