import {
    LayoutDashboard,
    Network,
    User,
    Building2,
    Users,
    LucideIcon
} from 'lucide-react'

interface NavigationItem {
    icon: LucideIcon
    label: string
    href: string
}

export const navigationItems: NavigationItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Network, label: 'Cluster', href: '/cluster' },
    { icon: User, label: 'Cluster User', href: '/cluster-user' },
    { icon: Building2, label: 'Business', href: '/business' },
    { icon: Users, label: 'User', href: '/user' },
]