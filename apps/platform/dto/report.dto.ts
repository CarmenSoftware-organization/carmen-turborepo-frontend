import { ReportTemplateSchema } from "@/constants/schema";
import { z } from "zod";

export interface ReportAssignmentType {
    id: string;
    type: "standard" | "custom" | "premium" | "basic" | "detailed" | "summary";
    status: "active" | "inactive";
    category: string;
    location: string;
    description: string;
    frequency: {
        type: "Daily" | "Weekly" | "Bi-Weekly" | "Monthly" | "Quarterly";
        nextReport: string;
    };
}

export interface ReportSubType {
    id: string;
    title: string;
    type: "standard" | "custom" | "premium" | "basic" | "detailed" | "summary";
    status: "active" | "inactive";
    category: string;
}

export interface ReportBusinessUnitType {
    id: string;
    name: string;
    description: string;
    reports: ReportSubType[];
}

export interface ReportClusterType {
    id: string;
    cluster: string;
    business_unit: ReportBusinessUnitType[];
}

export type ReportTemplateType = z.infer<typeof ReportTemplateSchema>;
