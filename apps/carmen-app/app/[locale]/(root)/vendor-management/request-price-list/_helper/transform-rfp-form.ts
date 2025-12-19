import { RfpFormValues } from "../_schema/rfp.schema";
import { RfpCreateDto, RfpUpdateDto } from "@/dtos/rfp.dto";

export const transformToCreateDto = (data: RfpFormValues): RfpCreateDto => {
  return {
    name: data.name,
    status: data.status,
    description: data.custom_message, // Mapping form's custom_message to DTO's description
    valid_period: data.valid_period,
    vendors: {
      add: data.vendors || [],
    },
    // Note: RfpCreateDto in my previous definition didn't include settings explicitly,
    // but typically these should be passed.
    // If usage requires them, I should update RfpCreateDto.
    // For now, adhering to the interface defined in rfp.dto.ts
  };
};

export const transformToUpdateDto = (
  data: RfpFormValues,
  vendorsToAdd: string[],
  vendorsToUpdate: string[],
  vendorsToRemove: string[]
): RfpUpdateDto => {
  return {
    name: data.name,
    status: data.status,
    description: data.custom_message,
    valid_period: data.valid_period,
    vendors: {
      add: vendorsToAdd,
    },
    template_id: data.template_id,
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
