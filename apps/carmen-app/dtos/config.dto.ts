import { INVENTORY_TYPE } from "@/constants/enum";
import { z } from "zod";
import { DeliveryPointGetDto, deliveryPointGetSchema } from "./delivery-point.dto";

export enum PHYSICAL_COUNT_TYPE {
  YES = "yes",
  NO = "no",
}

export const storeLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location_type: z.nativeEnum(INVENTORY_TYPE),
  description: z.string().optional(),
  is_active: z.boolean(),
});

export const createStoreLocationSchema = storeLocationSchema.extend({
  delivery_point_id: z.string().min(1, "Delivery point is required"),
  physical_count_type: z.nativeEnum(PHYSICAL_COUNT_TYPE),
  users: z
    .object({
      add: z.array(
        z.object({
          user_id: z.string().uuid(),
        })
      ),
      remove: z.array(
        z.object({
          user_id: z.string().uuid(),
        })
      ),
    })
    .optional(),
  info: z
    .object({
      floor: z.number(),
      building: z.string(),
      capacity: z.number(),
      responsibleDepartment: z.string(),
      itemCount: z.number(),
      lastCount: z.string(),
    })
    .optional(),
});

export type CreateStoreLocationDto = z.infer<typeof createStoreLocationSchema>;

export const getStoreLocationSchema = storeLocationSchema.extend({
  id: z.string().min(1).optional(),
  delivery_point: deliveryPointGetSchema,
});

export type StoreLocationDto = z.infer<typeof getStoreLocationSchema>;
export interface LocationByIdDto {
  id: string;
  name: string;
  location_type: INVENTORY_TYPE;
  physical_count_type: PHYSICAL_COUNT_TYPE;
  description: string;
  is_active: boolean;
  user_location: {
    id: string;
    firstname: string;
    lastname: string;
  }[];

  product_location: {
    id: string;
    name: string;
  }[];
  delivery_point: DeliveryPointGetDto;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info?: any;
}

export const formLocationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Please enter name"),
  location_type: z.nativeEnum(INVENTORY_TYPE),
  description: z.string().optional(),
  physical_count_type: z.nativeEnum(PHYSICAL_COUNT_TYPE),
  is_active: z.boolean(),
  delivery_point_id: z.string().min(1, "Please select delivery point"),
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

export type FormLocationValues = z.infer<typeof formLocationSchema>;

export interface TransferItem {
  key: string | number;
  title: string;
  description?: string;
  disabled?: boolean;
}

export interface ProductItemTransfer {
  id: string;
  name: string;
}

export interface UserItemTransfer {
  user_id: string;
  firstname: string;
  lastname: string;
}
