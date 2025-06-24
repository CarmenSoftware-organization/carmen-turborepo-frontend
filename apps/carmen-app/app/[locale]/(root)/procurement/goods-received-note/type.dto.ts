import { z } from "zod";
import { VendorGetDto } from "@/dtos/vendor-management";

// Common Types
export type UnitGrnDto = {
    id: string;
    name: string;
};

export type LocationGrnDto = {
    id: string;
    name: string;
};

export type ProductGrnDto = {
    id: string;
    name: string;
    description: string;
};

export type DepartmentGrnDto = {
    id: string;
    name: string;
};

// Item Types
export type GrnItemDto = {
    id: string;
    locations: LocationGrnDto;
    products: ProductGrnDto;
    lot_no: string;
    qty_order: number;
    qty_received: number;
    unit: UnitGrnDto;
    price: number;
    net_amount: number;
    tax_amount: number;
    total_amount: number;
};

// Extra Cost
export type ExtraCostGrnDto = {
    id: string;
    type: string;
    amount: number;
};

// Stock Movement
export type StockMovementGrnDto = {
    id: string;
    location: LocationGrnDto;
    product: ProductGrnDto;
    unit: UnitGrnDto;
    lot_no: string;
    stock_in: number;
    stock_out: number;
    unit_cost: number;
    extra_cost: number;
    total_cost: number;
};

// Journal Entry
export type JournalEntryListGrnDto = {
    id: string;
    name: string;
    amount: number;
    department: DepartmentGrnDto;
    description: string;
    debit: number;
    credit: number;
    base_debit: number;
    base_credit: number;
};

export type JournalEntryGrnDto = {
    id: string;
    type: string;
    code: string;
    transaction_date: string;
    status: string;
    ref_no: string;
    soruce: string;
    description: string;
    lists: JournalEntryListGrnDto[];
};

// Tax Entry
export type TaxCalculationGrnDto = {
    id: string;
    name: string;
    description: string;
    amount: number;
    base_amount: number;
    tax_rate: number;
};

export type TaxEntryGrnDto = {
    id: string;
    tax_invoice_no: string;
    date: string;
    status: string;
    period: string;
    base_amount: number;
    base: string;
    tax_rates: number;
    tax_amount: number;
    tax_cal: TaxCalculationGrnDto[];
    filling_period: string;
    filling_date: string;
    vat_return: string;
    filing_status: string;
};

export interface GrnHeaderDto {
    grn_no: string;
    date: string;
    vendor: string;
    invoice_no: string;
    invoice_date: string;
    description?: string;
    currency: string;
    exchange_rate: number;
    consignment: boolean;
    cash: boolean;
    credit_term?: number;
    due_date?: string;
}

// Zod schemas for validation
export const GrnHeaderSchema = z.object({
    grn_no: z.string().min(1, "GRN number is required"),
    date: z.string().min(1, "Date is required"),
    vendor: z.string().min(1, "Vendor is required"),
    invoice_no: z.string().min(1, "Invoice number is required"),
    invoice_date: z.string().min(1, "Invoice date is required"),
    description: z.string().optional(),
    currency: z.string().min(1, "Currency is required"),
    exchange_rate: z.number().positive("Exchange rate must be positive"),
    consignment: z.boolean().default(false),
    cash: z.boolean().default(false),
    credit_term: z.number().int().nonnegative("Credit term must be a positive number").optional(),
    due_date: z.string().optional(),
});

export const UnitSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Unit name is required"),
});

export const LocationSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Location name is required"),
});

export const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Product name is required"),
    description: z.string(),
});

export const DepartmentSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Department name is required"),
});

export const GrnItemSchema = z.object({
    id: z.string().optional(),
    locations: LocationSchema,
    products: ProductSchema,
    qty_order: z.number().nonnegative("Order quantity must be non-negative"),
    qty_received: z.number().nonnegative("Received quantity must be non-negative"),
    unit: UnitSchema,
    price: z.number().nonnegative("Price must be non-negative"),
    net_amount: z.number().nonnegative("Net amount must be non-negative"),
    tax_amount: z.number().nonnegative("Tax amount must be non-negative"),
    total_amount: z.number().nonnegative("Total amount must be non-negative"),
    foc: z.object({
        unit_id: z.string().optional(),
        unit_name: z.string().min(1, "Foc name is required"),
        qty: z.number().nonnegative("Foc quantity must be non-negative"),
    }),
    delivery_point: z.string().optional(),
    currency: z.string().optional(),
    exchange_rate: z.number().nonnegative("Exchange rate must be non-negative"),
    tax_inclusive: z.boolean().optional(),
    adj_disc_rate: z.number().nonnegative("Adjustment discount rate must be non-negative"),
    adj_tax_rate: z.number().nonnegative("Adjustment tax rate must be non-negative"),
    override_disc_amount: z.number().nonnegative("Override discount amount must be non-negative"),
    override_tax_amount: z.number().nonnegative("Override tax amount must be non-negative"),
    note: z.string().optional(),
});

