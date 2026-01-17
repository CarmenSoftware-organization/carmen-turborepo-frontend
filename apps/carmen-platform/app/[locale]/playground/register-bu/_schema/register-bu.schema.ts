import { z } from "zod";

export const stepBuSchema = z.object({
  cluster_id: z.string().min(1, "Cluster is required"),
  code: z.string().min(3, "Code is required"),
  name: z.string().min(1, "Name is required"),
  is_hq: z.boolean(),
  is_active: z.boolean(),
});

export const stepUserSchema = z.object({
  // TODO: Add user fields
});

export const stepConfigSchema = z.object({
  // TODO: Add config fields
});

export const registerBuSchema = z.object({
  ...stepBuSchema.shape,
  ...stepUserSchema.shape,
  ...stepConfigSchema.shape,
});

export type StepBuFormData = z.infer<typeof stepBuSchema>;
export type StepUserFormData = z.infer<typeof stepUserSchema>;
export type StepConfigFormData = z.infer<typeof stepConfigSchema>;
export type RegisterBuFormData = z.infer<typeof registerBuSchema>;
