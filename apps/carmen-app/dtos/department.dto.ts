import { z } from "zod";

export const departmentBaseSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    is_active: z.boolean(),
});

/**
 * 🔹 Schema สำหรับสร้าง Department (POST)
 * สามารถแนบข้อมูล users ที่จะเพิ่มเข้ามาได้ในรูปแบบ add/update/remove
 */
export const departmentCreateSchema = departmentBaseSchema.extend({
    users: z
        .object({
            add: z
                .array(
                    z.object({
                        id: z.string().min(1),        // user_id ของผู้ใช้งาน
                        isHod: z.boolean(),           // เป็นหัวหน้าแผนกหรือไม่
                    })
                )
                .optional(),
            update: z
                .array(
                    z.object({
                        id: z.string().min(1),
                        isHod: z.boolean(),
                    })
                )
                .optional(),
            remove: z
                .array(
                    z.object({
                        id: z.string().min(1),
                    })
                )
                .optional(),
        })
        .optional(),                          // users สามารถไม่มีได้
});

/**
 * 🔹 Schema สำหรับการแสดงรายการ Department (GET list)
 */
export const departmentGetSchema = departmentBaseSchema.extend({
    id: z.string().min(1),
});

/**
 * 🔹 Schema สำหรับการแสดง Department แบบละเอียด (GET by ID)
 * รวมถึง users ที่อยู่ในแผนก (ใช้สำหรับ UI เท่านั้น)
 */
const departmentUserDisplaySchema = z.object({
    user_id: z.string().min(1),
    is_hod: z.boolean(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
});

export const departmentGetByIdSchema = departmentGetSchema.extend({
    tb_department_user: z.array(departmentUserDisplaySchema),
});

/**
 * 🔹 Schema สำหรับการแก้ไข Department (PUT/PATCH)
 * โครงสร้างเดียวกับ create แต่ต้องมี id
 */
export const departmentUpdateSchema = departmentCreateSchema.extend({
    id: z.string().min(1),
});

export type DepartmentCreateDto = z.infer<typeof departmentCreateSchema>;     // สำหรับ POST
export type DepartmentUpdateDto = z.infer<typeof departmentUpdateSchema>;     // สำหรับ PUT
export type DepartmentGetListDto = z.infer<typeof departmentGetSchema>;       // สำหรับแสดง list
export type DepartmentGetByIdDto = z.infer<typeof departmentGetByIdSchema>;   // สำหรับแสดงแบบละเอียด
