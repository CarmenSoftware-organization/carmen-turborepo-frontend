import type {
  PermissionModule,
  Permissions,
  ResourceByModule,
  ConfigurationResource,
  ProductManagementResource,
  VendorManagementResource,
  ProcurementResource,
} from "@/types/auth.types";

/**
 * เช็คว่า user มี permission สำหรับ action นั้นๆ หรือไม่
 * @param permissions - permissions object จาก user
 * @param module - module ที่ต้องการเช็ค เช่น "configuration"
 * @param resource - resource ที่ต้องการเช็ค เช่น "currency"
 * @param action - action ที่ต้องการทำ เช่น "view", "create"
 * @returns true ถ้ามี permission, false ถ้าไม่มี
 */
export const hasPermission = <T extends PermissionModule>(
  permissions: Permissions | undefined,
  module: T,
  resource: ResourceByModule<T>,
  action: string
): boolean => {
  if (!permissions) return false;

  const modulePermissions = permissions[module];
  if (!modulePermissions) return false;

  // Type assertion เพื่อให้ TypeScript รู้จัก dynamic key
  const resourcePermissions = (modulePermissions as Record<string, string[] | undefined>)[resource];
  if (!resourcePermissions || !Array.isArray(resourcePermissions)) return false;

  return resourcePermissions.includes(action);
};

/**
 * เช็ค multiple permissions พร้อมกัน
 * @param permissions - permissions object จาก user
 * @param module - module ที่ต้องการเช็ค
 * @param resource - resource ที่ต้องการเช็ค
 * @param actions - array ของ actions ที่ต้องการเช็ค
 * @returns object ที่มี key เป็น action และ value เป็น boolean
 */
export const checkPermissions = <T extends PermissionModule>(
  permissions: Permissions | undefined,
  module: T,
  resource: ResourceByModule<T>,
  actions: string[]
): Record<string, boolean> => {
  const results: Record<string, boolean> = {};
  actions.forEach((action) => {
    results[action] = hasPermission(permissions, module, resource, action);
  });
  return results;
};

/**
 * ดึง permission flags ทั่วไปสำหรับ resource นั้นๆ
 * @param permissions - permissions object จาก user
 * @param module - module ที่ต้องการเช็ค
 * @param resource - resource ที่ต้องการเช็ค
 * @returns object ที่มี flags สำหรับ action ต่างๆ
 */
export const getResourcePermissions = <T extends PermissionModule>(
  permissions: Permissions | undefined,
  module: T,
  resource: ResourceByModule<T>
) => {
  return {
    canViewAll: hasPermission(permissions, module, resource, "view_all"),
    canView: hasPermission(permissions, module, resource, "view"),
    canViewDp: hasPermission(permissions, module, resource, "view_dp"),
    canCreate: hasPermission(permissions, module, resource, "create"),
    canUpdate: hasPermission(permissions, module, resource, "update"),
    canDelete: hasPermission(permissions, module, resource, "delete"),
    // Workflow actions
    canApprove: hasPermission(permissions, module, resource, "approve"),
    canReject: hasPermission(permissions, module, resource, "reject"),
    canSendBack: hasPermission(permissions, module, resource, "send_back"),
    canSubmit: hasPermission(permissions, module, resource, "submit"),
  };
};

/**
 * เช็คว่า user สามารถ view ข้อมูลได้หรือไม่ (รองรับ view_all, view, view_dp)
 * @param permissions - permissions object จาก user
 * @param module - module ที่ต้องการเช็ค
 * @param resource - resource ที่ต้องการเช็ค
 * @param ownerId - id ของเจ้าของข้อมูล (optional)
 * @param currentUserId - id ของ user ปัจจุบัน (optional)
 * @param departmentId - id ของ department (optional, สำหรับ view_dp)
 * @param userDepartmentId - id ของ department ของ user (optional)
 * @returns true ถ้าสามารถ view ได้
 */
export const canView = <T extends PermissionModule>(
  permissions: Permissions | undefined,
  module: T,
  resource: ResourceByModule<T>,
  options?: {
    ownerId?: string;
    currentUserId?: string;
    departmentId?: string;
    userDepartmentId?: string;
  }
): boolean => {
  // ถ้ามี view_all ดูได้ทุกอัน
  if (hasPermission(permissions, module, resource, "view_all")) {
    return true;
  }

  // ถ้ามี view_dp และ department ตรงกัน
  if (
    options?.departmentId &&
    options?.userDepartmentId &&
    hasPermission(permissions, module, resource, "view_dp")
  ) {
    return options.departmentId === options.userDepartmentId;
  }

  // ถ้ามี view และเป็นเจ้าของ
  if (
    options?.ownerId &&
    options?.currentUserId &&
    hasPermission(permissions, module, resource, "view")
  ) {
    return options.ownerId === options.currentUserId;
  }

  // ถ้ามี view อย่างเดียว
  if (hasPermission(permissions, module, resource, "view")) {
    return true;
  }

  return false;
};

/**
 * เช็คว่า user สามารถแก้ไขข้อมูลได้หรือไม่
 * @param permissions - permissions object จาก user
 * @param module - module ที่ต้องการเช็ค
 * @param resource - resource ที่ต้องการเช็ค
 * @param ownerId - id ของเจ้าของข้อมูล (optional)
 * @param currentUserId - id ของ user ปัจจุบัน (optional)
 * @returns true ถ้าสามารถแก้ไขได้
 */
