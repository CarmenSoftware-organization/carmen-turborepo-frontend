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
        href: '/platforms',
        icon: FileText,
    },
    {
        title: 'Clusters',
        href: '/clusters',
        icon: FolderTree,
    },
    {
        title: 'Business Units',
        href: '/business-units',
        icon: Users,
    },
]
