import { z } from "zod";

export const generalSettingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    language: z.string(),
    timezone: z.string(),
    currency: z.string(),
});


export const platformUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Must be a valid email address"),
    role: z.string().min(1, "Role is required"),
    bu_name: z.string().min(1, "Business unit is required"),
    status: z.boolean().default(true),
});
