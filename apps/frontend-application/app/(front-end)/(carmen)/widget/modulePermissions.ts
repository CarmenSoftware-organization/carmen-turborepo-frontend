import { UserRole, ActionType } from './mockModule';

export interface ModulePermission {
    requiredRole: UserRole[];
    allowedActions: ActionType[];
}

export interface ModulePermissionsType {
    [key: string]: ModulePermission;
}

export const ModulePermissions: ModulePermissionsType = {
    "id_01": {
        requiredRole: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
        allowedActions: [ActionType.VIEW_ALL, ActionType.VIEW, ActionType.CREATE, ActionType.UPDATE]
    },
    "id_02": {
        requiredRole: [UserRole.ADMIN, UserRole.MANAGER],
        allowedActions: [ActionType.UPDATE, ActionType.DELETE]
    },
    "id_03": {
        requiredRole: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
        allowedActions: [ActionType.VIEW_ALL, ActionType.VIEW, ActionType.CREATE]
    },
    "id_04": {
        requiredRole: [UserRole.ADMIN, UserRole.MANAGER],
        allowedActions: [ActionType.VIEW_ALL, ActionType.VIEW, ActionType.UPDATE, ActionType.DELETE]
    },
    "id_05": {
        requiredRole: [UserRole.ADMIN, UserRole.MANAGER],
        allowedActions: [ActionType.VIEW, ActionType.CREATE, ActionType.UPDATE, ActionType.DELETE_ALL]
    },
    "id_06": {
        requiredRole: [UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER],
        allowedActions: [ActionType.VIEW_ALL, ActionType.VIEW]
    }
};