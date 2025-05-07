import { z } from "zod";

export type GrnGetDto = {
    id: string;
    name: string;
    ref_no: string;
    doc_status: string;
    doc_type: string;
    vendor_id: string | null;
    vendor_name: string | null;
    currency_id: string;
    currency_name: string;
    currency_rate: string;
    notes: string;
    workflow: string;
    signature_image_url: string;
    received_by_id: string | null;
    received_by_name: string | null;
    created_by_id: string;
    updated_by_id: string | null;
    received_at?: string | null;
    created_at?: string;
    updated_at?: string;
};


export const goodReceivedNoteDetailSchema = z.object({
    location_id: z.string().uuid(),
    product_id: z.string().uuid(),
    order_qty: z.number(),
    order_unit_id: z.string().uuid(),
    received_qty: z.number(),
    received_unit_id: z.string().uuid(),
    is_foc: z.boolean(),
    foc_qty: z.number(),
    foc_unit_id: z.string().uuid(),
    price: z.number(),
    tax_type_inventory_id: z.string().uuid(),
    tax_type: z.string(), // you can narrow to union: z.enum(['none', 'vat', ...]) if fixed values
    tax_rate: z.number(),
    tax_amount: z.number(),
    is_tax_adjustment: z.boolean(),
    total_amount: z.number(),
    delivery_point_id: z.string().uuid(),
    base_price: z.number(),
    base_qty: z.number(),
    extra_cost: z.number(),
    total_cost: z.number(),
    is_discount: z.boolean(),
    discount_rate: z.number(),
    discount_amount: z.number(),
    is_discount_adjustment: z.boolean(),
    lot_number: z.string(),
    info: z.string(),
    comment: z.string()
});

export type GoodReceivedNoteDetailPostDto = z.infer<typeof goodReceivedNoteDetailSchema>;

export const goodReceivedNoteSchema = z.object({
    name: z.string(),
    ref_no: z.string(),
    doc_status: z.string(), // or z.enum(["draft", "submitted", ...]) if known values
    doc_type: z.string(),   // or z.enum(["manual", "auto", ...])
    currency_id: z.string().uuid(),
    currency_rate: z.number(),
    notes: z.string(),
    workflow: z.string(),
    signature_image_url: z.string(),
    good_received_note_detail: goodReceivedNoteDetailSchema
});

export type GoodReceivedNotePostDto = z.infer<typeof goodReceivedNoteSchema>;
