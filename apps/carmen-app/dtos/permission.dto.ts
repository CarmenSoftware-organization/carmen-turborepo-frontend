export enum ACTION_PERMISSION {
  CREATE = "create",
  VIEW = "view",
  VIEW_ALL = "view_all",
  UPDATE = "update",
  DELETE = "delete",
}

export interface BasePermissionDto {
  resource: string;
  action: ACTION_PERMISSION;
  description?: string;
}

export interface PermissionDto extends BasePermissionDto {
  id: string;
}
