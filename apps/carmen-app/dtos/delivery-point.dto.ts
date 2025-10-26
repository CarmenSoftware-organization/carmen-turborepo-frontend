import { z } from "zod";

// 🧱 base schema factory ที่รองรับ i18n
export const createDeliveryPointBaseSchema = (messages: {
    nameRequired: string;
}) => z.object({
    name: z.string().min(1, messages.nameRequired),
    is_active: z.boolean(),
});

// Default base schema for backward compatibility
const deliveryPointBaseSchema = createDeliveryPointBaseSchema({
    nameRequired: "Name is required",
});

// 🆕 Create: ไม่ต้องมี id
export const deliveryPointCreateSchema = deliveryPointBaseSchema;

export const deliveryPointGetSchema = deliveryPointBaseSchema.extend({
    id: z.string().uuid(),
});

export const deliveryPointUpdateSchema = deliveryPointGetSchema;

// Schema factories for i18n
export const createDeliveryPointCreateSchema = (messages: { nameRequired: string }) =>
    createDeliveryPointBaseSchema(messages);

export const createDeliveryPointUpdateSchema = (messages: { nameRequired: string }) =>
    createDeliveryPointBaseSchema(messages).extend({
        id: z.string().uuid(),
    });

// 🧾 Type definitions
export type DeliveryPointCreateDto = z.infer<typeof deliveryPointCreateSchema>;
export type DeliveryPointUpdateDto = z.infer<typeof deliveryPointUpdateSchema>;
export type DeliveryPointGetDto = z.infer<typeof deliveryPointGetSchema>;
