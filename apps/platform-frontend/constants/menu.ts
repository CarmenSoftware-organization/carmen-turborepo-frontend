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
    },
    {
        title: 'Platforms',
        href: '/platform',
        icon: FileText,
    },
    {
        title: 'Clusters',
        href: '/cluster',
        icon: FolderTree,
    },
    {
        title: 'Business Units',
        href: '/business-unit',
        icon: Users,
    },
]
