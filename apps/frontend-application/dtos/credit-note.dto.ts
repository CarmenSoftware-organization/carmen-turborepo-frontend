import { z } from 'zod';

// Schema for CreditNoteItem
const CreditNoteItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  discountPercentage: z.number(),
  taxPercentage: z.number(),
});

// Schema for CreditNoteAttachment
const CreditNoteAttachmentSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  uploadDate: z.date(),
  uploadedBy: z.string(),
});

// Main CreditNote Schema
export const CreditNoteSchema = z.object({
  id: z.string(),
  refNumber: z.string(),
  description: z.string(),
  vendorId: z.string(),
  vendorName: z.string(),
  createdDate: z.date(),
  docNumber: z.string(),
  docDate: z.date(),
  netAmount: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  currency: z.string(),
  status: z.string(),
  notes: z.string(),
  createdBy: z.string(),
  updatedDate: z.date(),
  updatedBy: z.string(),
  items: z.array(CreditNoteItemSchema),
  attachments: z.array(CreditNoteAttachmentSchema),
});

// Types
export type CreditNoteModel = z.infer<typeof CreditNoteSchema>;
export type CreditNoteItemModel = z.infer<typeof CreditNoteItemSchema>;
export type CreditNoteAttachmentModel = z.infer<typeof CreditNoteAttachmentSchema>;

// DTOs
export class CreditNoteDto implements CreditNoteModel {
  id!: string;
  refNumber!: string;
  description!: string;
  vendorId!: string;
  vendorName!: string;
  createdDate!: Date;
  docNumber!: string;
  docDate!: Date;
  netAmount!: number;
  taxAmount!: number;
  totalAmount!: number;
  currency!: string;
  status!: string;
  notes!: string;
  createdBy!: string;
  updatedDate!: Date;
  updatedBy!: string;
  items!: CreditNoteItemModel[];
  attachments!: CreditNoteAttachmentModel[];
}

export class CreditNoteItemDto implements CreditNoteItemModel {
  id!: string;
  description!: string;
  quantity!: number;
  unitPrice!: number;
  discountPercentage!: number;
  taxPercentage!: number;
}

export class CreditNoteAttachmentDto implements CreditNoteAttachmentModel {
  id!: string;
  fileName!: string;
  fileSize!: number;
  uploadDate!: Date;
  uploadedBy!: string;
}

export const CreditNoteCreateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  is_active: z.boolean().default(true).nullable().optional(),
  inventory_transaction_id: z.string().uuid(),
});

export type CreditNoteCreateModel = z.infer<typeof CreditNoteCreateSchema>;

export class CreditNoteCreateDto implements CreditNoteCreateModel {
  id?: string;
  name!: string;
  description?: string;
  amount!: number;
  is_active?: boolean | null;
  inventory_transaction_id!: string;
}

export const CreditNoteUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().optional(),
  is_active: z.boolean().default(true).nullable().optional(),
  inventory_transaction_id: z.string().uuid().optional(),
});

export type CreditNoteUpdateModel = z.infer<typeof CreditNoteUpdateSchema>;

export class CreditNoteUpdateDto implements CreditNoteUpdateModel {
  id!: string;
  name?: string;
  description?: string;
  amount?: number;
  is_active?: boolean | null;
  inventory_transaction_id?: string;
}
