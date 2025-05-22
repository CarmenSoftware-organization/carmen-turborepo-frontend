import { z } from "zod";

export type GetAllSystemUnitBuDto = {
    id: string;
    cluster_id: string;
    code: string;
    name: string;
    description: string;
    is_hq: boolean;
    is_active: boolean;
}

export const systemUnitBuSchema = z.object({
    cluster_id: z.string().min(1, "Cluster is required"),
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    is_hq: z.boolean().default(false),
    is_active: z.boolean().default(true),
});

export type SystemBuFormValue = z.infer<typeof systemUnitBuSchema>;


