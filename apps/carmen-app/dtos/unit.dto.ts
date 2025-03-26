import { z } from "zod";

export const unitSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string(),
    is_active: z.boolean(),
});

export type UnitDto = z.infer<typeof unitSchema>;
