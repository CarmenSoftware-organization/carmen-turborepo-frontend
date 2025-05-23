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


export interface BaseGrnEntity {
    id: string;
    created_at: string;
    created_by_id: string;
    updated_at: string;
    updated_by_id: string | null;
}


export interface GoodReceivedNoteDetailDto extends BaseGrnEntity {
    inventory_transaction_id: string | null;
    good_received_note_id: string;
    purchase_order_detail_id: string | null;
    sequence_no: number;
    location_id: string;
    location_name: string;
    product_id: string;
    product_name: string;
    product_local_name: string;
    order_qty: string;
    order_unit_id: string;
    order_unit_name: string;
    received_qty: string;
    received_unit_id: string;
    received_unit_name: string;
    is_foc: boolean;
    foc_qty: string;
    foc_unit_id: string;
    foc_unit_name: string;
    price: string;
    tax_type_inventory_id: string;
    tax_type: string;
    tax_rate: string;
    tax_amount: string;
    is_tax_adjustment: boolean;
    total_amount: string;
    delivery_point_id: string;
    delivery_point_name: string;
    base_price: string;
    base_qty: string;
    extra_cost: string;
    total_cost: string;
    is_discount: boolean;
    discount_rate: string;
    discount_amount: string;
    is_discount_adjustment: boolean;
    lot_number: string | null;
    expired_date: string | null;
    note: string;
    info: string;
    dimension: string;
}

export interface ExtraCostDto extends BaseGrnEntity {
    name: string;
    good_received_note_id: string;
    allocate_extracost_type: string;
    note: string | null;
    info: string | null;
}

export interface ExtraCostDetailDto extends BaseGrnEntity {
    extra_cost_id: string;
    extra_cost_type_id: string;
    extra_cost_type_name: string;
    amount: string;
    is_tax: boolean;
    tax_type_inventory_id: string;
    tax_type: string;
    tax_rate: string;
    tax_amount: string;
    is_tax_adjustment: boolean;
    note: string | null;
    info: string | null;
    dimension: string | null;
}


export interface GrnByIdDto extends BaseGrnEntity {
    name: string;
    grn_no: string;
    invoice_no: string | null;
    invoice_date: string | null;
    description: string;
    doc_status: string;
    doc_type: string;
    vendor_id: string;
    vendor_name: string;
    currency_id: string;
    currency_name: string;
    currency_rate: string;
    workflow_id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workflow_obj?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workflow_history?: any;
    current_workflow_status: string;
    is_consignment: boolean;
    is_cash: boolean;
    signature_image_url: string;
    received_by_id: string | null;
    received_by_name: string | null;
    received_at: string | null;
    credit_term_id: string;
    credit_term_name: string;
    credit_term_days: number;
    payment_due_date: string | null;
    is_active: boolean;
    note: string | null;
    info: string | null;
    dimension: string | null;
    good_received_note_detail: GoodReceivedNoteDetailDto[];
    extra_cost: ExtraCostDto[];
    extra_cost_detail: ExtraCostDetailDto[];
}

const DocStatusEnum = z.enum(['draft', 'pending', 'approved', 'rejected']);
const DocTypeEnum = z.enum(['manual', 'auto']);
const TaxTypeEnum = z.enum(['none', 'add', 'include']);
const AllocateExtracostTypeEnum = z.enum(['manual', 'auto']);

export type DocStatusDto = z.infer<typeof DocStatusEnum>;
export type DocTypeDto = z.infer<typeof DocTypeEnum>;
export type TaxTypeDto = z.infer<typeof TaxTypeEnum>;


