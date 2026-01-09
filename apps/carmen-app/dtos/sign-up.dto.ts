import { z } from "zod";

export const createSignUpSchema = (t: (key: string) => string) => {
  return z
    .object({
      username: z
        .string({
          required_error: t("usernameRequired"),
        })
        .min(1, {
          message: t("usernameRequired"),
        }),
      email: z
        .string({
          required_error: t("emailRequired"),
        })
        .email({
          message: t("emailInvalid"),
        }),
      password: z
        .string({
          required_error: t("passwordRequired"),
        })
        .min(6, {
          message: t("passwordMinLength"),
        }),
      confirmPassword: z.string({
        required_error: t("confirmPasswordRequired"),
      }),
      firstName: z
        .string({
          required_error: t("firstNameRequired"),
        })
        .min(1, {
          message: t("firstNameRequired"),
        }),
      middleName: z.string().optional(),
      lastName: z
        .string({
          required_error: t("lastNameRequired"),
        })
        .min(1, {
          message: t("lastNameRequired"),
        }),
      telephone: z
        .string({
          required_error: t("telephoneRequired"),
        })
        .min(1, {
          message: t("telephoneRequired"),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
};

export type SignUpFormValues = z.infer<ReturnType<typeof createSignUpSchema>>;

export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
  user_info: {
    first_name: string;
    middle_name: string;
    last_name: string;
    telephone: string;
  };
}

export const mapFormToPayload = (values: SignUpFormValues): SignUpPayload => ({
  username: values.username,
  email: values.email,
  password: values.password,
  user_info: {
    first_name: values.firstName,
    middle_name: values.middleName || "",
    last_name: values.lastName,
    telephone: values.telephone,
  },
});
