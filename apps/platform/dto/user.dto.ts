import { businessUnitUserSchema, clusterUserSchema, platformUserSchema } from "@/constants/schema";
import { z } from "zod";

export type PlatformUserDto = z.infer<typeof platformUserSchema>;

export type ClusterUserDto = z.infer<typeof clusterUserSchema>;

export type BusinessUnitUserDto = z.infer<typeof businessUnitUserSchema>;

export interface RoleDto {
    id: string;
    name: string;
    scope: string;
    permissions: {
        id: string;
        name: string;
    }[];
    total_users: number;
    last_active: string;
}


