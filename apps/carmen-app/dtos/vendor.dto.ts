import { z } from "zod";
import { VendorGetDto } from "./vendor-management";

export const infoItemSchema = z.object({
    label: z.string().min(1, "Label is required"),
    value: z.string().min(1, "Value is required"),
    data_type: z.enum(["string", "number", "date", "datetime", "boolean", "dataset"]),
})

const addressSchema = z.object({
    address_type: z.string().min(1, "Address type is required"),
    data: z.object({
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zip: z.string().min(1, "ZIP code is required"),
        country: z.string().min(1, "Country is required"),
    }),
})

export const contactSchema = z.object({
    contact_type: z.enum(["phone", "email", "website", "other"]),
    description: z.string().optional(),
    info: z.array(infoItemSchema),
})

export const vendorFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Vendor name is required"),
    description: z.string().optional(),
    info: z.array(infoItemSchema),
    vendor_address: z.array(addressSchema),
    vendor_contact: z.array(contactSchema),
})

export type VendorFormValues = z.infer<typeof vendorFormSchema>;

export const transformVendorData = (data: VendorGetDto): VendorFormValues => {
    return {
        id: data.id,
        name: data.name,
        description: data.description || "",
        info: data.info || [],
        vendor_address: data.vendor_address?.map(addr => ({
            address_type: addr.address_type,
            data: {
                street: addr.address.line_1 ?? "",
                city: addr.address.sub_district ?? "",
                state: addr.address.province ?? "",
                zip: addr.address.postal_code ?? "",
                country: addr.address.country ?? "",
            }
        })) || [],
        vendor_contact: data.vendor_contact?.map(contact => ({
            contact_type: contact.contact_type as "phone" | "email" | "website" | "other",
            description: contact.description || "",
            info: contact.info || []
        })) || []
    };
};