/**
 * Department DTO Types
 * API Data Transfer Objects - Pure TypeScript types (no Zod)
 */

/**
 * User ใน Department
 */
export interface DepartmentUser {
  id: string;
  isHod: boolean;
}

/**
 * Users operations สำหรับ Create/Update
 */
export interface DepartmentUsersOperation {
  add?: DepartmentUser[];
  update?: DepartmentUser[];
  remove?: { id: string }[];
}

/**
 * DTO สำหรับ Create request
 */
export interface DepartmentCreateDto {
  name: string;
  description?: string;
  is_active: boolean;
  users?: DepartmentUsersOperation;
}

/**
 * DTO สำหรับ Update request (รวม id)
 */
export interface DepartmentUpdateDto extends DepartmentCreateDto {
  id: string;
}

/**
 * DTO สำหรับ GET list response
 */
export interface DepartmentGetListDto {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

/**
 * User display ใน Department detail
 */
export interface DepartmentUserDisplay {
  user_id: string;
  is_hod: boolean;
  firstname?: string;
  lastname?: string;
}

/**
 * DTO สำหรับ GET by ID response (รายละเอียด)
 */
export interface DepartmentGetByIdDto extends DepartmentGetListDto {
  tb_department_user: DepartmentUserDisplay[];
}
