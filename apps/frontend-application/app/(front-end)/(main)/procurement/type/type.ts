import { z } from "zod";

// export const formSchema = z.object({
//     ref: z.string().min(1, "Reference is required"),
// });

export const formSchema = z.object({
    id: z.string().uuid("Invalid ID format"),
    ref: z.string().min(1, "Reference is required"),
    date: z.date().optional(),
    invoiceDate: z.date().optional(),
    invoiceNumber: z.string().optional(),
    taxInvoiceDate: z.date().optional(),
    taxInvoiceNumber: z.string().optional(),
    description: z.string().optional(),
    receiver: z.string().min(1, "Receiver is required"),
    vendorId: z.string().uuid("Invalid Vendor ID format"),
    vendor: z.string().optional(),
    location: z.string().optional(),
    currency: z.string().min(1, "Currency is required"),
    exchangeRate: z.number().min(0, "Exchange rate must be a positive number"),
    baseCurrency: z.string().optional(),
    status: z.enum(["pending", "completed", "canceled"]),
    isConsignment: z.boolean(),
    isCash: z.boolean(),
    cashBook: z.string().optional(),
    items: z.array(z.object({})).nonempty("At least one item is required"),
    selectedItems: z.array(z.string()).optional(),
    stockMovements: z.array(z.object({})).optional(),
    extraCosts: z.array(z.object({})).optional(),
    comments: z.array(z.object({})).optional(),
    attachments: z.array(z.object({})).optional(),
    activityLog: z.array(z.object({})).optional(),
    financialSummary: z.object({}).nullable().optional(),
    baseSubTotalPrice: z.number().min(0, "Base subtotal price must be a positive number"),
    subTotalPrice: z.number().min(0, "Subtotal price must be a positive number"),
    baseNetAmount: z.number().min(0, "Base net amount must be a positive number"),
    netAmount: z.number().min(0, "Net amount must be a positive number"),
    baseDiscAmount: z.number().min(0, "Base discount amount must be a positive number"),
    discountAmount: z.number().min(0, "Discount amount must be a positive number"),
    baseTaxAmount: z.number().min(0, "Base tax amount must be a positive number"),
    taxAmount: z.number().min(0, "Tax amount must be a positive number"),
    baseTotalAmount: z.number().min(0, "Base total amount must be a positive number"),
    totalAmount: z.number().min(0, "Total amount must be a positive number"),
    creditTerms: z.string().optional(),
    dueDate: z.date().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
