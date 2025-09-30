import { usersPermissionTest } from './permissionData';

export interface User {
    id: string;
    name: string;
    role: string;
    permissions: string[];
}

export const hasPermission = (user: User, permission: string): boolean => {
    return user.permissions.includes(permission);
};

export const checkPermissions = (user: User, permissions: string[]) => {
    const results: Record<string, boolean> = {};
    permissions.forEach(permission => {
        results[permission] = hasPermission(user, permission);
    });
    return results;
};

export const getUserPermissions = (userId: string) => {
    const user = usersPermissionTest.find(u => u.id === userId);
    if (!user) return null;

    return {
        canView: hasPermission(user, "view"),
        canViewAll: hasPermission(user, "view_all"),
        canCreate: hasPermission(user, "create"),
        canEdit: hasPermission(user, "edit"),
        canDelete: hasPermission(user, "delete"),
    };
};

export const canPerformAction = (
    user: User,
    action: 'view' | 'edit' | 'delete',
    documentOwnerId: string
): boolean => {
    switch (action) {
        case 'view':
            return hasPermission(user, "view_all") ||
                (hasPermission(user, "view") && documentOwnerId === user.id);

        case 'edit':
            if (!hasPermission(user, "edit")) return false;
            return user.role === "admin" || documentOwnerId === user.id;

        case 'delete':
            if (!hasPermission(user, "delete")) return false;
            return user.role === "admin" || documentOwnerId === user.id;

        default:
            return false;
    }
};