import { z } from "zod";

export const CuisineTypeSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
    region: z.string(),
    status: z.string(),
    recipe_count: z.number(),
    active_count: z.number(),
    last_active: z.string(),
});

export type CuisineTypeDto = z.infer<typeof CuisineTypeSchema>;

export const CategoryRecipeSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
    status: z.string(),
    recipe_count: z.number(),
    active_count: z.number(),
    last_active: z.string(),
    avg_cost: z.number(),
    avg_margin: z.number(),
    last_update: z.string(),
});

export type CategoryRecipeDto = z.infer<typeof CategoryRecipeSchema>;

export const RecipeSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
    prepTimeMinutes: z.number(),
    cookTimeMinutes: z.number(),
    serving: z.number(),
    difficulty: z.string(),
    cuisine: z.string(),
    caloriesPerServing: z.number(),
    tags: z.array(z.string()),
    userId: z.number(),
    image: z.string(),
    rating: z.number(),
    reviewCount: z.number(),
    mealType: z.array(z.string()),
});

export type RecipeDto = z.infer<typeof RecipeSchema>;

export interface RecipeResponse {
    recipes: RecipeDto[];
    total: number;
    skip: number;
    limit: number;
}
