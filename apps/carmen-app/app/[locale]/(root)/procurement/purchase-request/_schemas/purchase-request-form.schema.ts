import { z } from "zod";
import {
  EmbeddedDepartmentSchema,
  EmbeddedLocationSchema,
  EmbeddedProductSchema,
  EmbeddedInventoryUnitSchema,
  EmbeddedWorkflowSchema,
  EmbeddedVendorSchema,
  EmbeddedCurrencySchema,
  EmbeddedDiscountSchema,
  EmbeddedTaxSchema,
  RequestedQuantityAndUnitSchema,
  ApproveQuantityAndUnitSchema,
  FocSchema,
  PriceSchema,
  InfoSchema,
  ValidateSchema,
} from "@/dtos/embedded.dto";
import { StageStatus, STAGE_ROLE } from "@/dtos/purchase-request.dto";

export const CreatePurchaseRequestDetailSchema = z
  .object({
    id: z.string().optional(),
    description: z.string().optional().nullable(),
    comment: z.string().optional().nullable(),
    sequence_no: z.number().optional(),
  })
  .merge(EmbeddedProductSchema)
  .merge(EmbeddedInventoryUnitSchema)
  .merge(
    EmbeddedLocationSchema.extend({
      delivery_point_id: ValidateSchema.shape.uuid,
      delivery_date: z.string().datetime(),
    })
  )
  .merge(
    EmbeddedVendorSchema.extend({
      vendor_id: z.string().uuid().nullable().optional(),
    })
  )
  .merge(RequestedQuantityAndUnitSchema)
  .merge(PriceSchema)
  .merge(
    EmbeddedTaxSchema.partial().extend({
      tax_profile_id: z.string().uuid().nullable().optional(),
      tax_profile_name: z.string().nullable().optional(),
    })
  )
  .merge(EmbeddedDiscountSchema)
  .merge(
    EmbeddedCurrencySchema.extend({
      currency_id: z.string().uuid().nullable().optional(),
      exchange_rate_date: z.string().datetime().nullable().optional(),
    })
  )
  .merge(FocSchema.partial())
  .merge(InfoSchema);

export const StageRoleSchema = z.nativeEnum(STAGE_ROLE);

export const UpdatePurchaseRequestDetailSchema = z.object({
  id: z.string().uuid(),
  description: z.string().optional().nullable(),
  comment: z.string().optional().nullable(),
  sequence_no: z.number().optional(),
  // จาก EmbeddedProductSchema
  product_id: ValidateSchema.shape.uuid.optional(),
  // จาก EmbeddedInventoryUnitSchema
  inventory_unit_id: z.string().nullable().optional(),
  // จาก EmbeddedLocationSchema + delivery point
  location_id: ValidateSchema.shape.uuid.optional(),
  delivery_point_id: ValidateSchema.shape.uuid,
  delivery_date: z.string().datetime(),
  // จาก EmbeddedVendorSchema
  vendor_id: z.string().uuid().nullable().optional(),
  // จาก RequestedQuantityAndUnitSchema
  requested_qty: ValidateSchema.shape.quantity.optional(),
  requested_unit_id: ValidateSchema.shape.uuid.optional(),
  requested_unit_conversion_factor: ValidateSchema.shape.price.optional(),
  // จาก ApproveQuantityAndUnitSchema
  approved_qty: ValidateSchema.shape.quantity.optional(),
  approved_unit_id: z.string().uuid().nullable().optional(),
  approved_base_qty: ValidateSchema.shape.quantity.optional(),
  approved_unit_conversion_factor: ValidateSchema.shape.price.optional(),
  // จาก PriceSchema
  total_price: ValidateSchema.shape.price.optional(),
  sub_total_price: z.union([z.number(), z.string()]).nullable().optional(),
  net_amount: ValidateSchema.shape.price.optional(),
  price: ValidateSchema.shape.price.optional(),
  base_sub_total_price: z.union([z.number(), z.string()]).nullable().optional(),
  base_total_price: ValidateSchema.shape.price.optional(),
  base_net_amount: ValidateSchema.shape.price.optional(),
  base_price: z.union([z.number(), z.string()]).nullable().optional(),
  // จาก EmbeddedTaxSchema (partial)
  tax_profile_id: z.string().uuid().nullable().optional(),
  tax_profile_name: z.string().nullable().optional(),
  tax_rate: ValidateSchema.shape.price.optional(),
  tax_amount: ValidateSchema.shape.price.optional(),
  is_tax_adjustment: z.boolean().optional(),
  base_tax_amount: ValidateSchema.shape.price.optional(),
  total_amount: ValidateSchema.shape.price.optional(),
  // จาก EmbeddedDiscountSchema
  discount_rate: ValidateSchema.shape.price.optional(),
  discount_amount: ValidateSchema.shape.price.optional(),
  is_discount_adjustment: z.boolean().optional(),
  base_discount_amount: ValidateSchema.shape.price.optional(),
  // จาก EmbeddedCurrencySchema
  currency_id: z.string().uuid().nullable().optional(),
  exchange_rate: z.number().optional(),
  exchange_rate_date: z.string().datetime().nullable().optional(),
  // จาก InfoSchema
  note: z.string().optional().nullable(),
  info: z.any().optional().nullable(),
  dimension: z.any().optional().nullable(),
  // จาก FocSchema (partial)
  foc_qty: ValidateSchema.shape.quantity.optional(),
  foc_unit_id: z.string().uuid().nullable().optional(),
  foc_unit_name: z.string().nullable().optional(),
  foc_unit_conversion_factor: ValidateSchema.shape.price.optional(),
  // Add stages_status field
  stages_status: z
    .union([z.string(), z.array(z.any()), z.record(z.any())])
    .nullable()
    .optional(),
});

