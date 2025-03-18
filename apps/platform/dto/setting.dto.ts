import { z } from "zod";
import { generalSettingSchema } from "@/constants/schema";

export type GeneralSettingDto = z.infer<typeof generalSettingSchema>;

