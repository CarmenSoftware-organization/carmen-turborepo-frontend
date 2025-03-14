// Define the routes configuration with role-based access control
export type Route = {
    path?: string;
    title: string;
    allowedRoles: string[];
    icon?: string;
    children?: Route[];
};

export const appRoutes: Route[] = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        allowedRoles: ['is_platform', 'is_cluster', 'is_business_unit'],
        icon: 'dashboard',
    },
    {
        title: 'Platforms',
        allowedRoles: ['is_platform'],
        icon: 'settings',
        children: [
            {
                path: '/platform',
                title: 'Platform Settings',
                allowedRoles: ['is_platform'],
            },
            {
                path: '/platform/users',
                title: 'User Management',
                allowedRoles: ['is_platform'],
            },
        ],
    },
    {
        title: 'Clusters',
        allowedRoles: ['is_platform', 'is_cluster'],
        icon: 'clusters',
        children: [
            {
                path: '/cluster',
                title: 'Cluster',
                allowedRoles: ['is_platform', 'is_cluster'],
            },
            {
                path: '/cluster/settings',
                title: 'Cluster Settings',
                allowedRoles: ['is_platform', 'is_cluster'],
            },
        ],
    },
    {
        title: 'Business Units',
        allowedRoles: ['is_platform', 'is_business_unit'],
        icon: 'business',
        children: [
            {
                path: '/business-unit',
                title: 'Business Unit',
                allowedRoles: ['is_platform', 'is_business_unit'],
            },
            {
                path: '/business-unit/reports',
                title: 'Reports',
                allowedRoles: ['is_platform', 'is_business_unit'],
            },
        ],
    },
];

// Helper function to check if a user can access a route based on their role
export const canAccessRoute = (userRole: string, route: Route): boolean => {
    return route.allowedRoles.includes(userRole);
};

// Helper function to find a route by path
export const findRouteByPath = (path: string): Route | null => {
    // Normalize the path
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;

    // Helper function to search routes recursively
    const searchRoutes = (routes: Route[]): Route | null => {
        for (const route of routes) {
            if (route.path === normalizedPath) {
                return route;
            }

            if (route.children) {
                const childRoute = searchRoutes(route.children);
                if (childRoute) return childRoute;
            }
        }
        return null;
    };

    return searchRoutes(appRoutes);
}; 