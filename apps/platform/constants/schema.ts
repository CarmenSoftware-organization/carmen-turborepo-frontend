import { z } from "zod";

export const generalSettingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    language: z.string(),
    timezone: z.string(),
    currency: z.string(),
});