// Schema for individual good received note detail item
const GoodReceivedNoteDetailItemSchema = z.object({
    purchase_order_detail_id: z.string().uuid().optional().nullable(),
    sequence_no: z.number().min(0),
    location_id: z.string().uuid(),
    product_id: z.string().uuid(),
    order_qty: z.number().min(0, 'Order quantity must be non-negative'),
    order_unit_id: z.string().uuid(),
    received_qty: z.number().min(0, 'Received quantity must be non-negative'),
    received_unit_id: z.string().uuid(),
    is_foc: z.boolean(),
    foc_qty: z.number().min(0, 'FOC quantity must be non-negative'),
    foc_unit_id: z.string().uuid(),
    price: z.number().min(0, 'Price must be non-negative'),
    tax_type_inventory_id: z.string().uuid(),
    tax_type: TaxTypeEnum,
    tax_rate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100'),
    tax_amount: z.number().min(0, 'Tax amount must be non-negative'),
    is_tax_adjustment: z.boolean(),
    total_amount: z.number().min(0, 'Total amount must be non-negative'),
    delivery_point_id: z.string().uuid(),
    base_price: z.number().min(0, 'Base price must be non-negative'),
    base_qty: z.number().min(0, 'Base quantity must be non-negative'),
    extra_cost: z.number().min(0, 'Extra cost must be non-negative'),
    total_cost: z.number().min(0, 'Total cost must be non-negative'),
    is_discount: z.boolean(),
    discount_rate: z.number().min(0).max(100, 'Discount rate must be between 0 and 100'),
    discount_amount: z.number().min(0, 'Discount amount must be non-negative'),
    is_discount_adjustment: z.boolean(),
    expired_date: z.string().datetime().optional().nullable(),
    note: z.string().optional().nullable(),
    info: z.string().optional().nullable(),
    dimension: z.string().optional().nullable()
});

// Schema for good received note detail with update operations
const GoodReceivedNoteDetailUpdateItemSchema = GoodReceivedNoteDetailItemSchema.extend({
    id: z.string().uuid()
});

// Schema for remove operations
const RemoveItemSchema = z.object({
    id: z.string().uuid()
});

// Schema for good received note detail object structure
const GoodReceivedNoteDetailSchema = z.object({
    add: z.array(GoodReceivedNoteDetailItemSchema)
});

const GoodReceivedNoteDetailUpdateSchema = z.object({
    add: z.array(GoodReceivedNoteDetailItemSchema).optional(),
    update: z.array(GoodReceivedNoteDetailUpdateItemSchema).optional(),
    remove: z.array(RemoveItemSchema).optional()
});

// Schema for extra cost detail item
const ExtraCostDetailItemSchema = z.object({
    extra_cost_type_id: z.string().uuid(),
    amount: z.number().min(0, 'Amount must be non-negative'),
    is_tax: z.boolean(),
    tax_type_inventory_id: z.string().uuid(),
    tax_type: TaxTypeEnum,
    tax_rate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100'),
    tax_amount: z.number().min(0, 'Tax amount must be non-negative'),
    is_tax_adjustment: z.boolean(),
    note: z.string().optional().nullable(),
    info: z.string().optional().nullable(),
    dimension: z.string().optional().nullable()
});

const ExtraCostDetailUpdateItemSchema = ExtraCostDetailItemSchema.extend({
    id: z.string().uuid()
});

const ExtraCostDetailSchema = z.object({
    add: z.array(ExtraCostDetailItemSchema)
});

const ExtraCostDetailUpdateSchema = z.object({
    add: z.array(ExtraCostDetailItemSchema).optional(),
    update: z.array(ExtraCostDetailUpdateItemSchema).optional(),
    remove: z.array(RemoveItemSchema).optional()
});

// Schema for extra cost
const ExtraCostSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    allocate_extracost_type: AllocateExtracostTypeEnum,
    note: z.string().optional().nullable(),
    info: z.string().optional().nullable(),
    extra_cost_detail: ExtraCostDetailSchema
});

const ExtraCostUpdateSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, 'Name is required'),
    allocate_extracost_type: AllocateExtracostTypeEnum,
    extra_cost_detail: ExtraCostDetailUpdateSchema
});

// Main create GRN schema
export const CreateGRNSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    grn_no: z.string().min(1, 'GRN number is required').max(100, 'GRN number must be less than 100 characters'),
    invoice_no: z.string().optional().nullable(),
    invoice_date: z.string().datetime().optional().nullable(),
    description: z.string().optional().nullable(),
    doc_status: DocStatusEnum,
    doc_type: DocTypeEnum,
    vendor_id: z.string().uuid(),
    currency_id: z.string().uuid(),
    currency_rate: z.number().min(0.01, 'Currency rate must be greater than 0'),
    workflow_id: z.string().uuid(),
    workflow_object: z.string().optional().nullable(),
    workflow_history: z.string().optional().nullable(),
    current_workflow_status: z.string().optional().nullable(),
    is_consignment: z.boolean(),
    is_cash: z.boolean(),
    signature_image_url: z.string().optional().nullable(),
    received_by_id: z.string().uuid().optional().nullable(),
    received_at: z.string().datetime().optional().nullable(),
    credit_term_id: z.string().uuid(),
    payment_due_date: z.string().datetime().optional().nullable(),
    is_active: z.boolean(),
    note: z.string().optional().nullable(),
    info: z.string().optional().nullable(),
    dimension: z.string().optional().nullable(),
    good_received_note_detail: GoodReceivedNoteDetailSchema,
    extra_cost: ExtraCostSchema
});

