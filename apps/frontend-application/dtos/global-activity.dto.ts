import { z } from 'zod';

const enumActivityAction = z.enum([
  'read',
  'create',
  'update',
  'delete',
  'login',
  'other',
]);

export const globalActivityCreateSchema = z.object({
	id: z.string().uuid(),
	action: enumActivityAction,
	entity_type: z.string().max(100),
	entity_id: z.string().uuid(),
	actor_id: z.string().uuid(),
	meta_data: z.object({}).nullable(),
	old_data: z.object({}).nullable(),
	new_data: z.object({}).nullable(),
	ip_address: z.string().nullable(),
	user_agent: z.string().nullable(),
	description: z.string(),
});

export type globalActivityCreateModel = z.infer<
	typeof globalActivityCreateSchema
>;

export class GlobalActivityCreateDto implements globalActivityCreateModel {
	id!: string;
	action!: 'read' | 'create' | 'update' | 'delete' | 'login' | 'other';
	entity_type!: string;
	entity_id!: string;
	actor_id!: string;
	meta_data!: Record<string, unknown> | null;
	old_data!: Record<string, unknown> | null;
	new_data!: Record<string, unknown> | null;
	ip_address!: string | null;
	user_agent!: string | null;
	description!: string;
}

export const globalActivityUpdateSchema = z.object({
	id: z.string().uuid(),
	action: enumActivityAction.optional(),
	entity_type: z.string().max(100).optional(),
	entity_id: z.string().uuid().optional(),
	actor_id: z.string().uuid().optional(),
	meta_data: z.object({}).nullable().optional(),
	old_data: z.object({}).nullable().optional(),
	new_data: z.object({}).nullable().optional(),
	ip_address: z.string().nullable().optional(),
	user_agent: z.string().nullable().optional(),
	description: z.string().optional(),
});

export type globalActivityUpdateModel = z.infer<
  typeof globalActivityUpdateSchema
>;

export class GlobalActivityUpdateDto implements globalActivityUpdateModel {
  id!: string;
  action?: 'read' | 'create' | 'update' | 'delete' | 'login' | 'other';
  entity_type?: string;
  entity_id?: string;
  actor_id?: string;
  meta_data?: Record<string, unknown> | null;
  old_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  description?: string;
}

