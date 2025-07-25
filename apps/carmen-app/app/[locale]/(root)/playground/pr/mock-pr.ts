import { z } from "zod";

// 🟦 Base schema for item
const baseItemSchema = z.object({
    product_id: z.string(),
    products: z.string(),
    quantity: z.number(),
    unit: z.string(),
});

// 🟦 Extend for each operation
const itemIdSchema = z.object({ id: z.string() });

export const createItemSchema = baseItemSchema.extend({
    id: z.string(),
});
export const updateItemSchema = baseItemSchema.merge(itemIdSchema);
export const deleteItemSchema = itemIdSchema;

// Fields that are editable in the form
const prEditableFieldsSchema = z.object({
    id: z.string().optional(),
    no: z.string().min(1, "PR No. is required"),
    items: z.object({
        add: z.array(createItemSchema).optional(),
        update: z.array(updateItemSchema).optional(),
        remove: z.array(z.object({ id: z.string() })).optional(),
    }),
});

// Schema for creating a new PR. No 'id' is present.
export const prSchemaCreateFormValue = prEditableFieldsSchema;

// Schema for updating an existing PR. 'id' is required.
export const prSchemaUpdateFormValue = prEditableFieldsSchema.extend({
    id: z.string().min(1, "ID is required for updates"),
});


export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type DeleteItemInput = z.infer<typeof deleteItemSchema>;

export type PrCreateFormValue = z.infer<typeof prSchemaCreateFormValue>;
export type PrUpdateFormValue = z.infer<typeof prSchemaUpdateFormValue>;

export type PrFormValue = PrCreateFormValue | PrUpdateFormValue;

// DTO and mock data
export interface ItemDetail {
    id: string;
    product_id: string;
    products: string;
    quantity: number;
    unit: string;
}

export interface PurchaseRequest {
    id: string;
    no: string;
    items: ItemDetail[];
}

export interface Product {
    id: string;
    name: string;
    inventory_unit: {
        id: string;
        name: string;
    };
}

export const mockProducts: Product[] = [
    { id: "prod_1", name: "Apple", inventory_unit: { id: "unit_1", name: "kg" } },
    { id: "prod_2", name: "Banana", inventory_unit: { id: "unit_2", name: "pcs" } },
    { id: "prod_3", name: "Orange", inventory_unit: { id: "unit_3", name: "kg" } },
    { id: "prod_4", name: "Grapes", inventory_unit: { id: "unit_4", name: "kg" } },
];

export const mockPrDto: PurchaseRequest = {
    id: "id-1",
    no: "PR001",
    items: [
        {
            id: "item-1",
            product_id: "prod_1",
            products: "Apple",
            quantity: 10,
            unit: "kg",
        },
        {
            id: "item-2",
            product_id: "prod_2",
            products: "Banana",
            quantity: 5,
            unit: "pcs",
        },
    ],
};
