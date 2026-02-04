import { z } from "zod";

export const infoItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  data_type: z.enum(["string", "number", "date", "datetime", "boolean", "dataset"]),
});

const addressSchema = z.object({
  id: z.string().optional(),
  is_new: z.boolean().optional(),
  address_type: z.string(),
  data: z.object({
    address_line1: z.string(),
    address_line2: z.string().optional().or(z.literal("")),
    district: z.string(),
    province: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    postal_code: z.string(),
    country: z.string(),
  }),
});

export const createContactSchema = (messages: { nameRequired: string; emailInvalid: string }) =>
  z.object({
    id: z.string().optional(),
    is_new: z.boolean().optional(),
    name: z.string().min(1, messages.nameRequired),
    email: z.string().email(messages.emailInvalid).optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    is_primary: z.boolean().optional(),
  });

export const createVendorFormSchema = (messages: {
  nameRequired: string;
  codeRequired: string;
  contactNameRequired: string;
  emailInvalid: string;
}) =>
  z
    .object({
      id: z.string().optional(),
      name: z.string().min(1, messages.nameRequired),
      code: z.string().min(1, messages.codeRequired),
      description: z.string().nullish(),
      business_type: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        )
        .default([]),
      info: z.array(infoItemSchema).default([]),
      addresses: z.array(addressSchema).default([]),
      contacts: z
        .array(
          createContactSchema({
            nameRequired: messages.contactNameRequired,
            emailInvalid: messages.emailInvalid,
          })
        )
        .default([]),
      vendor_address: z.object({
        add: z.array(addressSchema).default([]),
        update: z.array(addressSchema).default([]),
        delete: z.array(z.object({ id: z.string() })).default([]),
      }),
      vendor_contact: z.object({
        add: z
          .array(
            createContactSchema({
              nameRequired: messages.contactNameRequired,
              emailInvalid: messages.emailInvalid,
            })
          )
          .default([]),
        update: z
          .array(
            createContactSchema({
              nameRequired: messages.contactNameRequired,
              emailInvalid: messages.emailInvalid,
            })
          )
          .default([]),
        delete: z.array(z.object({ id: z.string() })).default([]),
      }),
    })
    .transform((data) => {
      // Remove id if it is an empty string
      if (data.id === "") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = data;
        return rest;
      }
      return data;
    });

export type VendorFormData = z.infer<ReturnType<typeof createVendorFormSchema>>;
