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

