import { z } from "zod";

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
    lot_no: z.string().min(1, "Lot number is required"),
    qty_order: z.number().nonnegative("Order quantity must be non-negative"),
    qty_received: z.number().nonnegative("Received quantity must be non-negative"),
    unit: UnitSchema,
    price: z.number().nonnegative("Price must be non-negative"),
    net_amount: z.number().nonnegative("Net amount must be non-negative"),
    tax_amount: z.number().nonnegative("Tax amount must be non-negative"),
    total_amount: z.number().nonnegative("Total amount must be non-negative"),
    po_ref_no: z.string().optional(),
    job_code: z.string().optional(),
    foc: z.boolean().optional(),
    delivery_point: z.string().optional(),
    currency: z.string().optional(),
    exchange_rate: z.number().nonnegative("Exchange rate must be non-negative"),
    tax_inclusive: z.boolean().optional(),
    adj_disc_rate: z.number().nonnegative("Adjustment discount rate must be non-negative"),
    adj_tax_rate: z.number().nonnegative("Adjustment tax rate must be non-negative"),
    override_disc_amount: z.number().nonnegative("Override discount amount must be non-negative"),
    override_tax_amount: z.number().nonnegative("Override tax amount must be non-negative"),
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
    info: GrnHeaderDto;
    items: GrnItemDto[];
    extra_cost: ExtraCostGrnDto[];
    stock_movement: StockMovementGrnDto[];
    journal_entries: JournalEntryGrnDto;
    tax_entries: TaxEntryGrnDto;
};

export const mockGrnDataById: GrnDto = {
    id: "jyWYyw",
    status: "received",
    info: {
        grn_no: "GRN-2023-006",
        date: "2023-01-15",
        vendor: "PTT",
        invoice_no: "INV-20230809-006",
        invoice_date: "2023-08-09",
        description: "Purchase of Office Chairs",
        currency: "USD",
        exchange_rate: 33.5,
        consignment: true,
        cash: false,
        credit_term: 30,
        due_date: "2023-09-08",
    },
    items: [
        {
            id: "dE_ykJ",
            locations: {
                id: "SKpktk",
                name: "Kitchen",
            },
            products: {
                id: "4Vjr4R",
                name: "Office Chair",
                description: "เอาไว้นั่งทำงาน",
            },
            lot_no: "LOT-2023-011",
            qty_order: 10,
            qty_received: 10,
            unit: {
                id: "1",
                name: "pcs",
            },
            price: 1000,
            net_amount: 700,
            tax_amount: 1300,
            total_amount: 2000,
        },
        {
            id: "zRw-xj",
            locations: {
                id: "SKpktk",
                name: "Kitchen",
            },
            products: {
                id: "SdccwB",
                name: "Chef's Knives Set",
                description: "เอาไว้ล้างจมูก",
            },
            lot_no: "LOT-2023-012",
            qty_order: 10,
            qty_received: 10,
            unit: {
                id: "1",
                name: "set",
            },
            price: 10000,
            net_amount: 7000,
            tax_amount: 1300,
            total_amount: 2000,
        },
        {
            id: "XZdZTR",
            locations: {
                id: "5AKOZJ",
                name: "Bar",
            },
            products: {
                id: "4Vjr4R",
                name: "Office Chair",
                description: "เอาไว้นั่งทำงาน",
            },
            lot_no: "LOT-2023-013",
            qty_order: 10,
            qty_received: 10,
            unit: {
                id: "1",
                name: "pcs",
            },
            price: 1000,
            net_amount: 700,
            tax_amount: 1300,
            total_amount: 2000,
        },


    ],
    extra_cost: [
        {
            id: "u0svkY",
            type: "Handling",
            amount: 1000,
        },
        {
            id: "XieLD8",
            type: "Shipping",
            amount: 1000,
        },
    ],
    stock_movement: [
        {
            id: "SvoF7C_w",
            location: {
                id: "SKpktk",
                name: "Kitchen",
            },
            product: {
                id: "4Vjr4R",
                name: "Office Chair",
                description: "เอาไว้นั่งทำงาน",
            },
            unit: {
                id: "6lIzyXkj",
                name: "pcs",
            },
            lot_no: "LOT-2023-011",
            stock_in: 10,
            stock_out: 0,
            unit_cost: 1000,
            extra_cost: 1000,
            total_cost: 2000,
        },
        {
            id: "x9qqU-BD",
            location: {
                id: "SKpktk",
                name: "Kitchen",
            },
            product: {
                id: "4Vjr4R",
                name: "Office Chair",
                description: "เอาไว้นั่งทำงาน",
            },
            unit: {
                id: "6lIzyXkj",
                name: "pcs",
            },
            lot_no: "LOT-2023-011",
            stock_in: 10,
            stock_out: 0,
            unit_cost: 1000,
            extra_cost: 1000,
            total_cost: 2000,
        },
        {
            id: "d3bIDtib",
            location: {
                id: "SKpktk",
                name: "Kitchen",
            },
            product: {
                id: "4Vjr4R",
                name: "Office Chair",
                description: "เอาไว้นั่งทำงาน",
            },
            unit: {
                id: "6lIzyXkj",
                name: "pcs",
            },
            lot_no: "LOT-2023-011",
            stock_in: 10,
            stock_out: 0,
            unit_cost: 1000,
            extra_cost: 1000,
            total_cost: 2000,
        },
    ],
    journal_entries: {
        id: "dHOjIe-F",
        type: "GRN",
        code: "JV-2023-002",
        transaction_date: "2023-01-15",
        status: "posted",
        ref_no: "GRN-2023-006",
        soruce: "GRN",
        description: "Purchase of Office Chairs",
        lists: [
            {
                id: "rLwGy-bf",
                name: "Cash",
                amount: 1000,
                department: {
                    id: "7pqYdc_q",
                    name: "Police Station",
                },
                description: "Cash Description",
                debit: 1000,
                credit: 0,
                base_debit: 33000,
                base_credit: 0,
            },
            {
                id: "xXfVXt8-",
                name: "Cash",
                amount: 1000,
                department: {
                    id: "9YrpcoRR",
                    name: "Ministry of Finance",
                },
                description: "Cash Description",
                debit: 1000,
                credit: 0,
                base_debit: 33000,
                base_credit: 0,
            },
            {
                id: "v3CfC241",
                name: "Cash",
                amount: 1000,
                department: {
                    id: "MXVeUj60",
                    name: "Millitary",
                },
                description: "Cash Description",
                debit: 1000,
                credit: 0,
                base_debit: 33000,
                base_credit: 0,
            },
        ]
    },
    tax_entries: {
        id: "TcARsoyK",
        tax_invoice_no: "TAX-20230809-006",
        date: "2023-08-09",
        status: "verified",
        period: "2023-01",
        base_amount: 100000,
        base: "USD",
        tax_rates: 7,
        tax_amount: 7000,
        tax_cal: [
            {
                id: "uuth565R",
                name: "VAT",
                description: "VAT Description",
                amount: 10000,
                base_amount: 10000,
                tax_rate: 7,

            },
            {
                id: "ShDFSpWg",
                name: "Goods Receipt Value",
                description: "Standard Rate VAT",
                amount: 4534.85,
                base_amount: 360,
                tax_rate: 7,
            }
        ],
        filling_period: "2023-10",
        filling_date: "2023-10-01",
        vat_return: 'Box',
        filing_status: 'Filled',
    }
}