// Update GRN schema
export const UpdateGRNSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    grn_no: z.string().min(1, 'GRN number is required').max(100, 'GRN number must be less than 100 characters'),
    invoice_no: z.string().optional().nullable(),
    invoice_date: z.string().datetime().optional().nullable(),
    description: z.string().optional().nullable(),
    doc_status: DocStatusEnum,
    doc_type: DocTypeEnum,
    vendor_id: z.string().uuid(),
    currency_id: z.string().uuid(),
    currency_rate: z.number().min(0.01, 'Currency rate must be greater than 0'),
    workflow_id: z.string().uuid(),
    workflow_object: z.string().optional().nullable(),
    workflow_history: z.string().optional().nullable(),
    current_workflow_status: z.string().optional().nullable(),
    is_consignment: z.boolean(),
    is_cash: z.boolean(),
    signature_image_url: z.string().optional().nullable(),
    received_by_id: z.string().uuid().optional().nullable(),
    received_at: z.string().datetime().optional().nullable(),
    credit_term_id: z.string().uuid(),
    payment_due_date: z.string().datetime().optional().nullable(),
    is_active: z.boolean(),
    note: z.string().optional().nullable(),
    info: z.string().optional().nullable(),
    dimension: z.string().optional().nullable(),
    good_received_note_detail: GoodReceivedNoteDetailUpdateSchema,
    extra_cost: ExtraCostUpdateSchema
});

export type CreateGRNDto = z.infer<typeof CreateGRNSchema>;
export type UpdateGRNDto = z.infer<typeof UpdateGRNSchema>;
export type GoodReceivedNoteDetailRequest = z.infer<typeof GoodReceivedNoteDetailItemSchema>;
export type ExtraCostDetailRequest = z.infer<typeof ExtraCostDetailItemSchema>;

export const validateCreateGRN = (data: unknown) => {
    return CreateGRNSchema.safeParse(data);
};

export const validateUpdateGRN = (data: unknown) => {
    return UpdateGRNSchema.safeParse(data);
};

export const validateCreateGRNStrict = (data: unknown) => {
    return CreateGRNSchema.parse(data);
};

export const validateUpdateGRNStrict = (data: unknown) => {
    return UpdateGRNSchema.parse(data);
};


export const CreateGRNSchemaWithBusinessRules = CreateGRNSchema.refine(
    (data) => {
        // Business rule: If FOC is enabled, FOC quantity should be greater than 0
        const details = data.good_received_note_detail.add;
        for (const detail of details) {
            if (detail.is_foc && detail.foc_qty <= 0) {
                return false;
            }
        }
        return true;
    },
    {
        message: "FOC quantity must be greater than 0 when FOC is enabled",
        path: ["good_received_note_detail", "add"]
    }
).refine(
    (data) => {
        // Business rule: If discount is enabled, discount amount or rate should be greater than 0
        const details = data.good_received_note_detail.add;
        for (const detail of details) {
            if (detail.is_discount &&
                detail.discount_amount <= 0 &&
                detail.discount_rate <= 0) {
                return false;
            }
        }
        return true;
    },
    {
        message: "Discount amount or rate must be greater than 0 when discount is enabled",
        path: ["good_received_note_detail", "add"]
    }
).refine(
    (data) => {
        // Business rule: Total amount should match calculated amount
        const details = data.good_received_note_detail.add;
        for (const detail of details) {
            const subtotal = detail.price * detail.received_qty;
            const afterDiscount = subtotal - detail.discount_amount;
            const withTax = afterDiscount + detail.tax_amount;
            const expectedTotal = withTax + detail.extra_cost;

            // Allow small floating point differences
            if (Math.abs(detail.total_amount - expectedTotal) >= 0.01) {
                return false;
            }
        }
        return true;
    },
    {
        message: "Total amount does not match calculated amount",
        path: ["good_received_note_detail", "add"]
    }
);
