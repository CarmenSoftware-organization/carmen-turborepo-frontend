import { z } from "zod";

export const infoItemSchema = z.object({
  label: z.string().optional(),
  value: z.string().optional(),
  data_type: z
    .enum(["string", "number", "date", "datetime", "boolean", "dataset"])
    .optional(),
});

const addressSchema = z
  .object({
    address_type: z.string().optional(),
    data: z
      .object({
        address_line1: z.string().optional(),
        address_line2: z.string().optional(),
        district: z.string().optional(),
        province: z.string().optional(),
        postal_code: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
  })
  .optional();

export const contactSchema = z.object({
  contact_type: z.string().optional(),
  description: z.string().optional(),
  info: z.array(infoItemSchema).optional(),
});

export const createVendorFormSchema = (messages: {
  nameRequired: string;
}) =>
  z.object({
    id: z.string().optional(),
    name: z.string().min(1, messages.nameRequired),
    description: z.string().nullish(),
    info: z.array(infoItemSchema).nullish(),
    vendor_address: z.array(addressSchema).nullish(),
    vendor_contact: z.array(contactSchema).nullish(),
  });

export type VendorFormData = z.infer<ReturnType<typeof createVendorFormSchema>>;
