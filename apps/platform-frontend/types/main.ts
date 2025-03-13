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
