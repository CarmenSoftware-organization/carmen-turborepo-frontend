import { z } from "zod";

export const infoItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  data_type: z.enum(["string", "number", "date", "datetime", "boolean", "dataset"]),
});

const addressSchema = z.object({
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

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  is_primary: z.boolean().optional(),
});

export const createVendorFormSchema = (messages: { nameRequired: string; codeRequired: string }) =>
  z
    .object({
      id: z.string().optional(),
      name: z.string().min(1, messages.nameRequired),
      code: z.string().min(1, messages.codeRequired),
      description: z.string().nullish(),
      business_type: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
      info: z.array(infoItemSchema),
      vendor_address: z.array(addressSchema),
      vendor_contact: z.array(contactSchema),
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
