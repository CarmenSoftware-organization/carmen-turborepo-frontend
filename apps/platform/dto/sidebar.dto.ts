export interface SidebarItem {
    title: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
    matchPath?: string
    allowedRoles?: string[]
    children?: {
        title: string
        href: string
        icon?: React.ComponentType<{ className?: string }>
        allowedRoles?: string[]
    }[]
}