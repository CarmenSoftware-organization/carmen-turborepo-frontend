import { z } from "zod";
import { InfoSchema } from "@/dtos/embedded.dto";

export const CreatePrtDetailSchema = z.object({
  location_id: z.string(),
  location_name: z.string().optional(),
  delivery_point_id: z.string(),
  delivery_point_name: z.string().optional(),
  product_id: z.string(),
  product_name: z.string().optional(),
  inventory_unit_id: z.string().optional(),
  inventory_unit_name: z.string().nullable().optional(),
  requested_qty: z.coerce.number().optional(),
  requested_unit_id: z.string().optional(),
  requested_unit_name: z.string().optional(),
  requested_unit_conversion_factor: z.coerce.number().optional(),
  requested_base_qty: z.coerce.number().optional(),
  foc_qty: z.coerce.number().optional(),
  foc_unit_id: z.string().optional(),
  foc_unit_name: z.string().optional(),
  foc_unit_conversion_factor: z.coerce.number().optional(),
  foc_base_qty: z.coerce.number().optional(),
  currency_id: z.string().optional(),
  exchange_rate: z.coerce.number().optional(),
  exchange_rate_date: z.string().nullable().optional(),
  tax_profile_id: z.string().nullable().optional(),
  tax_rate: z.coerce.number().optional(),
  tax_amount: z.coerce.number().optional(),
  base_tax_amount: z.coerce.number().optional(),
  is_tax_adjustment: z.boolean().optional(),
  discount_rate: z.coerce.number().optional(),
  discount_amount: z.coerce.number().optional(),
  base_discount_amount: z.coerce.number().optional(),
  is_discount_adjustment: z.boolean().optional(),
  description: z.string().optional(),
  comment: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const UpdatePrtDetailSchema = CreatePrtDetailSchema.extend({
  id: z.string(),
});

// Schema สำหรับ detail item ที่จะ delete (มีแค่ id)
export const DeletePrtDetailSchema = z.object({
  id: z.string(),
});

// Schema สำหรับ purchase_request_template_detail ใน form
export const PrtDetailFormSchema = z.object({
  add: z.array(CreatePrtDetailSchema).optional(),
  update: z.array(UpdatePrtDetailSchema).optional(),
  delete: z.array(DeletePrtDetailSchema).optional(),
});

// ===== Form Schemas =====

// Base schema สำหรับ PRT header
const BasePrtSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  workflow_id: z.string().optional(),
  workflow_name: z.string().optional(),
  department_id: z.string().optional(),
  department_name: z.string().optional(),
  is_active: z.boolean().optional(),
  note: z.string().nullable().optional(),
});

// Schema สำหรับ Form Values
export const PrtFormSchema = BasePrtSchema.extend({
  purchase_request_template_detail: PrtDetailFormSchema.optional(),
});

// ===== API Request Schemas =====

// Schema หลักสำหรับสร้าง Purchase Request Template
export const CreatePrtSchema = BasePrtSchema.omit({
  id: true,
  workflow_name: true,
  department_name: true,
})
  .merge(InfoSchema)
  .extend({
    purchase_request_template_detail: z
      .object({
        add: z.array(CreatePrtDetailSchema).optional(),
      })
      .optional(),
  });

// Schema สำหรับ update Purchase Request Template
export const UpdatePrtSchema = BasePrtSchema.omit({
  workflow_name: true,
  department_name: true,
})
  .merge(InfoSchema)
  .extend({
    purchase_request_template_detail: PrtDetailFormSchema.optional(),
  });

// ===== Types =====
export type CreatePrtDetailDto = z.infer<typeof CreatePrtDetailSchema>;
export type UpdatePrtDetailDto = z.infer<typeof UpdatePrtDetailSchema>;
export type DeletePrtDetailDto = z.infer<typeof DeletePrtDetailSchema>;
export type PrtDetailForm = z.infer<typeof PrtDetailFormSchema>;
export type CreatePrtDto = z.infer<typeof CreatePrtSchema>;
export type UpdatePrtDto = z.infer<typeof UpdatePrtSchema>;
export type PrtFormValues = z.infer<typeof PrtFormSchema>;
