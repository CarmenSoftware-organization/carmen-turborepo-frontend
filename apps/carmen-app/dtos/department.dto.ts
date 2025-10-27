import { z } from "zod";

// Schema factory for i18n support
export const createDepartmentSchema = (messages: {
    nameRequired: string;
}) => z.object({
    name: z.string().min(1, messages.nameRequired),
    description: z.string().optional(),
    is_active: z.boolean(),
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

// Legacy schemas (deprecated - use createDepartmentSchema instead)
export const departmentBaseSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    is_active: z.boolean(),
});

/**
 * @deprecated Use createDepartmentSchema instead for i18n support
 */
export const departmentCreateSchema = departmentBaseSchema.extend({
    users: z
        .object({
            add: z
                .array(
                    z.object({
                        id: z.string().min(1),
                        isHod: z.boolean(),
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
        .optional(),
});

/**
 * 🔹 Schema สำหรับการแสดงรายการ Department (GET list)
 */
export const departmentGetSchema = departmentBaseSchema.extend({
    id: z.string().uuid(),
});

/**
 * 🔹 Schema สำหรับการแสดง Department แบบละเอียด (GET by ID)
 * รวมถึง users ที่อยู่ในแผนก (ใช้สำหรับ UI เท่านั้น)
 */
const departmentUserDisplaySchema = z.object({
    user_id: z.string().uuid(),
    is_hod: z.boolean(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
});

export const departmentGetByIdSchema = departmentGetSchema.extend({
    tb_department_user: z.array(departmentUserDisplaySchema),
});

/**
 * Schema factory for update with i18n support
 */
export const createDepartmentUpdateSchema = (messages: {
    nameRequired: string;
}) => createDepartmentSchema(messages).extend({
    id: z.string().uuid(),
});

/**
 * @deprecated Use createDepartmentUpdateSchema instead for i18n support
 */
export const departmentUpdateSchema = departmentCreateSchema.extend({
    id: z.string().uuid(),
});

export type DepartmentCreateDto = z.infer<typeof departmentCreateSchema>;     // สำหรับ POST
export type DepartmentUpdateDto = z.infer<typeof departmentUpdateSchema>;     // สำหรับ PUT
export type DepartmentGetListDto = z.infer<typeof departmentGetSchema>;       // สำหรับแสดง list
export type DepartmentGetByIdDto = z.infer<typeof departmentGetByIdSchema>;   // สำหรับแสดงแบบละเอียด
