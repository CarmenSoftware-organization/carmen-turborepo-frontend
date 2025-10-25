import { z } from "zod";
import { VendorGetDto } from "./vendor-management";

export const infoItemSchema = z.object({
    label: z.string().optional(),
    value: z.string().optional(),
    data_type: z.enum(["string", "number", "date", "datetime", "boolean", "dataset"]).optional(),
})

const addressSchema = z.object({
    address_type: z.string().optional(),
    data: z.object({
        address_line1: z.string().optional(),
        address_line2: z.string().optional(),
        district: z.string().optional(),
        province: z.string().optional(),
        postal_code: z.string().optional(),
        country: z.string().optional(),
    }).optional(),
}).optional()

export const contactSchema = z.object({
    contact_type: z.string().optional(),
    description: z.string().optional(),
    info: z.array(infoItemSchema).optional(),
})

export const vendorFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Vendor name is required"),
    description: z.string().nullish().transform(val => val ?? ""),
    info: z.array(infoItemSchema).nullish().transform(val => val ?? []),
    vendor_address: z.array(addressSchema).nullish().transform(val => val ?? []),
    vendor_contact: z.array(contactSchema).nullish().transform(val => val ?? []),
})

export type VendorFormValues = z.infer<typeof vendorFormSchema>;

export const transformVendorData = (data: VendorGetDto): VendorFormValues => {
    return {
        id: data.id,
        name: data.name,
        description: data.description ?? "",
        info: data.info ?? [],
        vendor_address: data.vendor_address?.map(addr => ({
            address_type: addr.address_type,
            data: {
                address_line1: addr.address.line_1 ?? "",
                address_line2: addr.address.line_2 ?? "",
                district: addr.address.sub_district ?? "",
                province: addr.address.province ?? "",
                postal_code: addr.address.postal_code ?? "",
                country: addr.address.country ?? "",
            }
        })) || [],
        vendor_contact: data.vendor_contact?.map(contact => ({
            contact_type: contact.contact_type,
            description: contact.description || "",
            info: contact.info || []
        })) || []
    };
};