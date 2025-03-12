import {
    LayoutDashboard,
    FolderTree,
    Users,
    FileText,
    HelpCircle,
    Settings,
    CreditCard,
} from "lucide-react"

export interface SidebarItem {
    title: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
    matchPath?: string
    children?: {
        title: string
        href: string
    }[]
}


export const sidebarItems: SidebarItem[] = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Clusters",
        href: "/admin/clusters",
        icon: FolderTree,
        matchPath: "/admin/clusters",
        children: [
            {
                title: "All Clusters",
                href: "/admin/clusters",
            },
            {
                title: "Templates",
                href: "/admin/clusters/templates",
            },
            {
                title: "Members",
                href: "/admin/clusters/members",
            }
        ]
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
        matchPath: "/admin/users",
        children: [
            {
                title: "Platform Users",
                href: "/admin/users/platform",
            },
            {
                title: "Cluster Users",
                href: "/admin/users/clusters",
            },
            {
                title: "Hotel Staff",
                href: "/admin/users/hotels",
            },
            {
                title: "Roles",
                href: "/admin/users/roles",
            },
            {
                title: "Access Control",
                href: "/admin/users/access",
            }
        ]
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: FileText,
    },
    {
        title: "Subscriptions",
        href: "/admin/subscriptions",
        icon: CreditCard,
        matchPath: "/admin/subscriptions",
        children: [
            {
                title: "Plans",
                href: "/admin/subscriptions/plans",
            },
            {
                title: "Modules",
                href: "/admin/subscriptions/modules",
            },
            {
                title: "Usage",
                href: "/admin/subscriptions/usage",
            },
            {
                title: "Billing",
                href: "/admin/subscriptions/billing",
            }
        ]
    },
    {
        title: "Support",
        href: "/admin/support",
        icon: HelpCircle,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
        children: [
            {
                title: "General",
                href: "/admin/settings",
            },
            {
                title: "Profile",
                href: "/admin/settings/profile",
            },
            {
                title: "Security",
                href: "/admin/settings/security",
            }
        ],
    },
]
