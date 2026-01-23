export interface DepartmentUser {
  id: string;
  is_hod: boolean;
}
export interface DepartmentUsersOperation {
  add?: DepartmentUser[];
  update?: DepartmentUser[];
  remove?: { id: string }[];
}

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

export interface DepartmentGetListDto {
  id: string;
  name: string;
  description: string;
  code: string;
  is_active: boolean;
}
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
