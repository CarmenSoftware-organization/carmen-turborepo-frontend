import { RfpFormValues } from "../_schema/rfp.schema";
import { RfpCreateDto, RfpUpdateDto } from "@/dtos/rfp.dto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformToCreateDto = (
  data: RfpFormValues,
  availableVendors: any[] = []
): RfpCreateDto => {
  // Use vendors from form data directly (they are already objects with vendor_id, vendor_name)
  const formVendors = data.vendors?.add || [];

  const vendorsPayload = formVendors.map((v: any, index: number) => ({
    vendor_id: v.vendor_id,
    vendor_name: v.vendor_name,
    vendor_code: "", // Not in form values currently
    contact_person: v.contact_person || "",
    contact_phone: v.contact_phone || "",
    contact_email: v.contact_email || "",
    sequence_no: index + 1,
    dimension: data.dimension || "Nationwide",
    id: "", // Relation ID
  }));

  return {
    name: data.name,
    pricelist_template_id: data.pricelist_template_id,
    start_date: data.start_date,
    end_date: data.end_date,
    custom_message: data.custom_message,
    email_template_id: "e4220b22-861d-4c31-8930-74673322748a",
    info: data.info || "Photovoltaic panels, hybrid inverters, and battery storage solutions.",
    dimension: data.dimension || "Green Energy Sector",
    vendors: {
      add: vendorsPayload as any[],
    },
  };
};

export const transformToUpdateDto = (
  data: RfpFormValues,
  vendorsToAdd: string[],
  vendorsToUpdate: string[],
  vendorsToRemove: string[],
  availableVendors: any[] = []
): RfpUpdateDto => {
  const baseDto = transformToCreateDto(data, availableVendors);

  return {
    ...baseDto,
    // Add specific update logic if needed, e.g. handling removed vendors if DTO supports it
  };
};

export const calculateVendorOperations = (
  originalVendors: string[],
  newVendors: string[]
): { add: string[]; update: string[]; remove: string[] } => {
  const vendorsToAdd = newVendors.filter((id) => !originalVendors.includes(id));
  const vendorsToRemove = originalVendors.filter((id) => !newVendors.includes(id));
  const vendorsToUpdate = newVendors.filter((id) => originalVendors.includes(id));

  return {
    add: vendorsToAdd,
    update: vendorsToUpdate,
    remove: vendorsToRemove,
  };
};
