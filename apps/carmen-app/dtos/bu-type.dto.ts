import { z } from "zod";

export const buTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  note: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type BuTypeGetAllDto = BuTypeFormDto & {
  id: string;
};

export type BuTypeFormDto = z.infer<typeof buTypeSchema>;

export const buTypeEditSchema = buTypeSchema.extend({
  id: z.string().uuid(),
});

export type BuTypeEditDto = z.infer<typeof buTypeEditSchema>;
