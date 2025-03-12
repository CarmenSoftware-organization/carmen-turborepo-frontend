import { z } from 'zod';

export const ContactTypeCreateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().uuid(),
  description: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type ContactTypeCreateModel = z.infer<typeof ContactTypeCreateSchema>;

export class ContactTypeCreateDto implements ContactTypeCreateModel {
  id?: string;
  name!: string;
  description?: string;
  is_active?: boolean | null;
}

export const ContactTypeUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().uuid().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type ContactTypeUpdateModel = z.infer<typeof ContactTypeUpdateSchema>;

export class ContactTypeUpdateDto implements ContactTypeUpdateModel {
  id!: string;
  name?: string;
  description?: string;
  is_active?: boolean | null;
}
