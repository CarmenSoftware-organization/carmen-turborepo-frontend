interface MenuItem {
    label: string;
    href: string;
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Configuration",
        href: "/configuration",
        children: [
            {
                label: "Users",
                href: "/configuration/users",
            },
            {
                label: "Roles",
                href: "/configuration/roles",
            },
        ],
    },
]
