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

export type GrnHeaderDto = {
    id?: string;
    grn_no: string;
    date: string;
    vendor: string;
    invoice_no: string;
    invoice_date: string;
    description: string;
    currency: string;
    exchange_rate: number;
    consignment: boolean;
    cash: boolean;
    credit_term: number;
    due_date: string;
}

// Main GRN Type
export type GrnDto = {
    info: GrnHeaderDto;
    items: GrnItemDto[];
    extra_cost: ExtraCostGrnDto[];
    stock_movement: StockMovementGrnDto[];
    journal_entries: JournalEntryGrnDto;
    tax_entries: TaxEntryGrnDto;
};


export const mockGrnDataById: GrnDto = {
    info: {
        id: "jyWYyw",
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