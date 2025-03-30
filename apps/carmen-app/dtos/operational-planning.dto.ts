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
