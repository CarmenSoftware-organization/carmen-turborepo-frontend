import { z } from "zod";

export const unitSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    status: z.boolean(),
});

export type UnitDto = z.infer<typeof unitSchema>;
