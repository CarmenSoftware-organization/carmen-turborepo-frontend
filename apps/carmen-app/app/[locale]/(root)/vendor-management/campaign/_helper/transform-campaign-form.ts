import { CampaignFormValues } from "../_schema/campaign.schema";
import { CampaignCreateDto, CampaignUpdateDto } from "@/dtos/campaign.dto";
export const transformToCreateDto = (data: CampaignFormValues): CampaignCreateDto => {
  return {
    name: data.name,
    status: data.status,
    description: data.description,
    valid_period: data.valid_period,
    vendors: {
      add: data.vendors || [],
      update: [],
      remove: [],
    },
    template_id: data.template_id,
    settings: {
      portal_duration: data.portal_duration,
      campaign_type: data.campaign_type,
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

export const transformToUpdateDto = (
  data: CampaignFormValues,
  vendorsToAdd: string[],
  vendorsToUpdate: string[],
  vendorsToRemove: string[]
): CampaignUpdateDto => {
  return {
    name: data.name,
    status: data.status,
    description: data.description,
    valid_period: data.valid_period,
    vendors: {
      add: vendorsToAdd,
      update: vendorsToUpdate,
      remove: vendorsToRemove,
    },
    template_id: data.template_id,
    settings: {
      portal_duration: data.portal_duration,
      campaign_type: data.campaign_type,
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
