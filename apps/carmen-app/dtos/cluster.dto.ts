import { z } from "zod";

export const clusterPostSchema = z.object({
    code: z.string(),
    name: z.string(),
    is_active: z.boolean(),
});

export const clusterGetSchema = clusterPostSchema.extend({
    id: z.string().uuid(),
    info: z.string().optional(),
});

export type ClusterPostDto = z.infer<typeof clusterPostSchema>;
export type ClusterGetDto = z.infer<typeof clusterGetSchema>;


