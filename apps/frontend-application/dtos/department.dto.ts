import { z } from 'zod';

export const DepartmentCreateSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, 'name must be at least 1 character'),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
});

export type DepartmentCreateModel = z.infer<typeof DepartmentCreateSchema>;

export class DepartmentCreateDto implements DepartmentCreateModel {
	id?: string;
	name!: string;
	description?: string;
	is_active?: boolean;
}

export const DepartmentUpdateSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'name must be at least 1 character').optional(),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
});

export type DepartmentUpdateModel = z.infer<typeof DepartmentUpdateSchema>;

export class DepartmentUpdateDto implements DepartmentUpdateModel {
	id!: string;
	name?: string;
	description?: string;
	is_active?: boolean;
}

export type DepartmentDto = {
	id: string;
	department_name: string;
	department_code: string;
	description: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
};