export const CreatePrSchema = z
  .object({
    state_role: StageRoleSchema,
    details: z
      .object({
        pr_date: z.string(),
        requestor_id: z.string().uuid(),
        department_id: z.string().uuid(),
        workflow_id: z.string().uuid(),
        description: z.string().optional().nullable(),
        note: z.string().optional().nullable(),
      })
      .extend({
        purchase_request_detail: z
          .object({
            add: z.array(CreatePurchaseRequestDetailSchema).optional(),
            update: z.array(UpdatePurchaseRequestDetailSchema).optional(),
            remove: z.array(z.object({ id: z.string().uuid() })).optional(),
          })
          .optional(),
      }),
  })
  .superRefine((data, ctx) => {
    // Validate that items in add array have required fields filled
    const addItems = data.details.purchase_request_detail?.add;
    if (addItems && addItems.length > 0) {
      addItems.forEach((item, index) => {
        if (!item.location_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Location is required",
            path: ["details", "purchase_request_detail", "add", index, "location_id"],
          });
        }
        if (!item.product_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Product is required",
            path: ["details", "purchase_request_detail", "add", index, "product_id"],
          });
        }
        if (item.requested_qty === undefined || item.requested_qty === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Quantity is required",
            path: ["details", "purchase_request_detail", "add", index, "requested_qty"],
          });
        } else if (typeof item.requested_qty !== "number" || item.requested_qty < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Quantity must be a valid number and not negative",
            path: ["details", "purchase_request_detail", "add", index, "requested_qty"],
          });
        }
        if (!item.requested_unit_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Unit is required",
            path: ["details", "purchase_request_detail", "add", index, "requested_unit_id"],
          });
        }
      });
    }
  });

export type CreatePrDtoType = z.infer<typeof CreatePrSchema>;

export type StagesStatusValue = string | StageStatus[] | undefined;

export const CreatePurchaseRequestSchema = z
  .object({
    description: z.string().optional().nullable(),
    requestor_id: z.string().uuid().optional(),
    pr_date: z.string(),
  })
  .merge(EmbeddedWorkflowSchema)
  .merge(EmbeddedDepartmentSchema)
  .merge(InfoSchema)
  .extend({
    purchase_request_detail: z
      .object({
        add: z.array(CreatePurchaseRequestDetailSchema).optional(),
      })
      .optional(),
  });

export const UpdatePurchaseRequestSchema = CreatePurchaseRequestSchema.extend({
  doc_version: z.number().optional().readonly(),
  purchase_request_detail: z
    .object({
      add: z.array(CreatePurchaseRequestDetailSchema).optional(),
      update: z.array(UpdatePurchaseRequestDetailSchema).optional(),
      remove: z.array(z.object({ id: z.string().uuid() })).optional(),
    })
    .optional(),
});
