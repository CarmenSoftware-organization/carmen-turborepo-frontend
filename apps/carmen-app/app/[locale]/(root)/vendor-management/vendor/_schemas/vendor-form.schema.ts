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
    address_line2: z.string(),
    district: z.string(),
    province: z.string(),
    postal_code: z.string(),
    country: z.string(),
  }),
});

export const contactSchema = z.object({
  contact_type: z.string(),
  description: z.string(),
  info: z.array(infoItemSchema),
});

export const createVendorFormSchema = (messages: { nameRequired: string; codeRequired: string }) =>
  z.object({
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
  });

export type VendorFormData = z.infer<ReturnType<typeof createVendorFormSchema>>;
