import { z } from "zod";

// 🧱 base schema ที่มีฟิลด์หลักร่วมกัน
const deliveryPointBaseSchema = z.object({
    name: z.string().min(1),
    is_active: z.boolean(),
});

// 🆕 Create: ไม่ต้องมี id
export const deliveryPointCreateSchema = deliveryPointBaseSchema;

export const deliveryPointGetSchema = deliveryPointBaseSchema.extend({
    id: z.string().min(1),
});

export const deliveryPointUpdateSchema = deliveryPointGetSchema;

// 🧾 Type definitions
export type DeliveryPointCreateDto = z.infer<typeof deliveryPointCreateSchema>;
export type DeliveryPointUpdateDto = z.infer<typeof deliveryPointUpdateSchema>;
export type DeliveryPointGetDto = z.infer<typeof deliveryPointGetSchema>;
