import { z } from 'zod';

export const PurchaseRequestCreateSchema = z.object({
  id: z.string().uuid().optional(),
  reference_name: z.string().min(1, 'reference_name is required'),
  purchase_request_date: z.date(),
  purchase_request_type_id: z.string().uuid(),
  requestor_id: z.string().uuid(),
  department_id: z.string().uuid(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type PurchaseRequestCreateModel = z.infer<
  typeof PurchaseRequestCreateSchema
>;

export class PurchaseRequestCreateDto implements PurchaseRequestCreateModel {
  id?: string;
  reference_name!: string;
  purchase_request_date!: Date;
  purchase_request_type_id!: string;
  requestor_id!: string;
  department_id!: string;
  is_active?: boolean | null;
}

export const PurchaseRequestUpdateSchema = z.object({
  id: z.string().uuid(),
  reference_name: z.string().min(1, 'reference_name is required'),
  purchase_request_date: z.date(),
  purchase_request_type_id: z.string().uuid(),
  requestor_id: z.string().uuid(),
  department_id: z.string().uuid(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type PurchaseRequestUpdateModel = z.infer<
  typeof PurchaseRequestUpdateSchema
>;

export class PurchaseRequestUpdateDto implements PurchaseRequestUpdateModel {
  id!: string;
  reference_name!: string;
  purchase_request_date!: Date;
  purchase_request_type_id!: string;
  requestor_id!: string;
  department_id!: string;
  is_active?: boolean | null;
}

export const PurchaseRequestDetailCreateSchema = z.object({
  id: z.string().uuid().optional(),
  purchase_request_id: z.string().uuid(),
  product_item_group_id: z.string().uuid(),
  quantity: z.number().min(1, 'quantity must be at least 1'),
  unit_price: z.number().min(0, 'unit_price must be at least 0'),
  total_price: z.number().min(0, 'total_price must be at least 0'),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type PurchaseRequestDetailCreateModel = z.infer<
  typeof PurchaseRequestDetailCreateSchema
>;

export class PurchaseRequestDetailCreateDto
  implements PurchaseRequestDetailCreateModel {
  id?: string;
  purchase_request_id!: string;
  product_item_group_id!: string;
  quantity!: number;
  unit_price!: number;
  total_price!: number;
  is_active?: boolean | null;
}

export const PurchaseRequestDetailUpdateSchema = z.object({
  id: z.string().uuid(),
  purchase_request_id: z.string().uuid(),
  product_item_group_id: z.string().uuid(),
  quantity: z.number().min(1, 'quantity must be at least 1').optional(),
  unit_price: z.number().min(0, 'unit_price must be at least 0').optional(),
  total_price: z.number().min(0, 'total_price must be at least 0').optional(),
  is_active: z.boolean().default(true).nullable().optional(),
});

export type PurchaseRequestDetailUpdateModel = z.infer<
  typeof PurchaseRequestDetailUpdateSchema
>;

export class PurchaseRequestDetailUpdateDto
  implements PurchaseRequestDetailUpdateModel {
  id!: string;
  purchase_request_id!: string;
  product_item_group_id!: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  is_active?: boolean | null;
}


export const BudgetSchema = z.object({
  id: z.string().uuid().optional(),
  location: z.string(),
  category: z.string(),
  totalBudget: z.number(),
  softCommitmentDeptHead: z.number(),
  softCommitmentPO: z.number(),
  hardCommitment: z.number(),
  availableBudget: z.number(),
  currentPRAmount: z.number(),
});

export type BudgetModel = z.infer<typeof BudgetSchema>;

const StatusEnum = z.enum(["Approved", "Pending", "Rejected", "In Review", "On Hold"]);

export const workFlowSchema = z.object({
  id: z.string().uuid().optional(),
  stage: z.string(),
  approver: z.string(),
  status: StatusEnum,
  date: z.string().nullable(),
  comments: z.string().nullable(),
});

export type WorkFlowModel = z.infer<typeof workFlowSchema>;
