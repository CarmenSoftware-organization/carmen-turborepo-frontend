import { z } from "zod";

// Form Schema Definition
export const productFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  inventory_unit_id: z.string().uuid(),
  product_item_group_id: z.string().uuid(),
  product_status_type: z.literal("active"),
  local_name: z.string().min(1, "Local name is required"),
  description: z.string().optional(),
  product_info: z.object({
    id: z.union([z.string().uuid(), z.literal("")]).optional(),
    is_used_in_recipe: z.boolean(),
    is_sold_directly: z.boolean(),
    barcode: z
      .string()
      .min(6, "Barcode must be at least 6 characters")
      .max(100, "Barcode must be at most 100 characters")
      .optional(),
    price_deviation_limit: z.number().optional(),
    qty_deviation_limit: z.number().optional(),
    is_ingredients: z.boolean(),
    price: z.number().optional(),
    tax_type: z.enum(["none", "included", "excluded"]).default("none"),
    tax_rate: z.number().optional(),
    tax_profile_id: z.string(),
    tax_profile_name: z.string(),
    info: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        data_type: z.string(),
      })
    ),
  }),
  locations: z.object({
    add: z.array(
      z.object({
        location_id: z.string().uuid(),
      })
    ),
    remove: z
      .array(
        z.object({
          id: z.string().uuid(),
        })
      )
      .optional(),
  }),
  order_units: z.object({
    data: z
      .array(
        z.object({
          id: z.union([z.string().uuid(), z.literal("")]),
          from_unit_id: z.union([z.string().uuid(), z.literal("")]),
          from_unit_name: z.string().optional(),
          from_unit_qty: z.number(),
          to_unit_id: z.union([z.string().uuid(), z.literal("")]),
          to_unit_name: z.string().optional(),
          to_unit_qty: z.number(),
          description: z.string().optional(),
          is_active: z.boolean(),
          is_default: z.boolean(),
        })
      )
      .optional(),
    add: z.array(
      z.object({
        from_unit_id: z.string().uuid(),
        from_unit_qty: z.number().min(1, "From unit quantity must be greater than or equal to 1"),
        to_unit_id: z.string().uuid(),
        to_unit_qty: z.number().min(1, "To unit quantity must be greater than or equal to 1"),
        description: z.string().optional(),
        is_active: z.boolean(),
        is_default: z.boolean(),
      })
    ),
    update: z
      .array(
        z.object({
          product_order_unit_id: z.string().uuid(),
          from_unit_id: z.string().uuid(),
          from_unit_qty: z.number().min(1, "From unit quantity must be greater than or equal to 1"),
          to_unit_id: z.string().uuid(),
          to_unit_qty: z.number().min(1, "To unit quantity must be greater than or equal to 1"),
          description: z.string().optional(),
          is_active: z.boolean(),
          is_default: z.boolean(),
        })
      )
      .optional(),
    remove: z
      .array(
        z.object({
          product_order_unit_id: z.string().uuid(),
        })
      )
      .optional(),
  }),
  ingredient_units: z.object({
    data: z
      .array(
        z.object({
          id: z.union([z.string().uuid(), z.literal("")]),
          from_unit_id: z.union([z.string().uuid(), z.literal("")]),
          from_unit_name: z.string().optional(),
          from_unit_qty: z.number(),
          to_unit_id: z.union([z.string().uuid(), z.literal("")]),
          to_unit_name: z.string().optional(),
          to_unit_qty: z.number(),
          description: z.string().optional(),
          is_active: z.boolean(),
          is_default: z.boolean(),
        })
      )
      .optional(),
    add: z.array(
      z.object({
        from_unit_id: z.union([z.string().uuid(), z.literal("")]),
        from_unit_qty: z.number().min(1, "From unit quantity must be greater than or equal to 1"),
        to_unit_id: z.union([z.string().uuid(), z.literal("")]),
        to_unit_qty: z.number().min(1, "To unit quantity must be greater than or equal to 1"),
        description: z.string().optional(),
        is_active: z.boolean(),
        is_default: z.boolean(),
      })
    ),
    update: z
      .array(
        z.object({
          product_ingredient_unit_id: z.string().uuid(),
          from_unit_id: z.string().uuid(),
          from_unit_qty: z.number().min(1, "From unit quantity must be greater than or equal to 1"),
          to_unit_id: z.string().uuid(),
          to_unit_qty: z.number().min(1, "To unit quantity must be greater than or equal to 1"),
          description: z.string().optional(),
          is_active: z.boolean(),
          is_default: z.boolean(),
        })
      )
      .optional(),
    remove: z
      .array(
        z.object({
          product_ingredient_unit_id: z.string().uuid(),
        })
      )
      .optional(),
  }),
  product_category: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
  product_sub_category: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
  product_item_group: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
});

export interface LocationProducsDto {
  id: string;
  product_subcategory_id: string;
  code: string;
  name: string;
  description: string | null;
  price_deviation_limit: number;
  qty_deviation_limit: number;
  is_used_in_recipe: boolean;
  is_sold_directly: boolean;
  is_active: boolean;
  note: string | null;
  info: string | null;
  dimension: string | null;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string | null;
  deleted_at: string | null;
  deleted_by_id: string | null;
  sub_category: {
    id: string;
    code: string;
    name: string;
  };
  category: {
    id: string;
    code: string;
    name: string;
  };
}

export interface LocationData {
  id: string;
  location_id: string;
}

export interface LocationDisplayData extends LocationData {
  isNew: boolean;
  fieldIndex?: number;
}

export interface LocationsFormData {
  data: LocationData[];
  add: { location_id: string }[];
  remove: { id: string }[];
}

export interface StoreLocation {
  id: string;
  name: string;
  location_type: string;
  description: string;
  is_active: boolean;
  delivery_point: {
    id: string;
    name: string;
    is_active: boolean;
  };
}
