import { z } from 'zod';

export interface Ingredient {
	id: string;
	name: string;
	type: 'product' | 'recipe';
	quantity: number;
	unit: string;
	wastage: number;
	inventoryQty: number;
	inventoryUnit: string;
	costPerUnit: number;
	totalCost: number;
	notes?: string;
}

export interface PreparationStep {
	id: string;
	order: number;
	description: string;
	duration: number | null;
	temperature?: number;
	equipments: string[];
	image: string;
}

export interface Recipe {
	id: string;
	name: string;
	description: string;
	category: string;
	cuisine: string;
	status: 'draft' | 'published';
	image: string;
	yield: number;
	yieldUnit: string;
	prepTime: number;
	cookTime: number;
	totalTime: number;
	difficulty: 'easy' | 'medium' | 'hard';
	costPerPortion: number;
	sellingPrice: number;
	grossMargin: number;
	netPrice: number;
	grossPrice: number;
	totalCost: number;
	carbonFootprint: number;
	carbonFootprintSource?: string;
	hasMedia: boolean;
	deductFromStock: boolean;
	ingredients: Ingredient[];
	steps: PreparationStep[];
	prepNotes: string;
	specialInstructions: string;
	additionalInfo: string;
	allergens: string[];
	tags: string[];
	createdAt: string;
	updatedAt: string;
	createdBy: string;
	updatedBy: string;
	targetFoodCost: number;
	laborCostPercentage: number;
	overheadPercentage: number;
	recommendedPrice: number;
	foodCostPercentage: number;
	grossProfit: number;
	unitOfSale: string;
}

export const IngredientSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(['product', 'recipe']),
	quantity: z.number(),
	unit: z.string(),
	wastage: z.number(),
	inventoryQty: z.number(),
	inventoryUnit: z.string(),
	costPerUnit: z.number(),
	totalCost: z.number(),
});

export const PreparationStepSchema = z.object({
	id: z.string(),
	order: z.number(),
	description: z.string(),
	duration: z.number().nullable(),
	equipments: z.array(z.string()),
	image: z.string(),
});

export const RecipeSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	category: z.string(),
	cuisine: z.string(),
	status: z.enum(['draft', 'published']),
	image: z.string(),
	yield: z.number(),
	yieldUnit: z.string(),
	prepTime: z.number(),
	cookTime: z.number(),
	totalTime: z.number(),
	difficulty: z.enum(['easy', 'medium', 'hard']),
	costPerPortion: z.number(),
	sellingPrice: z.number(),
	grossMargin: z.number(),
	netPrice: z.number(),
	grossPrice: z.number(),
	totalCost: z.number(),
	carbonFootprint: z.number(),
	carbonFootprintSource: z.string().nullable(),
	hasMedia: z.boolean(),
	deductFromStock: z.boolean(),
	ingredients: z.array(IngredientSchema),
	steps: z.array(PreparationStepSchema),
	prepNotes: z.string(),
	specialInstructions: z.string(),
	additionalInfo: z.string(),
	allergens: z.array(z.string()),
	tags: z.array(z.string()),
	createdAt: z.string(),
	updatedAt: z.string(),
	createdBy: z.string(),
	updatedBy: z.string(),
	targetFoodCost: z.number(),
	laborCostPercentage: z.number(),
	overheadPercentage: z.number(),
	recommendedPrice: z.number(),
	foodCostPercentage: z.number(),
	grossProfit: z.number(),
	unitOfSale: z.string(),
});

export type RecipeCreateModel = z.infer<typeof RecipeSchema>;

export class RecipeCreateDto implements RecipeCreateModel {
	id!: string;
	name!: string;
	description!: string;
	category!: string;
	cuisine!: string;
	status!: 'draft' | 'published';
	image!: string;
	yield!: number;
	yieldUnit!: string;
	prepTime!: number;
	cookTime!: number;
	totalTime!: number;
	difficulty!: 'easy' | 'medium' | 'hard';
	costPerPortion!: number;
	sellingPrice!: number;
	grossMargin!: number;
	netPrice!: number;
	grossPrice!: number;
	totalCost!: number;
	carbonFootprint!: number;
	carbonFootprintSource!: string | null;
	hasMedia!: boolean;
	deductFromStock!: boolean;
	ingredients!: Ingredient[];
	steps!: PreparationStep[];
	prepNotes!: string;
	specialInstructions!: string;
	additionalInfo!: string;
	allergens!: string[];
	tags!: string[];
	createdAt!: string;
	updatedAt!: string;
	createdBy!: string;
	updatedBy!: string;
	targetFoodCost!: number;
	laborCostPercentage!: number;
	overheadPercentage!: number;
	recommendedPrice!: number;
	foodCostPercentage!: number;
	grossProfit!: number;
	unitOfSale!: string;
}
