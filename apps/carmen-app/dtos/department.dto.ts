import { z } from "zod";

// Base schemas
const departmentUserSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  middlename: z.string(),
  telephone: z.string(),
});

const userChangeSchema = z.object({
  add: z.array(z.object({ id: z.string().optional() })),
  remove: z.array(z.object({ id: z.string().optional() })),
});

// List item schema (base for getById)
const departmentListItemSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  is_active: z.boolean(),
  info: z.record(z.unknown()),
  dimension: z.array(z.unknown()),
});

// GetById extends ListItem
const departmentGetByIdSchema = departmentListItemSchema.extend({
  department_users: z.array(departmentUserSchema),
  hod_users: z.array(departmentUserSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

// Form schema
export const createDpFormSchema = (messages: {
  nameRequired: string;
  codeRequired: string;
  nameMaxLength?: string;
  codeMaxLength?: string;
  descriptionMaxLength?: string;
}) =>
  z.object({
    name: z
      .string()
      .min(1, messages.nameRequired)
      .max(100, messages.nameMaxLength || "Name must not exceed 100 characters")
      .trim(),
    code: z
      .string()
      .min(1, messages.codeRequired)
      .max(20, messages.codeMaxLength || "Code must not exceed 20 characters")
      .trim()
      .toUpperCase(),
    description: z
      .string()
      .max(500, messages.descriptionMaxLength || "Description must not exceed 500 characters")
      .trim()
      .optional()
      .or(z.literal("")),
    is_active: z.boolean(),
    department_users: userChangeSchema,
    hod_users: userChangeSchema,
  });

// List schema
const departmentListSchema = z.array(departmentListItemSchema);

// Types
export type DepartmentUserDto = z.infer<typeof departmentUserSchema>;
export type DepartmentListItemDto = z.infer<typeof departmentListItemSchema>;
export type DepartmentListDto = z.infer<typeof departmentListSchema>;
export type DepartmentGetByIdDto = z.infer<typeof departmentGetByIdSchema>;
export type DpFormValuesDto = z.infer<ReturnType<typeof createDpFormSchema>>;
export type DepartmentCreateDto = DpFormValuesDto;
export type DepartmentUpdateDto = DpFormValuesDto & { id: string };
export type DepartmentGetListDto = DepartmentListItemDto;
