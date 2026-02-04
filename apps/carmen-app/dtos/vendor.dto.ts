import { VendorGetDto } from "./vendor-management";

/**
 * Vendor DTO - Pure TypeScript interfaces
 * Zod schemas moved to: app/.../vendor/_schemas/vendor-form.schema.ts
 */

/**
 * Info Item DTO
 */
/**
 * Info Item DTO
 */
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

/**
 * Address DTO
 */
/**
 * Address DTO
 */
export interface AddressDto {
  id?: string;
  is_new?: boolean;
  address_type: string;
  data: AddressDataDto;
}

/**
 * Contact DTO
 */
export interface ContactDto {
  id?: string;
  is_new?: boolean;
  name: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
}

/**
 * Vendor Form Values DTO (includes UI state fields)
 */
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
    delete: { id: string }[];
  };
  vendor_contact: {
    add: ContactDto[];
    update: ContactDto[];
    delete: { id: string }[];
  };
}

/**
 * Vendor Payload DTO (for API submission - excludes UI state fields)
 */
export type VendorPayload = Omit<VendorFormValues, "addresses" | "contacts">;

/**
 * Transform Vendor API response to Form values
 */
export const transformVendorData = (data: VendorGetDto): VendorFormValues => {
  // Use tb_vendor_contact if available (has id), otherwise use vendor_contact (no id)
  const contacts =
    data.tb_vendor_contact?.map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      is_primary: contact.is_primary ?? false,
    })) ||
    data.vendor_contact?.map((contact) => ({
      // vendor_contact doesn't have id field
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      is_primary: contact.is_primary ?? false,
    })) ||
    [];

  // vendor_address has id field
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
    business_type: data.business_type ?? [],
    info: Array.isArray(data.info) ? data.info : [],
    addresses: addresses,
    contacts: contacts,
    vendor_address: {
      add: [],
      update: [],
      delete: [],
    },
    vendor_contact: {
      add: [],
      update: [],
      delete: [],
    },
  };
};
