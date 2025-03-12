import { z } from 'zod';

export interface RecipeCuisine {
	id: string;
	name: string;
	code: string;
	description: string;
	region: string;
	status: 'active' | 'inactive';
	sortOrder: number;
	recipeCount: number;
	activeRecipeCount: number;
	popularDishes: string[];
	keyIngredients: string[];
	lastUpdated: string;
}

export const RecipeCuisineCreateSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, 'name must be at least 1 character'),
	code: z.string().min(1, 'code must be at least 1 character'),
	description: z.string().nullable().optional(),
	region: z.string().nullable().optional(),
	status: z.enum(['active', 'inactive']).default('active'),
	sortOrder: z.number().default(0),
	recipeCount: z.number().default(0),
	activeRecipeCount: z.number().default(0),
	popularDishes: z.array(z.string()).default([]),
	keyIngredients: z.array(z.string()).default([]),
	lastUpdated: z.string().nullable().optional(),
});

export type RecipeCuisineCreateModel = z.infer<
	typeof RecipeCuisineCreateSchema
>;

export class RecipeCuisineCreateDto implements RecipeCuisineCreateModel {
	id?: string;
	name!: string;
	code!: string;
	description?: string | null;
	region?: string | null;
	status!: 'active' | 'inactive';
	sortOrder!: number;
	recipeCount!: number;
	activeRecipeCount!: number;
	popularDishes!: string[];
	keyIngredients!: string[];
}
