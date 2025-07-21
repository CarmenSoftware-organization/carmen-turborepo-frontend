// ✅ ใช้ซ้ำได้ทั้ง Order / Ingredient
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
    from_unit_qty: number;
    to_unit_id: string;
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

// ✅ เฉพาะ Order
export type OrderUnitInitialValues = {
    order_units?: UnitValueItem[];
};

export type OrderUnitsFormData = UnitsFormData<'product_order_unit_id'>;

// ✅ เฉพาะ Ingredient
export type IngredientUnitInitialValues = {
    ingredient_units?: UnitValueItem[];
};

export type IngredientUnitsFormData = UnitsFormData<'product_ingredient_unit_id'>;
