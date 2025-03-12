export interface OrderUnitModel {
    id: string; // "order_unit_id ส่งอันนี้"
    product_id: string; // "product_id"
    unit_type: "order_unit" | "recipe_unit"; // จำกัดค่าเป็น "order_unit" หรือ "recipe_unit"
    from_unit_id: string; // "form_unit_id"
    from_unit_name: string; // "EA"
    from_unit_qty: number; // 1
    to_unit_id: string; // "to_unit_id (ต้องเป็น primary_unit)"
    to_unit_name: string; // "BOX"
    to_unit_qty: number; // 1
    description: string; // "some description"
    is_default: boolean; // true
}