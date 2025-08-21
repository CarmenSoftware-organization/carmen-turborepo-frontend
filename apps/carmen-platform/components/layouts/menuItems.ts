interface NavigationItem {
    icon: string
    label: string
    href: string
}

export const navigationItems: NavigationItem[] = [
    { icon: '/icons/dashboard.svg', label: 'Dashboard', href: '/dashboard' },
    { icon: '/icons/cluster.svg', label: 'Cluster', href: '/cluster' },
    { icon: '/icons/user.svg', label: 'Cluster User', href: '/cluster-user' },
    { icon: '/icons/business.svg', label: 'Business', href: '/business' },
    { icon: '/icons/user-group.svg', label: 'User', href: '/user' },
]