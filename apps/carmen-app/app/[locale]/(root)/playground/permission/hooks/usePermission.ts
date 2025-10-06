import type { PermissionAction, UserPermissions } from "../types/permission.types";
import {
  hasPermission,
  filterDocumentsByPermission,
  getPermissionFlags,
} from "../utils/permission-checker";

/**
 * React Hook wrapper for permission utilities
 * Provides convenient access to permission checking in React components
 */
export const useModulePermissions = (
  user: UserPermissions | undefined,
  module: string,
  submodule: string,
  userId: string
) => {
  const checkPermission = (action: PermissionAction): boolean => {
    return hasPermission(user, module, submodule, action);
  };

  const filterDocuments = <T extends { id: string; ownerId?: string; [key: string]: unknown }>(documents: T[]): T[] => {
    return filterDocumentsByPermission(documents, user, module, submodule, userId);
  };

  const flags = getPermissionFlags(user, module, submodule);

  return {
    hasPermission: checkPermission,
    filterDocuments,
    ...flags,
  };
};
