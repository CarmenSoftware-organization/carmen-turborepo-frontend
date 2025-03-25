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
export interface ProductDetailDto {
    id: string;
    code: string;
    name: string;
    status: boolean;
    description: string;
    local_description: string;
    category: string;
    sub_category: string;
    item_group: string;
    unit: string;
    usage_ingredient: boolean;
    attributes: {
        name: string;
        value: string;
    }[];
    price_info: {
        name: string;
        value: string;
    }[];
    order_unit: {
        name: string;
        description: string;
        conversion_factor: number;
        default: boolean;
    }[];
    ingredients_unit: {
        unit: string;
        description: string;
        conversion_factor: number;
        default: boolean;
    }[];
    stock_count: {
        unit: string;
        description: string;
        conversion_factor: number;
        default: boolean;
    }[];
}
