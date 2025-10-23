import { z } from "zod";

export const unitSchema = z.object({
    name: z.string(),
    description: z.string(),
    is_active: z.boolean(),
});

export const unitWithIdSchema = unitSchema.extend({
    id: z.string(),
});

export const unitWithTimestampsSchema = unitWithIdSchema.extend({
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// For API responses (includes all fields)
export type UnitDto = z.infer<typeof unitWithTimestampsSchema>;

// For creating new units (no id, no timestamps)
export type CreateUnitDto = z.infer<typeof unitSchema>;

// For updating units (includes id and timestamps for version checking)
export type UpdateUnitDto = z.infer<typeof unitWithTimestampsSchema>;


export interface UnitValueItem {
    id: string;
    from_unit_id: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_qty: number;
    description?: string;
    is_active?: boolean;
    is_default?: boolean;
}

export interface UnitData {
    id?: string;
    from_unit_id: string;
    from_unit_name?: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_name?: string;
    to_unit_qty: number;
    description: string;
    is_active: boolean;
    is_default: boolean;
}

export interface UnitFormData {
    description: string;
    is_active: boolean;
    from_unit_id: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_qty: number;
    is_default: boolean;
}

export type UnitUpdate<T extends string> = {
    [K in T]: string;
} & UnitFormData

export type UnitRemove<T extends string> = {
    [K in T]: string;
}

export interface UnitsFormData<TIdField extends string> {
    data?: UnitData[];
    add: UnitFormData[];
    update: UnitUpdate<TIdField>[];
    remove: UnitRemove<TIdField>[];
}

export type OrderUnitInitialValues = {
    order_units?: UnitValueItem[];
};

export type OrderUnitsFormData = UnitsFormData<'product_order_unit_id'>;

export type IngredientUnitInitialValues = {
    ingredient_units?: UnitValueItem[];
};

export type IngredientUnitsFormData = UnitsFormData<'product_ingredient_unit_id'>;


export interface UnitRow extends UnitData {
    isNew: boolean;
    fieldIndex?: number;
    dataIndex?: number;
}
