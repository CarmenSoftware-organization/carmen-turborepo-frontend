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
  address_line2: string;
  district: string;
  province: string;
  postal_code: string;
  country: string;
}

/**
 * Address DTO
 */
export interface AddressDto {
  address_type: string;
  data: AddressDataDto;
}

/**
 * Contact DTO
 */
export interface ContactDto {
  contact_type: string;
  description: string;
  info: InfoItemDto[];
}

/**
 * Vendor Form Values DTO
 */
export interface VendorFormValues {
  id?: string;
  name: string;
  code: string;
  description?: string | null;
  business_type: { id: string; name: string }[];
  info: InfoItemDto[];
  vendor_address: AddressDto[];
  vendor_contact: ContactDto[];
}

/**
 * Transform Vendor API response to Form values
 */
export const transformVendorData = (data: VendorGetDto): VendorFormValues => {
  return {
    id: data.id,
    name: data.name,
    code: data.code,
    description: data.description ?? "",
    business_type: data.business_type ?? [],
    info: Array.isArray(data.info) ? data.info : [],
    vendor_address:
      data.vendor_address?.map((addr) => ({
        address_type: addr.address_type,
        data: {
          address_line1: addr.data.address_line1 ?? "",
          address_line2: addr.data.address_line2 ?? "",
          district: addr.data.district ?? "",
          province: addr.data.province ?? "",
          postal_code: addr.data.postal_code ?? "",
          country: addr.data.country ?? "",
        },
      })) || [],
    vendor_contact:
      data.vendor_contact?.map((contact) => ({
        contact_type: contact.contact_type,
        description: contact.description || "",
        info: contact.info || [],
      })) || [],
  };
};
