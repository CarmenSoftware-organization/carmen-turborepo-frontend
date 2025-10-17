import { z } from "zod";

export const createSignInSchema = (t: (key: string) => string) => {
    return z.object({
        email: z.string({
            required_error: t("emailRequired")
        }).email({
            message: t("emailInvalid")
        }),
        password: z.string({
            required_error: t("passwordRequired")
        }).min(6, {
            message: t("passwordMinLength")
        }),
    });
};

export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>> 