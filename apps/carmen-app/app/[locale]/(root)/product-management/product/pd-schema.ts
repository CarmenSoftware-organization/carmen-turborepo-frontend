import { z } from "zod";

// Form Schema Definition
export const productFormSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
    local_name: z.string().min(1, "Local name is required"),
    description: z.string(),
    inventory_unit_id: z.string().uuid(),
    product_status_type: z.literal("active"),
    product_info: z.object({
        id: z.string().uuid().optional(),
        product_item_group_id: z.string().uuid(),
        is_ingredients: z.boolean(),
        price: z.number().min(0, "Price must be greater than or equal to 0"),
        tax_type: z.enum(["none", "included", "excluded"]).default("none"),
        tax_rate: z.number().min(0, "Tax rate must be greater than or equal to 0"),
        price_deviation_limit: z.number().min(0),
        qty_deviation_limit: z.number().min(0),
        info: z.array(z.object({
            label: z.string(),
            value: z.string(),
            data_type: z.string()
        }))
    }),
    locations: z.object({
        add: z.array(z.object({
            location_id: z.string().uuid()
        })),
        remove: z.array(z.object({
            id: z.string().uuid()
        })).optional()
    }),
    order_units: z.object({
        add: z.array(z.object({
            from_unit_id: z.string().uuid(),
            from_unit_qty: z.number().min(0),
            to_unit_id: z.string().uuid(),
            to_unit_qty: z.number().min(0),
            description: z.string(),
            is_active: z.boolean(),
            is_default: z.boolean()
        })),
        update: z.array(z.object({
            product_order_unit_id: z.string().uuid(),
            from_unit_id: z.string().uuid(),
            from_unit_qty: z.number().min(0),
            to_unit_id: z.string().uuid(),
            to_unit_qty: z.number().min(0),
            description: z.string(),
            is_active: z.boolean(),
            is_default: z.boolean()
        })).optional(),
        remove: z.array(z.object({
            id: z.string().uuid()
        })).optional()
    }),
    ingredient_units: z.object({
        add: z.array(z.object({
            from_unit_id: z.string().uuid(),
            from_unit_qty: z.number().min(0),
            to_unit_id: z.string().uuid(),
            to_unit_qty: z.number().min(0),
            description: z.string(),
            is_active: z.boolean(),
            is_default: z.boolean()
        })),
        update: z.array(z.object({
            product_ingredient_unit_id: z.string().uuid(),
            from_unit_id: z.string().uuid(),
            from_unit_qty: z.number().min(0),
            to_unit_id: z.string().uuid(),
            to_unit_qty: z.number().min(0),
            description: z.string(),
            is_active: z.boolean(),
            is_default: z.boolean()
        })).optional(),
        remove: z.array(z.object({
            id: z.string().uuid()
        })).optional()
    }),
    product_category: z.object({
        id: z.string().uuid(),
        name: z.string()
    }),
    product_sub_category: z.object({
        id: z.string().uuid(),
        name: z.string()
    })
});

// Form type from schema
export type ProductFormValues = z.infer<typeof productFormSchema>;
