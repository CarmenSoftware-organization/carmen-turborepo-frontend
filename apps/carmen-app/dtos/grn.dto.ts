import { DOC_TYPE } from "@/constants/enum";
import { z } from "zod";

const infoSchema = z.object({
    test1: z.string(),
    test2: z.string(),
});

const dimensionSchema = z.object({
    test1: z.string(),
    test2: z.string(),
});

const goodReceivedNoteDetailItemSchema = z.object({
    id: z.string().uuid().optional(),
    sequence_no: z.number(),
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
    tax_type: z.string(),
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
    note: z.string(),
    exchange_rate: z.number(),
    info: infoSchema,
    dimension: dimensionSchema,
});

export type GoodReceivedNoteDetailItemDto = z.infer<typeof goodReceivedNoteDetailItemSchema>;

const extraCostDetailItemSchema = z.object({
    extra_cost_type_id: z.string().uuid(),
    amount: z.number(),
    is_tax: z.boolean(),
    tax_type_inventory_id: z.string().uuid(),
    tax_type: z.string(),
    tax_rate: z.number(),
    tax_amount: z.number(),
    is_tax_adjustment: z.boolean(),
    note: z.string(),
    info: infoSchema,
    dimension: dimensionSchema,
});

const extraCostSchema = z.object({
    name: z.string(),
    allocate_extracost_type: z.string(),
    note: z.string(),
    info: infoSchema,
    extra_cost_detail: z.object({
        add: z.array(extraCostDetailItemSchema),
    }),
});

export const baseGrnSchema = z.object({
    name: z.string(),
    grn_no: z.string().optional(),
    description: z.string(),
    doc_status: z.string(),
    doc_type: z.nativeEnum(DOC_TYPE),
    vendor_id: z.string().uuid(),
    currency_id: z.string().uuid(),
    workflow_id: z.string().uuid(),
    workflow_obj: infoSchema,
    workflow_history: infoSchema,
    current_workflow_status: z.string(),
    is_consignment: z.boolean(),
    is_cash: z.boolean(),
    signature_image_url: z.string(),
    credit_term_id: z.string().uuid(),
    is_active: z.boolean(),
    note: z.string(),
    info: infoSchema,
    dimension: dimensionSchema,
    extra_cost: extraCostSchema,
});


// create grn
export const grnPostSchema = baseGrnSchema.extend({
    good_received_note_detail: z.object({
        initData: z.array(goodReceivedNoteDetailItemSchema),
        add: z.array(goodReceivedNoteDetailItemSchema),
        update: z.array(goodReceivedNoteDetailItemSchema),
        delete: z.array(z.string().uuid()),
    }).optional(),
});
export type CreateGRNDto = z.infer<typeof grnPostSchema>;

// get grn by id
export const grnByIdSchema = baseGrnSchema.extend({
    good_received_note_detail: z.array(goodReceivedNoteDetailItemSchema),
});

export type GetGrnByIdDto = z.infer<typeof grnByIdSchema>;

export interface GoodsReceivedNoteListDto {
    id: string;
    name: string;
    grn_no: string;
    description?: string;
    vendor_name: string;
    total_amount: number;
    is_active: boolean;
    created_at: string;
}