export const ExtraCostSchema = z.object({
    id: z.string().optional(),
    type: z.string().min(1, "Cost type is required"),
    amount: z.number().nonnegative("Amount must be non-negative"),
});

export const StockMovementSchema = z.object({
    id: z.string().optional(),
    location: LocationSchema,
    product: ProductSchema,
    unit: UnitSchema,
    lot_no: z.string().min(1, "Lot number is required"),
    stock_in: z.number().nonnegative("Stock in must be non-negative"),
    stock_out: z.number().nonnegative("Stock out must be non-negative"),
    unit_cost: z.number().nonnegative("Unit cost must be non-negative"),
    extra_cost: z.number().nonnegative("Extra cost must be non-negative"),
    total_cost: z.number().nonnegative("Total cost must be non-negative"),
});

export const JournalEntryListSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Entry name is required"),
    amount: z.number().nonnegative("Amount must be non-negative"),
    department: DepartmentSchema,
    description: z.string(),
    debit: z.number().nonnegative("Debit must be non-negative"),
    credit: z.number().nonnegative("Credit must be non-negative"),
    base_debit: z.number().nonnegative("Base debit must be non-negative"),
    base_credit: z.number().nonnegative("Base credit must be non-negative"),
});

export const JournalEntrySchema = z.object({
    id: z.string().optional(),
    type: z.string().min(1, "Entry type is required"),
    code: z.string().min(1, "Code is required"),
    transaction_date: z.string().min(1, "Transaction date is required"),
    status: z.string().min(1, "Status is required"),
    ref_no: z.string().min(1, "Reference number is required"),
    soruce: z.string(),
    description: z.string(),
    lists: z.array(JournalEntryListSchema),
});

export const TaxCalculationSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Tax name is required"),
    description: z.string(),
    amount: z.number().nonnegative("Amount must be non-negative"),
    base_amount: z.number().nonnegative("Base amount must be non-negative"),
    tax_rate: z.number().nonnegative("Tax rate must be non-negative"),
});

export const TaxEntrySchema = z.object({
    id: z.string().optional(),
    tax_invoice_no: z.string().min(1, "Tax invoice number is required"),
    date: z.string().min(1, "Date is required"),
    status: z.string().min(1, "Status is required"),
    period: z.string().min(1, "Period is required"),
    base_amount: z.number().nonnegative("Base amount must be non-negative"),
    base: z.string().min(1, "Base is required"),
    tax_rates: z.number().nonnegative("Tax rate must be non-negative"),
    tax_amount: z.number().nonnegative("Tax amount must be non-negative"),
    tax_cal: z.array(TaxCalculationSchema),
    filling_period: z.string().min(1, "Filling period is required"),
    filling_date: z.string().min(1, "Filling date is required"),
    vat_return: z.string().min(1, "VAT return is required"),
    filing_status: z.string().min(1, "Filing status is required"),
});

// Complete GRN Form Schema
export const GrnFormSchema = z.object({
    id: z.string().optional(),
    status: z.string(),
    info: GrnHeaderSchema,
    items: z.array(GrnItemSchema),
    extra_cost: z.array(ExtraCostSchema),
    stock_movement: z.array(StockMovementSchema),
    journal_entries: JournalEntrySchema,
    tax_entries: TaxEntrySchema,
});

export type GrnHeaderFormValues = z.infer<typeof GrnHeaderSchema>;
export type GrnItemFormValues = z.infer<typeof GrnItemSchema>;
export type ExtraCostFormValues = z.infer<typeof ExtraCostSchema>;
export type StockMovementFormValues = z.infer<typeof StockMovementSchema>;
export type JournalEntryFormValues = z.infer<typeof JournalEntrySchema>;
export type TaxEntryFormValues = z.infer<typeof TaxEntrySchema>;
export type GrnFormValues = z.infer<typeof GrnFormSchema>;

export type GrnDto = {
    id: string;
    status: string;
    grn_no: string;
    info: GrnHeaderDto;
    items: GrnItemDto[];
    extra_cost: ExtraCostGrnDto[];
    stock_movement: StockMovementGrnDto[];
    journal_entries: JournalEntryGrnDto;
    tax_entries: TaxEntryGrnDto;
};

export type AttachmentDto = {
    id: string;
    file: string;
};

export type CommentGrn = {
    id: string;
    poster: string;
    message: string;
    date: string;
    attachments?: AttachmentDto[];
};

export const mockCommentGrn: CommentGrn[] = [
    {
        id: "cm-grn-001",
        poster: "Hiroshi Tanaka",
        message: "Vendor confirmed the order details",
        date: "2023-01-15",
        attachments: [
            {
                id: "xosidkc",
                file: "order_confirmation.pdf"
            }
        ]
    },
    {
        id: "cm-grn-002",
        poster: "Samantha Lee",
        message: "Waiting for warehouse confirmation",
        date: "2023-01-15",
        attachments: []
    },
    {
        id: "cm-grn-003",
        poster: "Mohammed Al-Farsi",
        message: "Shipping documents attached",
        date: "2023-01-15",
        attachments: [
            {
                id: "abcd1234",
                file: "shipping_doc.jpeg"
            },
            {
                id: "efgh5678",
                file: "invoice.pdf"
            }
        ]
    },
    {
        id: "cm-grn-004",
        poster: "Nattapong S.",
        message: "Reviewed and approved.",
        date: "2023-01-15",
        attachments: []
    }
];

