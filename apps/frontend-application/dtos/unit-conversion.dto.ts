import { z } from 'zod';

export enum enum_unit_type {
  order_unit = 'order_unit',
  inventory_unit = 'inventory_unit',
  recipe_unit = 'recipe_unit',
}

export const UnitConversionCreateSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  unit_type: z.enum(Object.values(enum_unit_type) as [string, ...string[]]),
  from_unit_id: z.string().uuid(),
  to_unit_id: z.string().uuid(),
  rate: z.number().default(1).optional(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type UnitConversionCreateModel = z.infer<
  typeof UnitConversionCreateSchema
>;

export class UnitConversionCreateDto implements UnitConversionCreateModel {
  id?: string;
  product_id!: string;
  unit_type!: enum_unit_type;
  from_unit_id!: string;
  to_unit_id!: string;
  rate?: number;
  description?: string | null;
  is_active?: boolean | null;
}

export const UnitConversionUpdateSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid().optional(),
  unit_type: z
    .enum(Object.values(enum_unit_type) as [string, ...string[]])
    .optional(),
  from_unit_id: z.string().uuid().optional(),
  to_unit_id: z.string().uuid().optional(),
  rate: z.number().default(1).optional(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type UnitConversionUpdateModel = z.infer<
  typeof UnitConversionUpdateSchema
>;

export class UnitConversionUpdateDto implements UnitConversionUpdateModel {
	id!: string;
	product_id?: string;
	unit_type?: enum_unit_type;
	from_unit_id?: string;
	to_unit_id?: string;
	rate?: number;
	description?: string | null;
	is_active?: boolean | null;
}