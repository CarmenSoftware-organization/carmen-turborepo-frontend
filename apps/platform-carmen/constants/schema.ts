import { z } from "zod";

export const generalSettingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    language: z.string(),
    timezone: z.string(),
    currency: z.string(),
});


export const platformUserSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Must be a valid email address"),
    role: z.string().min(1, "Role is required"),
    bu_name: z.string().min(1, "Business unit is required"),
    status: z.boolean().default(true),
    last_active: z.string().optional(),
});

export const clusterUserSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Must be a valid email address"),
    hotel_group: z.string().min(1, "Hotel group is required"),
    role: z.string().min(1, "Role is required"),
    module: z.array(z.object({
        id: z.string().min(1, "Module is required"),
        name: z.string().min(1, "Module is required"),
    })),
    status: z.boolean().default(true),
    last_active: z.string().optional(),
});

export const businessUnitUserSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Must be a valid email address"),
    cluster_name: z.string().min(1, "Cluster name is required"),
    hotel_name: z.string().min(1, "Hotel name is required"),
    department: z.string().min(1, "Department is required"),
    role: z.string().min(1, "Role is required"),
    module: z.array(z.object({
        id: z.string().min(1, "Module is required"),
        name: z.string().min(1, "Module is required"),
    })),
    status: z.boolean().default(true),
    last_active: z.string().optional(),
});
