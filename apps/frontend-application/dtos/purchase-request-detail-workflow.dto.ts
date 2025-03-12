import { z } from 'zod';

export const PurchaseRequestDetailWorkflowCreateSchema = z.object({
  id: z.string().uuid().optional(),
  purchase_request_detail_id: z.string().uuid(),
  is_active: z.boolean().default(true).nullable().optional(),
  created_at: z.date().default(new Date()),
  created_by_id: z.string().uuid(),
});

export type PurchaseRequestDetailWorkflowCreateModel = z.infer<
  typeof PurchaseRequestDetailWorkflowCreateSchema
>;

export class PurchaseRequestDetailWorkflowCreateDto
  implements PurchaseRequestDetailWorkflowCreateModel
{
  id?: string;
  purchase_request_detail_id!: string;
  is_active?: boolean | null;
  created_at!: Date;
  created_by_id!: string;
}

export const PurchaseRequestDetailWorkflowUpdateSchema = z.object({
  id: z.string().uuid(),
  purchase_request_detail_id: z.string().uuid(),
  is_active: z.boolean().default(true).nullable().optional(),
  created_at: z.date().default(new Date()).optional(),
  created_by_id: z.string().uuid().optional(),
});

export type PurchaseRequestDetailWorkflowUpdateModel = z.infer<
  typeof PurchaseRequestDetailWorkflowUpdateSchema
>;

export class PurchaseRequestDetailWorkflowUpdateDto
  implements PurchaseRequestDetailWorkflowUpdateModel
{
  id!: string;
  purchase_request_detail_id!: string;
  is_active?: boolean | null;
  created_at?: Date;
  created_by_id?: string;
}
