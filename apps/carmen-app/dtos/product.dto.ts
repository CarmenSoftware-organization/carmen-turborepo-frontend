import { z } from "zod";

const BaseProductSchema = z.object({
    name: z.string(),
    code: z.string(),
    local_name: z.string(),
    description: z.string(),
    inventory_unit_id: z.string().uuid(),
    inventory_unit_name: z.string(),
    product_status_type: z.literal("active"),
});

export const ProductFormSchema = BaseProductSchema.extend({
    product_info: z.object({
        product_item_group_id: z.string().uuid(),
        is_ingredients: z.boolean(),
        price: z.number().min(0),
        tax_type: z.enum(["none", "included", "excluded"]).default("none"),
        tax_rate: z.number().min(0),
        price_deviation_limit: z.number().min(0),
        info: z.object({
            label: z.string(),
            value: z.string(),
        }),
    }),
    locations: z.object({
        add: z.array(
            z.object({
                location_id: z.string().uuid(),
            })
        ),
    }),
});

export type ProductFormDto = z.infer<typeof ProductFormSchema>;

export const ProductSchema = BaseProductSchema.extend({
    id: z.string().uuid(),
    tb_product_info: z.object({
        id: z.string().uuid(),
        product_id: z.string().uuid(),
        product_item_group_id: z.string().uuid(),
        is_ingredients: z.boolean(),
        price: z.string(),
        tax_type: z.enum(["none", "included", "excluded"]).default("none"),
        tax_rate: z.string(),
        price_deviation_limit: z.string(),
        info: z.object({
            label: z.string(),
            value: z.string(),
        }),
    }),
});

export type ProductGetDto = z.infer<typeof ProductSchema>;
