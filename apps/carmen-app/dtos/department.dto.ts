import { z } from "zod";
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

export const departmentBaseSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    is_active: z.boolean(),
});

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

export const departmentGetSchema = departmentBaseSchema.extend({
    id: z.string().uuid(),
});

const departmentUserDisplaySchema = z.object({
    user_id: z.string().uuid(),
    is_hod: z.boolean(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
});

export const departmentGetByIdSchema = departmentGetSchema.extend({
    tb_department_user: z.array(departmentUserDisplaySchema),
});


export const createDepartmentUpdateSchema = (messages: {
    nameRequired: string;
}) => createDepartmentSchema(messages).extend({
    id: z.string().uuid(),
});


export const departmentUpdateSchema = departmentCreateSchema.extend({
    id: z.string().uuid(),
});

export type DepartmentCreateDto = z.infer<typeof departmentCreateSchema>;     // สำหรับ POST
export type DepartmentUpdateDto = z.infer<typeof departmentUpdateSchema>;     // สำหรับ PUT
export type DepartmentGetListDto = z.infer<typeof departmentGetSchema>;       // สำหรับแสดง list
export type DepartmentGetByIdDto = z.infer<typeof departmentGetByIdSchema>;   // สำหรับแสดงแบบละเอียด
