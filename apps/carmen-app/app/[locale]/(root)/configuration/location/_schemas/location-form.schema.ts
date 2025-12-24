import { z } from "zod";
import { INVENTORY_TYPE } from "@/constants/enum";
import { PHYSICAL_COUNT_TYPE } from "@/dtos/location.dto";

export const createLocationFormSchema = (messages: {
  nameRequired: string;
  deliveryPointRequired: string;
  codeRequired: string;
}) =>
  z.object({
    id: z.string().optional(),
    name: z.string().min(1, messages.nameRequired),
    code: z.string().min(1, messages.codeRequired),
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
