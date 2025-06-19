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
  created_at: z.string().datetime(),
});

export type GrnFormPayloadDto = z.infer<typeof grnFormSchema>;
export type GoodReceivedNoteDetailItemDto = z.infer<typeof GoodReceivedNoteDetailItemSchema>;
export type ExtraCostDto = z.infer<typeof ExtraCostSchema>;

// {
//   "invoice_no": "PO20250617001",
//   "invoice_date": "2025-03-07T17:00:00.000Z",
//   "description": "string",
//   "doc_status": "draft",
//   "doc_type": "manual",
//   "vendor_id": "2375bcba-81bf-4236-a35c-2798acbd321f",
//   "currency_id": "0540e6ca-8a08-47ef-b104-522834d5026f",
//   "currency_rate": 0,
//   "workflow_id": "ac710822-d422-4e29-8439-87327e960a0e",
//   "is_consignment": true,
//   "is_cash": true,
//   "signature_image_url": "img.carmen.com/img/savasvkd34",
//   "received_by_id": "1bfdb891-58ee-499c-8115-34a964de8122",
//   "received_at": "2025-04-07T17:00:00.000Z",
//   "credit_term_id": "811fb3e4-755f-4767-bde3-c840f147c645",
//   "payment_due_date": "2025-05-07T17:00:00.000Z",
//   "is_active": true,
//   "good_received_note_detail": {
//     "add": [
//       {
//         // "purchase_order_detail_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//         "sequence_no": 0,
//         "location_id": "213f41eb-6916-4275-ac53-afe6b7880dd2",
//         "product_id": "d2b38f5f-1aa6-4e50-acce-a6e0c8b55db5",
//         "order_qty": 0,
//         "order_unit_id": "39948eca-2422-4382-9cc0-32038976c262",
//         "received_qty": 0,
//         "received_unit_id": "39948eca-2422-4382-9cc0-32038976c262",
//         // "is_foc": true,
//         "foc_qty": 0,
//         "foc_unit_id": "39948eca-2422-4382-9cc0-32038976c262",
//         "price": 0,
//         "tax_type_inventory_id": "5f1cded9-e1fe-474a-bbbf-f5dfb26308e9",
//         "tax_type": "none",
//         "tax_rate": 0,
//         "tax_amount": 0,
//         "is_tax_adjustment": true,
//         "total_amount": 0,
//         "delivery_point_id": "086fc8ef-cb01-4a7f-b421-0ec2bdfb10bf",
//         "base_price": 0,
//         "base_qty": 0,
//         "extra_cost": 0,
//         "total_cost": 0,
//         // "is_discount": true,
//         "discount_rate": 0,
//         "discount_amount": 0,
//         // "is_discount_adjustment": true,
//         "expired_date": "2025-05-07T17:00:00.000Z"
//       }
//     ]
//   },
//   "extra_cost": {
//     "name": "string",
//     "allocate_extra_cost_type": "manual",
//     "note": "string",
//     "extra_cost_detail": {
//       "add": [
//         {
//           "extra_cost_type_id": "59628ab6-55d8-41b4-ac8c-0491ac84a538",
//           "amount": 0,
//         //   "is_tax": true,
//           "tax_type_inventory_id": "5f1cded9-e1fe-474a-bbbf-f5dfb26308e9",
//           "tax_type": "none",
//           "tax_rate": 0,
//           "tax_amount": 0,
//           "is_tax_adjustment": true,
//           "note": "string"
//         }
//       ]
//     }
//   }
// }
