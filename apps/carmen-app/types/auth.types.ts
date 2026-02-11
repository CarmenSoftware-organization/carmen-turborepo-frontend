// Permission Types
// Base actions ที่ใช้ทั่วไป
export type BasePermissionAction =
  | "view_all"
  | "view"
  | "view_dp" // view by department
  | "create"
  | "update"
  | "delete";

// Workflow actions สำหรับ document ที่มี approval flow
export type WorkflowPermissionAction = "approve" | "reject" | "send_back" | "submit";

// รวม action ทั้งหมด
export type PermissionAction = BasePermissionAction | WorkflowPermissionAction;

// Module หลักของระบบ
export type PermissionModule =
  | "configuration"
  | "product_management"
  | "vendor_management"
  | "procurement";

// Resources แต่ละ module
export type ConfigurationResource =
  | "currency"
  | "exchange_rates"
  | "delivery_point"
  | "store_location"
  | "department"
  | "tax_profile"
  | "extra_cost"
  | "business_type";

export type ProductManagementResource = "product" | "category" | "report" | "unit";

export type VendorManagementResource = "vendor" | "vendor_contact";

export type ProcurementResource = "purchase_order" | "purchase_request" | "grn";

// Helper type: ดึง resource type ตาม module
export type ResourceByModule<T extends PermissionModule> = T extends "configuration"
  ? ConfigurationResource
  : T extends "product_management"
    ? ProductManagementResource
    : T extends "vendor_management"
      ? VendorManagementResource
      : T extends "procurement"
        ? ProcurementResource
        : never;

// Permission structure - ใช้ string[] เพื่อรองรับ dynamic actions
export type Permissions = {
  configuration?: Partial<Record<ConfigurationResource, string[]>>;
  product_management?: Partial<Record<ProductManagementResource, string[]>>;
  vendor_management?: Partial<Record<VendorManagementResource, string[]>>;
  procurement?: Partial<Record<ProcurementResource, string[]>>;
};

export interface UserInfo {
  firstname: string;
  middlename?: string;
  lastname: string;
  telephone?: string;
}

export interface NumberFormat {
  locales: string;
  minimumIntegerDigits: number;
  minimumFractionDigits: number;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  description: string;
  decimal_places: number;
}

export interface ContactInfo {
  name: string;
  tel: string;
  email: string;
  address: string;
  zip_code: string;
}

export interface BusinessUnitConfig {
  calculation_method?: string;
  default_currency_id?: string;
  default_currency?: CurrencyInfo;
  hotel?: ContactInfo;
  company?: ContactInfo;
  tax_no?: string;
  branch_no?: string;
  date_format?: string;
  time_format?: string;
  date_time_format?: string;
  long_time_format?: string;
  short_time_format?: string;
  timezone?: string;
  perpage_format?: { default: number };
  amount_format?: NumberFormat;
  quantity_format?: NumberFormat;
  recipe_format?: NumberFormat;
  description?: string;
  info?: unknown;
  is_hq?: boolean;
  is_active?: boolean;
}

export interface BusinessUnit {
  id: string;
  name: string;
  code: string;
  alias_name?: string;
  is_default?: boolean;
  system_level?: string;
  is_active?: boolean;
  department?: {
    id: string;
    name: string;
  };
  hod_department?: Array<{
    id: string;
    name: string;
  }>;
  config?: BusinessUnitConfig;
}

export interface UserData {
  id: string;
  email: string;
  alias_name?: string;
  platform_role?: string;
  user_info: UserInfo;
  business_unit: BusinessUnit[];
}

export interface User {
  data: UserData;
  permissions?: Permissions;
}