export const mockOnHand = [
    {
        id: "ko-1",
        location: "Warehouse A",
        quantity: 500,
        units: "pcs",
        par: 600,
        reorderPoint: 400,
        minStock: 300,
        maxStock: 800
    },
    {
        id: "ko-2",
        location: "Store B",
        quantity: 150,
        units: "pcs",
        par: 200,
        reorderPoint: 100,
        minStock: 50,
        maxStock: 250
    },
    {
        id: "ko-3",
        location: "Distribution Center C",
        quantity: 1000,
        units: "pcs",
        par: 1200,
        reorderPoint: 800,
        minStock: 600,
        maxStock: 1500
    }
];

export const mockOnOrder = [
    {
        id: "poc-1",
        poNumber: "PO-001",
        vendor: "Acme Supplies",
        deliveryDate: "2023-07-15",
        remainingQty: 100,
        units: "pcs",
        locations: "Warehouse A, Store B"
    },
    {
        id: "poc-2",
        poNumber: "PO-002",
        vendor: "Global Goods",
        deliveryDate: "2023-07-20",
        remainingQty: 50,
        units: "boxes",
        locations: "Store C"
    },
    {
        id: "poc-3",
        poNumber: "PO-003",
        vendor: "Tech Solutions",
        deliveryDate: "2023-07-25",
        remainingQty: 200,
        units: "units",
        locations: "Warehouse B, Store A, Store D"
    }
];

export const mockCalulateAmount = [
    { id: "cm-1", description: 'Sub Total Amount', total: '0.00', base: '0.00' },
    { id: "cm-2", description: 'Discount Amount', total: '0.00', base: '0.00' },
    { id: "cm-3", description: 'Net Amount', total: '0.00', base: '0.00' },
    { id: "cm-4", description: 'Tax Amount', total: '0.00', base: '0.00' },
    { id: "cm-5", description: 'Total Amount', total: '0.00', base: '0.00' },
];


export interface NewVendorDto {
    id: string;
    no: string;
    name: string;
}

export const mockVendor: NewVendorDto[] = [
    {
        id: "eD6CL0IH30Wy",
        no: "bu-001",
        name: "Vendor 1"
    },
    {
        id: "IMBiiNegXDg6",
        no: "bu-002",
        name: "Vendor 2"
    },
    {
        id: "y0jAWMt3bbm_",
        no: "bu-003",
        name: "Vendor 3"
    },
    {
        id: "G7NW3ZhbPp6h",
        no: "bu-004",
        name: "Vendor 4"
    },
];

export interface NewPoDto {
    id: string;
    no: string;
    name: string;
    pr_ref: string;
    order_date: string;
    items: number;
    status: string;
    total_amount: number;
}

export const mockPo: NewPoDto[] = [
    {
        id: "AsMVgaVT1Ak6",
        no: "po-001",
        name: "Purchase Order 1",
        pr_ref: "PR-001",
        order_date: "2021-01-01",
        items: 3,
        status: "open",
        total_amount: 1000
    },
    {
        id: "pNXMkyOkYqvm",
        no: "po-002",
        name: "Purchase Order 2",
        pr_ref: "PR-002",
        order_date: "2021-01-02",
        items: 2,
        status: "open",
        total_amount: 2000
    },
    {
        id: "jPyUdZ6ciPCi",
        no: "po-003",
        name: "Purchase Order 3",
        pr_ref: "PR-003",
        order_date: "2021-01-03",
        items: 1,
        status: "open",
        total_amount: 3000
    },
];


export interface NewItemDto {
    id: string;
    name: string;
    description: string;
    location: string;
    po_no: string;
    ordered: number;
    received: number;
    remaining_qty: number;
    received_qty: number;
    unit: string;
}

export const mockItem: NewItemDto[] = [
    {
        id: "b-LKYIl1Tl1g",
        name: "Item 1",
        description: "Item 1 Description",
        location: "Location 1",
        po_no: "PO-001",
        ordered: 10,
        received: 2,
        remaining_qty: 10,
        received_qty: 45,
        unit: "pcs",
    },
    {
        id: "tB_R2fX0JdQX",
        name: "Item 2",
        description: "Item 2 Description",
        location: "Location 2",
        po_no: "PO-002",
        ordered: 10,
        received: 2,
        remaining_qty: 10,
        received_qty: 45,
        unit: "pcs",
    },
    {
        id: "925OTeKYj95x",
        name: "Item 3",
        description: "Item 3 Description",
        location: "Location 3",
        po_no: "PO-003",
        ordered: 10,
        received: 2,
        remaining_qty: 10,
        received_qty: 45,
        unit: "pcs",
    }
];

export interface InitGrnDto {
    vendors?: VendorGetDto[];
    po?: NewPoDto[];
    items?: NewItemDto[];
}

