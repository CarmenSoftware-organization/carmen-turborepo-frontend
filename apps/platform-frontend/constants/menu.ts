import { SidebarItem } from "@/types/main";
import {
    LayoutDashboard,
    FolderTree,
    Users,
    FileText
} from "lucide-react"

export const sidebarItems: SidebarItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        allowedRoles: ['is_platform', 'is_cluster', 'is_business_unit'],
    },
    {
        title: 'Platforms',
        href: '/platform',
        icon: FileText,
        allowedRoles: ['is_platform'],
    },
    {
        title: 'Clusters',
        href: '/cluster',
        icon: FolderTree,
        allowedRoles: ['is_platform', 'is_cluster'],
    },
    {
        title: 'Business Units',
        href: '/business-unit',
        icon: Users,
        allowedRoles: ['is_platform', 'is_cluster', 'is_business_unit'],
    },
]
