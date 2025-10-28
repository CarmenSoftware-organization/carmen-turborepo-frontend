import { z } from "zod";
import { INVENTORY_TYPE } from "@/constants/enum";
import { PHYSICAL_COUNT_TYPE } from "@/dtos/location.dto";

/**
 * Factory function สำหรับสร้าง Location Form Schema พร้อม i18n messages
 * ใช้เฉพาะใน location form
 */
export const createLocationFormSchema = (messages: {
  nameRequired: string;
  deliveryPointRequired: string;
}) => z.object({
  id: z.string().optional(),
  name: z.string().min(1, messages.nameRequired),
  location_type: z.nativeEnum(INVENTORY_TYPE),
  description: z.string().optional(),
  physical_count_type: z.nativeEnum(PHYSICAL_COUNT_TYPE),
  is_active: z.boolean(),
  delivery_point_id: z.string().min(1, messages.deliveryPointRequired),
  users: z.object({
    add: z.array(
      z.object({
        id: z.string(),
      })
    ),
    remove: z.array(
      z.object({
        id: z.string(),
      })
    ),
  }),
  products: z.object({
    add: z.array(
      z.object({
        id: z.string(),
      })
    ),
    remove: z.array(
      z.object({
        id: z.string(),
      })
    ),
  }),
});

/**
 * Inferred Type จาก Zod Schema
 */
export type LocationFormData = z.infer<ReturnType<typeof createLocationFormSchema>>;
