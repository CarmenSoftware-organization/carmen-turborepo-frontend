import { z } from "zod";

// Form Schema Definition
export const productFormSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
    inventory_unit_id: z.string().uuid(),
    product_status_type: z.literal("active"),
    local_name: z.string().min(1, "Local name is required"),
    description: z.string().optional(),
    product_info: z.object({
        id: z.string().uuid().optional(),
        product_item_group_id: z.string().uuid(),
        is_used_in_recipe: z.boolean(),
        is_sold_directly: z.boolean(),
        barcode: z.string(),
        price_deviation_limit: z.number().min(1, "Price deviation limit must be greater than or equal to 1"),
        qty_deviation_limit: z.number().min(1, "Quantity deviation limit must be greater than or equal to 1"),
        is_ingredients: z.boolean(),
        price: z.number().min(0.01, "Price must be greater than or equal to 0.01"),
        tax_type: z.enum(["none", "included", "excluded"]).default("none"),
        tax_rate: z.number().min(0, "Tax rate must be greater than or equal to 0"),
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
            from_unit_qty: z.number().min(1, "From unit quantity must be greater than or equal to 1"),
            to_unit_id: z.string().uuid(),
            to_unit_qty: z.number().min(1, "To unit quantity must be greater than or equal to 1"),
            description: z.string().optional(),
            is_active: z.boolean(),
            is_default: z.boolean()
        })),
        update: z.array(z.object({
            product_order_unit_id: z.string().uuid(),
            from_unit_id: z.string().uuid(),
            from_unit_qty: z.number().min(1, "From unit quantity must be greater than or equal to 1"),
            to_unit_id: z.string().uuid(),
            to_unit_qty: z.number().min(1, "To unit quantity must be greater than or equal to 1"),
            description: z.string().optional(),
            is_active: z.boolean(),
            is_default: z.boolean()
        })).optional(),
        remove: z.array(z.object({
            product_order_unit_id: z.string().uuid()
        })).optional()
    }),
    ingredient_units: z.object({
        add: z.array(z.object({
            from_unit_id: z.string().uuid(),
            from_unit_qty: z.number().min(1, "From unit quantity must be greater than or equal to 1"),
            to_unit_id: z.string().uuid(),
            to_unit_qty: z.number().min(1, "To unit quantity must be greater than or equal to 1"),
            description: z.string().optional(),
            is_active: z.boolean(),
            is_default: z.boolean()
        })),
        update: z.array(z.object({
            product_ingredient_unit_id: z.string().uuid(),
            from_unit_id: z.string().uuid(),
            from_unit_qty: z.number().min(1, "From unit quantity must be greater than or equal to 1"),
            to_unit_id: z.string().uuid(),
            to_unit_qty: z.number().min(1, "To unit quantity must be greater than or equal to 1"),
            description: z.string(),
            is_active: z.boolean(),
            is_default: z.boolean()
        })).optional(),
        remove: z.array(z.object({
            product_ingredient_unit_id: z.string().uuid()
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


export interface ProductInitialValues {
    id?: string;
    name?: string;
    code?: string;
    local_name?: string;
    description?: string;
    inventory_unit?: { id: string };
    product_status_type?: 'active';
    product_info?: {
        id?: string;
        is_ingredients?: boolean;
        price?: number;
        tax_type?: 'none' | 'included' | 'excluded';
        tax_rate?: number;
        price_deviation_limit?: number;
        qty_deviation_limit?: number;
        is_used_in_recipe?: boolean;
        is_sold_directly?: boolean;
        barcode?: string;
        info?: Array<{
            label: string;
            value: string;
            data_type: string;
        }>;
    };
    product_item_group?: { id: string };
    locations?: {
        add: { location_id: string; }[];
        remove?: { id: string; }[];
    } | Array<{ id: string; location_id: string }>;
    order_units?: {
        add: {
            from_unit_id: string;
            from_unit_qty: number;
            to_unit_id: string;
            to_unit_qty: number;
            description?: string;
            is_active: boolean;
            is_default: boolean;
        }[];
        update?: {
            product_order_unit_id: string;
            from_unit_id: string;
            from_unit_qty: number;
            to_unit_id: string;
            to_unit_qty: number;
            description?: string;
            is_active: boolean;
            is_default: boolean;
        }[];
        remove?: { product_order_unit_id: string; }[];
    } | Array<{
        id: string;
        from_unit_id: string;
        from_unit_qty: number;
        to_unit_id: string;
        to_unit_qty: number;
    }>;
    ingredient_units?: {
        add: {
            from_unit_id: string;
            from_unit_qty: number;
            to_unit_id: string;
            to_unit_qty: number;
            description?: string;
            is_active: boolean;
            is_default: boolean;
        }[];
        update?: {
            product_ingredient_unit_id: string;
            from_unit_id: string;
            from_unit_qty: number;
            to_unit_id: string;
            to_unit_qty: number;
            description?: string;
            is_active: boolean;
            is_default: boolean;
        }[];
        remove?: { product_ingredient_unit_id: string; }[];
    } | Array<{
        id: string;
        from_unit_id: string;
        from_unit_qty: number;
        to_unit_id: string;
        to_unit_qty: number;
    }>;
    product_category?: { id: string; name: string };
    product_sub_category?: { id: string; name: string };
}
