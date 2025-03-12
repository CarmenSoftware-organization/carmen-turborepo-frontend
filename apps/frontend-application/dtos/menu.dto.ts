import { z } from 'zod';

export const MenuCreateSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, 'name must be at least 1 character')
    .max(5, 'name must be at most 5 characters'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  is_visible: z.boolean().default(true),
  is_lock: z.boolean().default(true),
});

export type MenuCreateModel = z.infer<typeof MenuCreateSchema>;

export class MenuCreateDto implements MenuCreateModel {
  id!: string;
  name!: string;
  description?: string;
  is_active!: boolean;
  is_visible!: boolean;
  is_lock!: boolean;
}

export const MenuUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(1, 'name must be at least 1 character')
    .max(5, 'name must be at most 5 characters')
    .optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true).optional(),
  is_visible: z.boolean().default(true).optional(),
  is_lock: z.boolean().default(true).optional(),
});

export type MenuUpdateModel = z.infer<typeof MenuUpdateSchema>;

export class MenuUpdateDto implements MenuUpdateModel {
  id?: string;
  name?: string;
  description?: string;
  is_active?: boolean;
  is_visible?: boolean;
  is_lock?: boolean;
}
