import { z } from "zod";

export const AccountCodeMappingSchema = z.object({
    id: z.string().optional(),
    location: z.string(),
    category: z.string(),
    sub_category: z.string(),
    item_group: z.string(),
    department_count: z.number(),
    account_code: z.string(),
});

export type AccountCodeMappingDto = z.infer<typeof AccountCodeMappingSchema>;
