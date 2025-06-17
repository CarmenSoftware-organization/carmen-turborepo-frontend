import { INVENTORY_TYPE } from "@/constants/enum";
import { z } from "zod";

export enum PHYSICAL_COUNT_TYPE {
    YES = "yes",
    NO = "no"
}

export const currencySchema = z.object({
    id: z.string().min(1).optional(),
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    is_active: z.boolean(),
    symbol: z.string().min(1),
    exchange_rate: z.number().min(0.01),
});

export type CurrencyDto = z.infer<typeof currencySchema>;

export const deliveryPointSchema = z.object({
    id: z.string().min(1).optional(),
    name: z.string().min(1),
    is_active: z.boolean(),
});

export type DeliveryPointDto = z.infer<typeof deliveryPointSchema>;


export const departmentSchema = z.object({
    id: z.string().min(1).optional(),
    name: z.string().min(1),
    description: z.string().min(1),
    is_active: z.boolean(),
});

export type DepartmentDto = z.infer<typeof departmentSchema>;

export const departmentDetailSchema = departmentSchema.extend({
    id: z.string().min(1).optional(),
    name: z.string().min(1),
    description: z.string().min(1),
    is_active: z.boolean(),
});

export type DepartmentDetailDto = z.infer<typeof departmentDetailSchema>;

export const storeLocationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    location_type: z.nativeEnum(INVENTORY_TYPE),
    description: z.string().optional(),
    is_active: z.boolean(),
});

export const createStoreLocationSchema = storeLocationSchema.extend({
    delivery_point_id: z.string().min(1, "Delivery point is required"),
    physical_count_type: z.nativeEnum(PHYSICAL_COUNT_TYPE),
    users: z.object({
        add: z.array(z.object({
            user_id: z.string().uuid(),
        })),
        remove: z.array(z.object({
            user_id: z.string().uuid(),
        }))
    }).optional(),
    info: z.object({
        floor: z.number(),
        building: z.string(),
        capacity: z.number(),
        responsibleDepartment: z.string(),
        itemCount: z.number(),
        lastCount: z.string(),
    }).optional(),
});

export type CreateStoreLocationDto = z.infer<typeof createStoreLocationSchema>;

export const getStoreLocationSchema = storeLocationSchema.extend({
    id: z.string().min(1).optional(),
    delivery_point: deliveryPointSchema,
});

export type StoreLocationDto = z.infer<typeof getStoreLocationSchema>;
export interface LocationByIdDto {
    id: string;
    name: string;
    location_type: INVENTORY_TYPE;
    physical_count_type: PHYSICAL_COUNT_TYPE;
    description: string;
    is_active: boolean;
    users: {
        id: string;
        name: string;
    }[];
    delivery_point: DeliveryPointDto;
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
  });
  
  export type FormLocationValues = z.infer<typeof formLocationSchema>;