import { SidebarItem } from "@/dto/sidebar.dto"
import {
    LayoutDashboard,
    FolderTree,
    Users,
    FileText,
    Settings,
    UserPlus,
    IdCardIcon,
    HelpCircle
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
        children: [
            {
                title: 'Overview',
                href: '/platform',
            },
            {
                title: 'Platform Users',
                href: '/platform/users',
                icon: UserPlus,
            },
            {
                title: 'Platform Settings',
                href: '/platform/settings',
                icon: Settings,
            }
        ]
    },
    {
        title: 'Clusters',
        href: '/cluster',
        icon: FolderTree,
        allowedRoles: ['is_platform', 'is_cluster'],
        children: [
            {
                title: 'Overview',
                href: '/cluster',
            },
            {
                title: 'Template',
                href: '/cluster/template',
                icon: UserPlus,
            },
            {
                title: 'Members',
                href: '/cluster/members',
                icon: UserPlus,
            }
        ]
    },
    {
        title: 'Business Units',
        href: '/business-unit',
        icon: Users,
        allowedRoles: ['is_platform', 'is_cluster', 'is_business_unit'],
        children: [
            {
                title: 'Overview',
                href: '/business-unit',
            },
            {
                title: 'Business Unit Users',
                href: '/business-unit/users',
                icon: UserPlus,
            },
            {
                title: 'Business Unit Settings',
                href: '/business-unit/settings',
                icon: Settings,
            }
        ]
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: FileText,
        allowedRoles: ['is_platform', 'is_cluster', 'is_business_unit'],
    },
    {
        title: 'Subscriptions',
        href: '/subscriptions',
        icon: IdCardIcon,
        allowedRoles: ['is_platform', 'is_cluster', 'is_business_unit'],
        children: [
            {
                title: 'Subscriptions',
                href: '/subscriptions',
            },
            {
                title: 'Plan',
                href: '/subscriptions/plan',
            }
        ]
    },
    {
        title: 'Support',
        href: '/support',
        icon: HelpCircle,
        allowedRoles: ['is_platform', 'is_cluster', 'is_business_unit'],
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        allowedRoles: ['is_platform', 'is_cluster', 'is_business_unit'],
        children: [
            {
                title: 'General ',
                href: '/settings',
            },
            {
                title: 'Profile',
                href: '/settings/profile',
            },
            {
                title: 'Security',
                href: '/settings/security',
            }
        ]
    }
]
