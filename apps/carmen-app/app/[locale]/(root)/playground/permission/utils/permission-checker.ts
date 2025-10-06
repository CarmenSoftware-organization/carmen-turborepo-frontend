import type { PermissionAction, UserPermissions } from "../types/permission.types";

/**
 * Pure function to check if user has specific permission
 * @param user - User with permissions
 * @param module - Module name (e.g., "procurement")
 * @param submodule - Submodule name (e.g., "purchase_request")
 * @param action - Permission action to check
 * @returns true if user has permission, false otherwise
 */
export function hasPermission(
  user: UserPermissions | undefined,
  module: string,
  submodule: string,
  action: PermissionAction
): boolean {
  if (!user) return false;

  const modulePerms = user.permissions[module];
  if (!modulePerms) return false;

  const submodulePerms = modulePerms[submodule];
  if (!submodulePerms) return false;

  return submodulePerms.includes(action);
}

/**
 * Pure function to filter documents based on view permissions
 * @param documents - Array of documents to filter
 * @param user - User with permissions
 * @param module - Module name
 * @param submodule - Submodule name
 * @param userId - Current user ID for ownership check
 * @returns Filtered array of documents
 */
export function filterDocumentsByPermission<T extends { id: string; ownerId?: string; [key: string]: any }>(
  documents: T[],
  user: UserPermissions | undefined,
  module: string,
  submodule: string,
  userId: string
): T[] {
  if (!user) return [];

  const modulePerms = user.permissions[module];
  if (!modulePerms) return [];

  const permissions = modulePerms[submodule];
  if (!permissions) return [];

  // If has view_all permission, show all documents
  if (permissions.includes("view_all")) {
    return documents;
  }

  // If has view permission, show only own documents (if ownerId exists)
  if (permissions.includes("view")) {
    return documents.filter((doc) => {
      // If document has no ownerId (e.g., configuration), don't filter by ownership
      if (!doc.ownerId) {
        return true;
      }
      // Otherwise, filter by ownership
      return doc.ownerId === userId;
    });
  }

  // No view permission, show nothing
  return [];
}

/**
 * Get all permissions for a specific module/submodule
 * @param user - User with permissions
 * @param module - Module name
 * @param submodule - Submodule name
 * @returns Array of permission actions or empty array
 */
export function getModulePermissions(
  user: UserPermissions | undefined,
  module: string,
  submodule: string
): PermissionAction[] {
  if (!user) return [];

  const modulePerms = user.permissions[module];
  if (!modulePerms) return [];

  const submodulePerms = modulePerms[submodule];
  if (!submodulePerms) return [];

  return submodulePerms;
}

/**
 * Check multiple permissions at once
 * @param user - User with permissions
 * @param module - Module name
 * @param submodule - Submodule name
 * @param actions - Array of actions to check
 * @returns Object with action as key and boolean as value
 */
export function checkPermissions(
  user: UserPermissions | undefined,
  module: string,
  submodule: string,
  actions: PermissionAction[]
): Record<PermissionAction, boolean> {
  const result = {} as Record<PermissionAction, boolean>;

  actions.forEach((action) => {
    result[action] = hasPermission(user, module, submodule, action);
  });

  return result;
}

/**
 * Get permission flags for common actions
 * @param user - User with permissions
 * @param module - Module name
 * @param submodule - Submodule name
 * @returns Object with boolean flags for common permissions
 */
export function getPermissionFlags(
  user: UserPermissions | undefined,
  module: string,
  submodule: string
) {
  return {
    canViewAll: hasPermission(user, module, submodule, "view_all"),
    canViewDp: hasPermission(user, module, submodule, "view_dp"),
    canView: hasPermission(user, module, submodule, "view"),
    canCreate: hasPermission(user, module, submodule, "create"),
    canUpdate: hasPermission(user, module, submodule, "update"),
    canDelete: hasPermission(user, module, submodule, "delete"),
    canApprove: hasPermission(user, module, submodule, "approve"),
    canReject: hasPermission(user, module, submodule, "reject"),
    canSendBack: hasPermission(user, module, submodule, "send_back"),
    canSubmit: hasPermission(user, module, submodule, "submit"),
  };
}

/**
 * Check if user can perform action on specific document
 * @param user - User with permissions
 * @param module - Module name
 * @param submodule - Submodule name
 * @param action - Action to check
 * @param document - Document to check ownership
 * @param userId - Current user ID
 * @returns true if user can perform action
 */
export function canPerformAction<T extends { ownerId?: string }>(
  user: UserPermissions | undefined,
  module: string,
  submodule: string,
  action: PermissionAction,
  document: T,
  userId: string
): boolean {
  // First check if user has the permission
  if (!hasPermission(user, module, submodule, action)) {
    return false;
  }

  // If document has no owner (configuration data), permission is enough
  if (!document.ownerId) {
    return true;
  }

  // For view_all, can perform action on any document
  if (hasPermission(user, module, submodule, "view_all")) {
    return true;
  }

  // For regular view, can only perform action on own documents
  return document.ownerId === userId;
}