export const canUpdate = <T extends PermissionModule>(
  permissions: Permissions | undefined,
  module: T,
  resource: ResourceByModule<T>,
  ownerId?: string,
  currentUserId?: string
): boolean => {
  if (!hasPermission(permissions, module, resource, "update")) {
    return false;
  }

  // ถ้าไม่มี owner id ให้ถือว่าสามารถแก้ไขได้ (แก้ไขทุกอัน)
  if (!ownerId || !currentUserId) {
    return true;
  }

  // ถ้ามี owner id ต้องเป็นเจ้าของถึงจะแก้ไขได้
  return ownerId === currentUserId;
};

/**
 * เช็คว่า user สามารถลบข้อมูลได้หรือไม่
 * @param permissions - permissions object จาก user
 * @param module - module ที่ต้องการเช็ค
 * @param resource - resource ที่ต้องการเช็ค
 * @param ownerId - id ของเจ้าของข้อมูล (optional)
 * @param currentUserId - id ของ user ปัจจุบัน (optional)
 * @returns true ถ้าสามารถลบได้
 */
export const canDelete = <T extends PermissionModule>(
  permissions: Permissions | undefined,
  module: T,
  resource: ResourceByModule<T>,
  ownerId?: string,
  currentUserId?: string
): boolean => {
  if (!hasPermission(permissions, module, resource, "delete")) {
    return false;
  }

  // ถ้าไม่มี owner id ให้ถือว่าสามารถลบได้ (ลบทุกอัน)
  if (!ownerId || !currentUserId) {
    return true;
  }

  // ถ้ามี owner id ต้องเป็นเจ้าของถึงจะลบได้
  return ownerId === currentUserId;
};

/**
 * เช็คว่า user สามารถทำ action ใดๆ กับข้อมูลได้หรือไม่
 * @param permissions - permissions object จาก user
 * @param module - module ที่ต้องการเช็ค
 * @param resource - resource ที่ต้องการเช็ค
 * @param action - action ที่ต้องการทำ
 * @param options - options สำหรับการเช็ค (ownerId, currentUserId, etc.)
 * @returns true ถ้าสามารถทำได้
 */
export const canPerformAction = <T extends PermissionModule>(
  permissions: Permissions | undefined,
  module: T,
  resource: ResourceByModule<T>,
  action: string,
  options?: {
    ownerId?: string;
    currentUserId?: string;
    departmentId?: string;
    userDepartmentId?: string;
  }
): boolean => {
  switch (action) {
    case "view":
    case "view_all":
    case "view_dp":
      return canView(permissions, module, resource, options);

    case "update":
      return canUpdate(
        permissions,
        module,
        resource,
        options?.ownerId,
        options?.currentUserId
      );

    case "delete":
      return canDelete(
        permissions,
        module,
        resource,
        options?.ownerId,
        options?.currentUserId
      );

    default:
      return hasPermission(permissions, module, resource, action);
  }
};

// Type-safe helpers for each module
export const configurationPermission = {
  has: (
    permissions: Permissions | undefined,
    resource: ConfigurationResource,
    action: string
  ) => hasPermission(permissions, "configuration", resource, action),

  get: (permissions: Permissions | undefined, resource: ConfigurationResource) =>
    getResourcePermissions(permissions, "configuration", resource),

  canView: (
    permissions: Permissions | undefined,
    resource: ConfigurationResource,
    options?: Parameters<typeof canView>[3]
  ) => canView(permissions, "configuration", resource, options),
};

export const productManagementPermission = {
  has: (
    permissions: Permissions | undefined,
    resource: ProductManagementResource,
    action: string
  ) => hasPermission(permissions, "product_management", resource, action),

  get: (permissions: Permissions | undefined, resource: ProductManagementResource) =>
    getResourcePermissions(permissions, "product_management", resource),

  canView: (
    permissions: Permissions | undefined,
    resource: ProductManagementResource,
    options?: Parameters<typeof canView>[3]
  ) => canView(permissions, "product_management", resource, options),
};

export const vendorManagementPermission = {
  has: (
    permissions: Permissions | undefined,
    resource: VendorManagementResource,
    action: string
  ) => hasPermission(permissions, "vendor_management", resource, action),

  get: (permissions: Permissions | undefined, resource: VendorManagementResource) =>
    getResourcePermissions(permissions, "vendor_management", resource),

  canView: (
    permissions: Permissions | undefined,
    resource: VendorManagementResource,
    options?: Parameters<typeof canView>[3]
  ) => canView(permissions, "vendor_management", resource, options),
};

export const procurementPermission = {
  has: (
    permissions: Permissions | undefined,
    resource: ProcurementResource,
    action: string
  ) => hasPermission(permissions, "procurement", resource, action),

  get: (permissions: Permissions | undefined, resource: ProcurementResource) =>
    getResourcePermissions(permissions, "procurement", resource),

  canView: (
    permissions: Permissions | undefined,
    resource: ProcurementResource,
    options?: Parameters<typeof canView>[3]
  ) => canView(permissions, "procurement", resource, options),
};
