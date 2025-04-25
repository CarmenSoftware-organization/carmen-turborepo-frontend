import { z } from "zod";

const BaseProductSchema = z.object({
    name: z.string(),
    code: z.string(),
    local_name: z.string(),
    description: z.string(),
    inventory_unit_name: z.string(),
    inventory_unit: z.object({
        id: z.string(),
        name: z.string(),
    }),
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
    order_units: z.object({
        add: z.array(
            z.object({
                from_unit_id: z.string().uuid(),
                from_unit_qty: z.number().min(0),
                to_unit_id: z.string().uuid(),
                to_unit_qty: z.number().min(0),
                description: z.string(),
                is_active: z.boolean(),
                is_default: z.boolean(),
            })
        ),
    }),
    ingredient_units: z.object({
        add: z.array(
            z.object({
                from_unit_id: z.string().uuid(),
                from_unit_qty: z.number().min(0),
                to_unit_id: z.string().uuid(),
                to_unit_qty: z.number().min(0),
                description: z.string(),
                is_active: z.boolean(),
                is_default: z.boolean(),
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
        price: z.number(),
        tax_type: z.enum(["none", "included", "excluded"]).default("none"),
        tax_rate: z.number(),
        price_deviation_limit: z.number(),
        info: z.object({
            label: z.string(),
            value: z.string(),
        }),
    }),
    locations: z.array(
        z.object({
            id: z.string().uuid(),
        })
    ).optional(),
    order_units: z.array(
        z.object({
            from_unit_id: z.string().uuid(),
            from_unit_qty: z.string(),
            to_unit_id: z.string().uuid(),
            to_unit_qty: z.string(),
            description: z.string(),
            is_active: z.boolean(),
            is_default: z.boolean(),
        })
    ).optional(),
    ingredient_units: z.array(
        z.object({
            from_unit_id: z.string().uuid(),
            from_unit_qty: z.string(),
            to_unit_id: z.string().uuid(),
            to_unit_qty: z.string(),
            description: z.string(),
            is_active: z.boolean(),
            is_default: z.boolean(),
        })
    ).optional(),
    product_category: z.object({
        id: z.string().uuid(),
        name: z.string(),
    }),
    product_sub_category: z.object({
        id: z.string().uuid(),
        name: z.string(),
        product_category_id: z.string().uuid(),
    }),
    product_item_group: z.object({
        id: z.string().uuid(),
        name: z.string(),
        product_sub_category_id: z.string().uuid(),
    }),
});

export type ProductGetDto = z.infer<typeof ProductSchema>;

export interface StockLocationDto {
    code: string;
    name: string;
    type: string;
    onHand: number;
    onOrder: number;
    minimum: number;
    maximum: number;
    reorderPoint: number;
    parLevel: number;
}

type AggregateSettingsDto = {
    minimum: number;
    maximum: number;
    reorderPoint: number;
    parLevel: number;
};

export type InventoryDataDto = {
    totalStock: {
        onHand: number;
        onOrder: number;
    };
    locations: StockLocationDto[];
    aggregateSettings: AggregateSettingsDto;
};

