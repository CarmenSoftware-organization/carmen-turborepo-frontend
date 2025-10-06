export type PermissionAction =
  | "view_all"
  | "view_dp"
  | "view"
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "send_back"
  | "submit";

export type DocumentStatus = "pending" | "approved" | "rejected" | "active" | "inactive";

export interface BaseDocument {
  id: string;
  title: string;
  status: DocumentStatus;
  ownerId?: string;
  [key: string]: any;
}

export interface ProcurementDocument extends BaseDocument {
  ownerId: string;
}

export interface ConfigurationDocument extends BaseDocument {
  ownerId?: never;
}

export interface UserPermissions {
  id: string;
  name: string;
  role: string;
  permissions: {
    [module: string]: {
      [submodule: string]: PermissionAction[];
    };
  };
}

export interface ModulePermissionsHook {
  hasPermission: (action: PermissionAction) => boolean;
  filterDocuments: <T extends BaseDocument>(documents: T[]) => T[];
  canViewAll: boolean;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReject: boolean;
  canSendBack: boolean;
  canSubmit: boolean;
}
