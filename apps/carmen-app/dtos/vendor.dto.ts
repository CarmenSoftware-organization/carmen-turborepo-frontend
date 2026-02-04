import { z } from "zod";
import { VendorGetDto } from "./vendor-management";

export interface InfoItemDto {
  label: string;
  value: string;
  data_type: "string" | "number" | "date" | "datetime" | "boolean" | "dataset";
}

/**
 * Address Data DTO
 */
export interface AddressDataDto {
  address_line1: string;
  address_line2?: string;
  district: string;
  province?: string;
  city?: string;
  postal_code: string;
  country: string;
}

export interface AddressDto {
  id?: string;
  is_new?: boolean;
  address_type: string;
  data: AddressDataDto;
}

export interface ContactDto {
  id?: string;
  is_new?: boolean;
  name: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
}

/**
 * Initial data for vendor form (loaded from API)
 */
export interface VendorInitData {
  id?: string;
  name: string;
  code: string;
  description?: string | null;
  note?: string | null;
  business_type: { id: string; name: string }[];
  info: InfoItemDto[];
  addresses: AddressDto[];
  contacts: ContactDto[];
}

/**
 * Transform Vendor API response to initial data
 */
export const transformVendorData = (data: VendorGetDto): VendorInitData => {
  const contacts =
    data.vendor_contact?.map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      is_primary: contact.is_primary ?? false,
    })) || [];

  const addresses =
    data.vendor_address?.map((addr) => ({
      id: addr.id,
      address_type: addr.address_type,
      data: {
        address_line1: addr.data?.address_line1 ?? "",
        address_line2: addr.data?.address_line2 ?? "",
        district: addr.data?.district ?? "",
        province: addr.data?.province,
        city: addr.data?.city,
        postal_code: addr.data?.postal_code ?? "",
        country: addr.data?.country ?? "",
      },
    })) || [];

  return {
    id: data.id,
    name: data.name,
    code: data.code,
    description: data.description ?? "",
    note: data.note,
    business_type: data.business_type ?? [],
    info: Array.isArray(data.info) ? data.info : [],
    addresses,
    contacts,
  };
};

export interface VendorFormValues {
  id?: string;
  name: string;
  code: string;
  description?: string | null;
  note?: string | null;
  business_type: { id: string; name: string }[];
  info: InfoItemDto[];
  addresses: AddressDto[]; // UI State only
  contacts: ContactDto[]; // UI State only
  vendor_address: {
    add: AddressDto[];
    update: AddressDto[];
    remove: { id: string }[];
  };
  vendor_contact: {
    add: ContactDto[];
    update: ContactDto[];
    remove: { id: string }[];
  };
}

export type VendorPayload = Omit<VendorFormValues, "addresses" | "contacts">;

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
        remove: z.array(z.object({ id: z.string() })).default([]),
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
        remove: z.array(z.object({ id: z.string() })).default([]),
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
