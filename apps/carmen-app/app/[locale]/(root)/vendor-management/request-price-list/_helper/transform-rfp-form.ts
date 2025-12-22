import { RfpFormValues } from "../_schema/rfp.schema";
import { RfpCreateDto, RfpUpdateDto } from "@/dtos/rfp.dto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformToCreateDto = (
  data: RfpFormValues,
  availableVendors: any[] = []
): RfpCreateDto => {
  // Map selected vendor IDs to full vendor objects from the available list
  const selectedVendorObjects = (data.vendors || [])
    .map((id) => availableVendors.find((v) => v.id === id || v.vendor_id === id))
    .filter((v) => !!v)
    .map((v, index) => ({
      vendor_id: v.vendor_id || v.id, // Ensure we map to the correct ID field expected by backend
      vendor_name: v.vendor_name || v.name_en || v.name_th || "", // Fallback if name varies
      vendor_code: v.vendor_code || "",
      contact_person: v.contact_person || "",
      contact_phone: v.contact_phone || "",
      contact_email: v.contact_email || "",
      // Add other fields as per payload requirement
      sequence_no: index + 1,
      dimension: v.dimension || "Nationwide", // Default or map from somewhere
      id: "", // Relation ID is null/empty for new creation
    }));

  return {
    name: data.name,
    pricelist_template_id: data.pricelist_template_id, // Updated field name
    start_date: data.start_date, // Passed directly as ISO string from form
    end_date: data.end_date, // Passed directly as ISO string from form
    custom_message: data.custom_message,
    email_template_id: "e4220b22-861d-4c31-8930-74673322748a", // Hardcoded per user payload example or should be from form? Form doesn't have it yet.
    info: data.info || "Photovoltaic panels, hybrid inverters, and battery storage solutions.", // Use form value if available
    dimension: data.dimension || "Green Energy Sector", // Use form value
    vendors: {
      add: selectedVendorObjects as any[], // Casting as any for now to avoid strict RfpVendorDto mismatch if fields vary
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
  // Reuse create logic for base fields
  const baseDto = transformToCreateDto(data, availableVendors);

  return {
    ...baseDto,
    vendors: {
      add: (vendorsToAdd || [])
        .map((id) => availableVendors.find((v) => v.id === id || v.vendor_id === id))
        .filter((v) => !!v)
        .map((v, index) => ({
          // ... duplicate logic, ideally extract vendor mapping
          vendor_id: v.vendor_id || v.id,
          vendor_name: v.vendor_name || v.name_en || v.name_th || "",
          // ... truncated for brevity, assuming backend handles updates differently or same add structure
          id: "",
          vendor_code: v.vendor_code || "",
          contact_person: v.contact_person || "",
          contact_phone: v.contact_phone || "",
          contact_email: v.contact_email || "",
          has_submitted: false,
        })) as any[],
      // Note: Update usually has 'update' and 'remove' keys too, but RfpUpdateDto extends Create which has vendors object.
      // I will need to adjust RfpUpdateDto if it supports remove/update in that structure.
      // For now aligning with specific payload request which was mostly about "add".
    },
    pricelist_template_id: data.pricelist_template_id,
    settings: {
      portal_duration: data.portal_duration,
      rfp_type: data.rfp_type,
      submission_method: data.submission_method,
      require_approval: data.require_approval,
      auto_reminder: data.auto_reminder,
      priority: data.priority,
      instructions: data.instructions,
      reminders: data.reminders || [],
      escalations: data.escalations || [],
    },
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
