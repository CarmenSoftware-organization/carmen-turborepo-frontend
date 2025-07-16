import { z } from "zod";

export const unitSchema = z.object({
    name: z.string(),
    description: z.string(),
    is_active: z.boolean(),
});

export const createUnitSchema = unitSchema.extend({
    id: z.string(),
});

export type UnitDto = z.infer<typeof createUnitSchema>;
export type CreateUnitDto = z.infer<typeof unitSchema>;
export type UpdateUnitDto = z.infer<typeof createUnitSchema>;
