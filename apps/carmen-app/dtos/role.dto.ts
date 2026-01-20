import { z } from "zod";
import { ACTION_PERMISSION } from "./permission.dto";

// Schema for GET response (role by id)
const RolePermissionSchema = z.object({
  permission_id: z.string(),
  resource: z.string(),
  action: z.nativeEnum(ACTION_PERMISSION),
  description: z.string().optional(),
});

// Schema for POST/PATCH payload permissions
const RolePermissionPayloadSchema = z.object({
  add: z.array(z.string()).optional(),
  remove: z.array(z.string()).optional(),
});

export const RoleSchema = z.object({
  id: z.string(),
  business_unit_id: z.string(),
  name: z.string().optional(),
  application_role_name: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  permissions: z.array(RolePermissionSchema).optional(),
});

export type RolePermissionDto = z.infer<typeof RolePermissionSchema>;
export type RolePermissionPayloadDto = z.infer<typeof RolePermissionPayloadSchema>;
export type RoleDto = z.infer<typeof RoleSchema>;

export const createRoleCreateSchema = (messages: { nameRequired: string }) =>
  z.object({
    application_role_name: z.string().min(1, messages.nameRequired),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
    permissions: RolePermissionPayloadSchema.optional(),
  });

export type RoleCreateDto = z.infer<ReturnType<typeof createRoleCreateSchema>>;

export const createRoleUpdateSchema = (messages: { nameRequired: string }) =>
  z.object({
    id: z.string(),
    application_role_name: z.string().min(1, messages.nameRequired),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
    permissions: RolePermissionPayloadSchema.optional(),
  });

export type RoleUpdateDto = z.infer<ReturnType<typeof createRoleUpdateSchema>>;
