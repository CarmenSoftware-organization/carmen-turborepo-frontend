import { z } from 'zod';

export interface RecipeCategory {
	id: string;
	name: string;
	code: string;
	description: string;
	parentId: string | null;
	level: number;
	status: 'active' | 'inactive';
	sortOrder: number;
	defaultCostSettings: {
		laborCostPercentage: number;
		overheadPercentage: number;
		targetFoodCostPercentage: number;
	};
	defaultMargins: {
		minimumMargin: number;
		targetMargin: number;
	};
	recipeCount: number;
	activeRecipeCount: number;
	averageCost: number;
	averageMargin: number;
	lastUpdated: string;
}

export const RecipeCategoryCreateSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, 'name must be at least 1 character'),
	code: z.string().min(1, 'code must be at least 1 character'),
	description: z.string().nullable().optional(),
	parentId: z.string().uuid().nullable().optional(),
	level: z.number().default(0),
	status: z.enum(['active', 'inactive']).default('active'),
	sortOrder: z.number().default(0),
	defaultCostSettings: z.object({
		laborCostPercentage: z.number().default(0),
		overheadPercentage: z.number().default(0),
		targetFoodCostPercentage: z.number().default(0),
	}),
	defaultMargins: z.object({
		minimumMargin: z.number().default(0),
		targetMargin: z.number().default(0),
	}),
	recipeCount: z.number().default(0),
	activeRecipeCount: z.number().default(0),
	averageCost: z.number().default(0),
	averageMargin: z.number().default(0),
	lastUpdated: z.string().nullable().optional(),
});

export type RecipeCategoryCreateModel = z.infer<
	typeof RecipeCategoryCreateSchema
>;

export class RecipeCategoryCreateDto implements RecipeCategoryCreateModel {
	id?: string;
	name!: string;
	code!: string;
	description?: string | null;
	parentId?: string | null;
	level!: number;
	status!: 'active' | 'inactive';
	sortOrder!: number;
	defaultCostSettings!: {
		laborCostPercentage: number;
		overheadPercentage: number;
		targetFoodCostPercentage: number;
	};
	defaultMargins!: {
		minimumMargin: number;
		targetMargin: number;
	};
	recipeCount!: number;
	activeRecipeCount!: number;
	averageCost!: number;
	averageMargin!: number;
	lastUpdated?: string | null;
}
