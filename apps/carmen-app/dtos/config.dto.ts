import { INVENTORY_TYPE } from "@/constants/enum";
import { z } from "zod";

export const currencySchema = z.object({
    id: z.string().min(1).optional(),
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    is_active: z.boolean(),
    symbol: z.string().min(1),
    exchange_rate: z.number(),
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

export const storeLocationInfoSchema = z.object({
    floor: z.number(),
    building: z.string(),
    capacity: z.number(),
    responsibleDepartment: z.string(),
    itemCount: z.number(),
    lastCount: z.string()
});
export type StoreLocationInfoDto = z.infer<typeof storeLocationInfoSchema>;

export const storeLocationSchema = z.object({
    name: z.string().min(1),
    location_type: z.nativeEnum(INVENTORY_TYPE),
    description: z.string().min(1),
    is_active: z.boolean(),
    info: storeLocationInfoSchema,
});

export const createStoreLocationSchema = storeLocationSchema.extend({
    delivery_point_id: z.string().min(1),
});

export type CreateStoreLocationDto = z.infer<typeof createStoreLocationSchema>;

export const getStoreLocationSchema = storeLocationSchema.extend({
    id: z.string().min(1).optional(),
    delivery_point: deliveryPointSchema,
});

export type StoreLocationDto = z.infer<typeof getStoreLocationSchema>;
