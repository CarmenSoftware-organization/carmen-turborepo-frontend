import { z } from "zod";
import { signInSchema } from "@/constants/form.schema";

export type SignInFormValues = z.infer<typeof signInSchema> 