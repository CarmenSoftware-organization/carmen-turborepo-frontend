import { z } from "zod";

export const GoodReceivedNoteDetailItemSchema = z.object({
  sequence_no: z.number(),
  location_id: z.string().uuid(),
  product_id: z.string().uuid(),
  order_qty: z.number(),
  order_unit_id: z.string().uuid(),
  received_qty: z.number(),
  received_unit_id: z.string().uuid(),
  foc_qty: z.number(),
  foc_unit_id: z.string().uuid(),
  price: z.number(),
  tax_type_inventory_id: z.string().uuid(),
  tax_type: z.enum(["none", "included", "excluded"]),
  tax_rate: z.number(),
  tax_amount: z.number(),
  is_tax_adjustment: z.boolean(),
  total_amount: z.number(),
  delivery_point_id: z.string().uuid(),
  base_price: z.number(),
  base_qty: z.number(),
  extra_cost: z.number(),
  total_cost: z.number(),
  discount_rate: z.number(),
  discount_amount: z.number(),
  is_discount_adjustment: z.boolean(),
  expired_date: z.string().datetime(),
  note: z.string(),
  info: z.string(),
  dimension: z.string(),
});

export const ExtraCostDetailItemSchema = z.object({
  extra_cost_type_id: z.string().uuid(),
  amount: z.number(),
  tax_type_inventory_id: z.string().uuid(),
  tax_type: z.enum(["none", "included", "excluded"]),
  tax_rate: z.number(),
  tax_amount: z.number(),
  is_tax_adjustment: z.boolean(),
  note: z.string(),
  info: z.string(),
  dimension: z.string(),
});

export const ExtraCostSchema = z.object({
    name: z.string(),
    allocate_extra_cost_type: z.enum(['manual', 'auto']),
    note: z.string(),
    info: z.string(),
    extra_cost_detail: z.object({
      add: z.array(ExtraCostDetailItemSchema)
    })
  });

export const grnFormSchema = z.object({
  name: z.string(),
  grn_no: z.string(),
  invoice_no: z.string(),
  invoice_date: z.string().datetime(),
  description: z.string(),
  doc_status: z.enum(["draft", "approved", "rejected"]).default("draft"), // ปรับตาม enum จริง
  doc_type: z.enum(["manual", "auto"]).default("manual"), // ปรับตาม enum จริง
  vendor_id: z.string().uuid(),
  currency_id: z.string().uuid(),
  currency_rate: z.number(),
  workflow_id: z.string().uuid(),
  workflow_object: z.string(),
  workflow_history: z.string(),
  current_workflow_status: z.string(),
  is_consignment: z.boolean(),
  is_cash: z.boolean(),
  signature_image_url: z.string(),
  received_by_id: z.string().uuid(),
  received_at: z.string().datetime(),
  credit_term_id: z.string().uuid(),
  payment_due_date: z.string().datetime(),
  is_active: z.boolean(),
  note: z.string(),
  info: z.string(),
  dimension: z.string(),
  good_received_note_detail: z.array(GoodReceivedNoteDetailItemSchema),
  extra_cost: z.array(ExtraCostSchema),
});

export type GrnFormPayloadDto = z.infer<typeof grnFormSchema>;
export type GoodReceivedNoteDetailItemDto = z.infer<typeof GoodReceivedNoteDetailItemSchema>;
export type ExtraCostDto = z.infer<typeof ExtraCostSchema>;

// export const grnPayload: GrnPayload = {
//     name: "GRN Example",
//     grn_no: "GRN-0001",
//     invoice_no: "INV-0001",
//     invoice_date: "2025-03-07T17:00:00.000Z",
//     description: "Goods received from vendor",
//     doc_status: "draft",
//     doc_type: "manual",
//     vendor_id: "01e6f7f8-ddea-496c-b7f5-952d20b82602",
//     currency_id: "b2dd72fe-0174-40b2-aaf7-4a0534a2b993",
//     currency_rate: 1,
//     workflow_id: "ac710822-d422-4e29-8439-87327e960a0e",
//     workflow_object: "workflow-example",
//     workflow_history: "initial",
//     current_workflow_status: "pending",
//     is_consignment: true,
//     is_cash: false,
//     signature_image_url: "https://example.com/signature.png",
//     received_by_id: "1bfdb891-58ee-499c-8115-34a964de8122",
//     received_at: "2025-04-07T17:00:00.000Z",
//     credit_term_id: "16927608-c55b-4295-8a7a-b80e65746c92",
//     payment_due_date: "2025-05-07T17:00:00.000Z",
//     is_active: true,
//     note: "Received in good condition",
//     info: "internal note",
//     dimension: "LxWxH",
//     good_received_note_detail: {
//       add: [
//         {
//           sequence_no: 1,
//           location_id: "4eb21a50-5f60-4851-ae05-1b59a8c11631",
//           product_id: "e71a72d8-61a9-4595-b163-18b694cdec8b",
//           order_qty: 100,
//           order_unit_id: "dd8c24fa-ee99-465c-a146-a1888b26b73b",
//           received_qty: 100,
//           received_unit_id: "dd8c24fa-ee99-465c-a146-a1888b26b73b",
//           foc_qty: 0,
//           foc_unit_id: "dd8c24fa-ee99-465c-a146-a1888b26b73b",
//           price: 50,
//           tax_type_inventory_id: "719fc7d2-d5bc-4842-a7d0-35ee21dc1dad",
//           tax_type: "none",
//           tax_rate: 0,
//           tax_amount: 0,
//           is_tax_adjustment: true,
//           total_amount: 5000,
//           delivery_point_id: "7633b8d4-8e7d-4fa2-a5f4-c62f6bdb0e50",
//           base_price: 50,
//           base_qty: 100,
//           extra_cost: 0,
//           total_cost: 5000,
//           discount_rate: 0,
//           discount_amount: 0,
//           is_discount_adjustment: false,
//           expired_date: "2025-05-07T17:00:00.000Z",
//           note: "No issues",
//           info: "Batch 01",
//           dimension: "10x20x30"
//         }
//       ]
//     },
//     extra_cost: {
//       name: "Shipping",
//       allocate_extra_cost_type: "manual",
//       note: "Shipping cost from vendor",
//       info: "Shipping via DHL",
//       extra_cost_detail: {
//         add: [
//           {
//             extra_cost_type_id: "3e840308-4379-4c97-b5dd-1f4454ec8653",
//             amount: 200,
//             tax_type_inventory_id: "719fc7d2-d5bc-4842-a7d0-35ee21dc1dad",
//             tax_type: "none",
//             tax_rate: 0,
//             tax_amount: 0,
//             is_tax_adjustment: true,
//             note: "No tax applied",
//             info: "Shipping zone 3",
//             dimension: "flat"
//           }
//         ]
//       }
//     }
//   };
