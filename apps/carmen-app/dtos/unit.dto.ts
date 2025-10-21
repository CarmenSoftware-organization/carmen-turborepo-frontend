import { z } from "zod";

export const unitSchema = z.object({
    name: z.string(),
    description: z.string(),
    is_active: z.boolean(),
});

export const unitWithIdSchema = unitSchema.extend({
    id: z.string(),
});

export const unitWithTimestampsSchema = unitWithIdSchema.extend({
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// For API responses (includes all fields)
export type UnitDto = z.infer<typeof unitWithTimestampsSchema>;

// For creating new units (no id, no timestamps)
export type CreateUnitDto = z.infer<typeof unitSchema>;

// For updating units (includes id and timestamps for version checking)
export type UpdateUnitDto = z.infer<typeof unitWithTimestampsSchema>;
