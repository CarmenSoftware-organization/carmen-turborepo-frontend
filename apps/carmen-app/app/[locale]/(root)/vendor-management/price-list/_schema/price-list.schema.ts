import { z } from "zod";

const dateRangeSchema = z.object({
  from: z.string().min(1, "กรุณาเลือกวันที่เริ่มต้น"),
  to: z.string().min(1, "กรุณาเลือกวันที่สิ้นสุด"),
});

export const priceListDetailItemSchema = z.object({
  dbId: z.string().optional(), // id จาก database (existing item)
  sequence_no: z.number().optional(),
  product_id: z.string().min(1, "กรุณาเลือกสินค้า"),
  product_name: z.string().optional(), // สำหรับ display
  product_code: z.string().optional(), // สำหรับ display
  price: z.number().min(0, "ราคาไม่สามารถติดลบได้"),
  price_without_tax: z.number().min(0, "ราคาไม่สามารถติดลบได้"),
  unit_id: z.string().optional(),
  unit_name: z.string().optional(), // สำหรับ display
  tax_profile_id: z.string().optional(),
  tax_profile_name: z.string().optional(), // สำหรับ display
  tax_rate: z.number().min(0, "อัตราภาษีไม่สามารถติดลบได้"),
  tax_amt: z.number().min(0, "จำนวนเงินภาษีไม่สามารถติดลบได้"),
  lead_time_days: z.number().min(0, "Lead time ต้องมากกว่าหรือเท่ากับ 0"),
  moq_qty: z.number().min(0, "MOQ ต้องมากกว่าหรือเท่ากับ 0").optional(),
  _action: z.enum(["add", "update", "remove", "none"]).optional(), // track action
});

export const priceListSchema = z.object({
  no: z.string().optional(),
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  vendorId: z.string().min(1, "กรุณาเลือกผู้จัดจำหน่าย"),
  rfpId: z.string().optional(),
  description: z.string().optional(),
  note: z.string().optional(),
  status: z.enum(["active", "draft", "submit", "inactive"]),
  currencyId: z.string().min(1, "กรุณาเลือกสกุลเงิน"),
  effectivePeriod: dateRangeSchema,
  pricelist_detail: z.array(priceListDetailItemSchema).optional(),
});

export type PriceListDetailItem = z.infer<typeof priceListDetailItemSchema>;
export type PriceListFormData = z.infer<typeof priceListSchema>;
