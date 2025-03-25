import { z } from "zod";

export const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.string(),
    sub_category: z.string(),
    item_group: z.string(),
    status: z.boolean(),
});

export type ProductDto = z.infer<typeof ProductSchema>;
