import { z } from "zod";

// Base detail for list view
export const StoreRequisitionDetailSchema = z.object({
  requested_qty: z.number(),
  approved_qty: z.number(),
});

// Full detail item for get by id
export const SrDetailItemSchema = StoreRequisitionDetailSchema.extend({
  id: z.string(),
  store_requisition_id: z.string(),
  sequence_no: z.number(),
  product_id: z.string(),
  product_name: z.string(),
  product_local_name: z.string(),
  description: z.string(),
  issued_qty: z.number(),
  last_action: z.string().nullable(),
  approved_message: z.string().nullable(),
  approved_by_id: z.string().nullable(),
  approved_by_name: z.string().nullable(),
  approved_date_at: z.string().nullable(),
  review_message: z.string().nullable(),
  review_by_id: z.string().nullable(),
  review_by_name: z.string().nullable(),
  review_date_at: z.string().nullable(),
  reject_message: z.string().nullable(),
  reject_by_id: z.string().nullable(),
  reject_by_name: z.string().nullable(),
  reject_date_at: z.string().nullable(),
  history: z.array(z.any()),
  stages_status: z.record(z.any()),
  current_stage_status: z.string().nullable(),
  doc_version: z.number(),
  created_at: z.string(),
  created_by_id: z.string(),
  updated_at: z.string(),
  updated_by_id: z.string().nullable(),
  inventory_transaction_id: z.string().nullable(),
  deleted_at: z.string().nullable(),
  deleted_by_id: z.string().nullable(),
});

// Base SR fields (shared between list and detail)
const BaseSrSchema = z.object({
  id: z.string(),
  sr_no: z.string(),
  sr_date: z.string(),
  expected_date: z.string(),
  description: z.string(),
  doc_status: z.string(),
  from_location_name: z.string(),
  to_location_name: z.string(),
  workflow_name: z.string(),
  workflow_current_stage: z.string().nullable(),
  workflow_previous_stage: z.string().nullable(),
  workflow_next_stage: z.string().nullable(),
  last_action: z.string().nullable(),
  requestor_name: z.string(),
  department_name: z.string(),
  created_at: z.string(),
});

// List view schema
export const SrSchema = BaseSrSchema.extend({
  store_requisition_detail: z.array(StoreRequisitionDetailSchema),
});

// Detail view schema (get by id)
export const SrByIdSchema = BaseSrSchema.extend({
  from_location_id: z.string(),
  from_location_code: z.string(),
  to_location_id: z.string(),
  to_location_code: z.string(),
  workflow_id: z.string(),
  workflow_history: z.record(z.any()),
  user_action: z.record(z.any()),
  last_action_at_date: z.string().nullable(),
  last_action_by_id: z.string().nullable(),
  last_action_by_name: z.string().nullable(),
  requestor_id: z.string(),
  department_id: z.string(),
  doc_version: z.number(),
  created_by_id: z.string(),
  updated_at: z.string(),
  updated_by_id: z.string().nullable(),
  role: z.string(),
  store_requisition_detail: z.array(SrDetailItemSchema),
  deleted_at: z.string().nullable(),
});

// Detail item for create/update
export const SrDetailItemCreateSchema = z.object({
  description: z.string(),
  current_stage_status: z.string(),
  product_id: z.string(),
  requested_qty: z.number(),
  doc_version: z.number(),
});

// Detail item for update (includes id)
export const SrDetailItemUpdateSchema = SrDetailItemCreateSchema.extend({
  id: z.string(),
});

// Detail item for delete (only id)
export const SrDetailItemDeleteSchema = z.object({
  id: z.string(),
});

// Store requisition detail CRUD operations
export const SrDetailCrudSchema = z.object({
  add: z.array(SrDetailItemCreateSchema).optional(),
  update: z.array(SrDetailItemUpdateSchema).optional(),
  delete: z.array(SrDetailItemDeleteSchema).optional(),
});

// Create SR schema
export const SrCreateSchema = z.object({
  state_role: z.string(),
  details: z.object({
    doc_version: z.number(),
    sr_date: z.string(),
    expected_date: z.string(),
    description: z.string(),
    requestor_id: z.string(),
    workflow_id: z.string(),
    department_id: z.string(),
    from_location_id: z.string(),
    to_location_id: z.string(),
    store_requisition_detail: SrDetailCrudSchema,
  }),
});

// Update SR schema (partial details)
export const SrUpdateSchema = z.object({
  state_role: z.string(),
  details: z.object({
    sr_date: z.string().optional(),
    expected_date: z.string().optional(),
    description: z.string().optional(),
    requestor_id: z.string().optional(),
    workflow_id: z.string().optional(),
    department_id: z.string().optional(),
    from_location_id: z.string().optional(),
    to_location_id: z.string().optional(),
    store_requisition_detail: SrDetailCrudSchema.optional(),
  }),
});

// Infer types from schemas
export type StoreRequisitionDetail = z.infer<typeof StoreRequisitionDetailSchema>;
export type SrDetailItemDto = z.infer<typeof SrDetailItemSchema>;
export type SrDto = z.infer<typeof SrSchema>;
export type SrByIdDto = z.infer<typeof SrByIdSchema>;
export type SrDetailItemCreate = z.infer<typeof SrDetailItemCreateSchema>;
export type SrDetailItemUpdate = z.infer<typeof SrDetailItemUpdateSchema>;
export type SrDetailItemDelete = z.infer<typeof SrDetailItemDeleteSchema>;
export type SrDetailCrud = z.infer<typeof SrDetailCrudSchema>;
export type SrCreate = z.infer<typeof SrCreateSchema>;
export type SrUpdate = z.infer<typeof SrUpdateSchema>;
