export interface ProductListDto {
  id: string;
  code: string;
  name: string;
  local_name?: string;
  description?: string;
  product_status_type?: string;
  inventory_unit_id: string;
  inventory_unit_name: string;
  product_item_group: {
    id: string;
    name: string;
  };
  product_sub_category: {
    id: string;
    name: string;
  };
  product_category: {
    id: string;
    name: string;
  };
}

export interface ProductFormValues {
  id?: string;
  name: string;
  code: string;
  inventory_unit_id: string;
  product_status_type: "active";
  local_name: string;
  description?: string;
  product_info: {
    id?: string | "";
    product_item_group_id: string;
    is_used_in_recipe: boolean;
    is_sold_directly: boolean;
    barcode?: string;
    price_deviation_limit?: number;
    qty_deviation_limit?: number;
    is_ingredients: boolean;
    price?: number;
    tax_type: "none" | "included" | "excluded";
    tax_rate?: number;
    tax_profile_id: string;
    tax_profile_name: string;
    info: Array<{
      label: string;
      value: string;
      data_type: string;
    }>;
  };
  locations: {
    add: Array<{
      location_id: string;
    }>;
    remove?: Array<{
      id: string;
    }>;
  };
  order_units: {
    data?: Array<{
      id: string | "";
      from_unit_id: string | "";
      from_unit_name?: string;
      from_unit_qty: number;
      to_unit_id: string | "";
      to_unit_name?: string;
      to_unit_qty: number;
      description?: string;
      is_active: boolean;
      is_default: boolean;
    }>;
    add: Array<{
      from_unit_id: string;
      from_unit_qty: number;
      to_unit_id: string;
      to_unit_qty: number;
      description?: string;
      is_active: boolean;
      is_default: boolean;
    }>;
    update?: Array<{
      product_order_unit_id: string;
      from_unit_id: string;
      from_unit_qty: number;
      to_unit_id: string;
      to_unit_qty: number;
      description?: string;
      is_active: boolean;
      is_default: boolean;
    }>;
    remove?: Array<{
      product_order_unit_id: string;
    }>;
  };
  ingredient_units: {
    data?: Array<{
      id: string | "";
      from_unit_id: string | "";
      from_unit_name?: string;
      from_unit_qty: number;
      to_unit_id: string | "";
      to_unit_name?: string;
      to_unit_qty: number;
      description?: string;
      is_active: boolean;
      is_default: boolean;
    }>;
    add: Array<{
      from_unit_id: string | "";
      from_unit_qty: number;
      to_unit_id: string | "";
      to_unit_qty: number;
      description?: string;
      is_active: boolean;
      is_default: boolean;
    }>;
    update?: Array<{
      product_ingredient_unit_id: string;
      from_unit_id: string;
      from_unit_qty: number;
      to_unit_id: string;
      to_unit_qty: number;
      description?: string;
      is_active: boolean;
      is_default: boolean;
    }>;
    remove?: Array<{
      product_ingredient_unit_id: string;
    }>;
  };
  product_category: {
    id: string;
    name: string;
  };
  product_sub_category: {
    id: string;
    name: string;
  };
  product_item_group: {
    id: string;
    name: string;
  };
}

export interface ProductInitialValues {
  id?: string;
  name?: string;
  code?: string;
  local_name?: string;
  description?: string;
  inventory_unit?: { id: string };
  product_status_type?: "active";
  product_info?: {
    id?: string;
    is_ingredients?: boolean;
    price?: number;
    tax_type?: "none" | "included" | "excluded";
    tax_rate?: number;
    tax_profile_id?: string;
    tax_profile_name?: string;
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
  product_item_group?: { id: string; name?: string };
  locations?:
    | {
        add: { location_id: string }[];
        remove?: { id: string }[];
      }
    | Array<{ id: string; location_id: string }>;
  order_units?:
    | {
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
        remove?: { product_order_unit_id: string }[];
      }
    | Array<{
        id: string;
        from_unit_id: string;
        from_unit_name?: string;
        from_unit_qty: number;
        to_unit_id: string;
        to_unit_name?: string;
        to_unit_qty: number;
        description?: string;
        is_active?: boolean;
        is_default?: boolean;
      }>;
  ingredient_units?:
    | {
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
        remove?: { product_ingredient_unit_id: string }[];
      }
    | Array<{
        id: string;
        from_unit_id: string;
        from_unit_name?: string;
        from_unit_qty: number;
        to_unit_id: string;
        to_unit_name?: string;
        to_unit_qty: number;
        description?: string;
        is_active?: boolean;
        is_default?: boolean;
      }>;
  product_category?: { id: string; name: string };
  product_sub_category?: { id: string; name: string };
}

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

export interface ProductIdDto {
  id: string;
  code: string;
  name: string;
  local_name: string;
  description: string;
  product_status_type: string;
  inventory_unit: {
    id: string;
    name: string;
  };
  is_sold_directly: boolean;
  is_used_in_recipe: boolean;
  price_deviation_limit: number;
  qty_deviation_limit: number;
  info: unknown[];
  product_item_group: {
    id: string;
    name: string;
  };
  locations: ProductLocation[];
  order_units: ProductUnit[];
  ingredient_units: ProductUnit[];
  product_sub_category: {
    id: string;
    name: string;
  };
  product_category: {
    id: string;
    name: string;
  };
}

export interface ProductLocation {
  id: string;
  location_id: string;
  location_name: string;
}

export interface ProductUnit {
  id: string;
  from_unit_id: string;
  from_unit_name: string;
  from_unit_qty: number;
  to_unit_id: string;
  to_unit_name: string;
  to_unit_qty: number;
  unit_type: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
}

// Re-export Zod schema for backward compatibility
export { productFormSchema } from "@/app/[locale]/(root)/product-management/product/_schemas/product-form.schema";
