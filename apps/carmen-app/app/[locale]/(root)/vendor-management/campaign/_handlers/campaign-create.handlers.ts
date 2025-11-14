import { UseMutationResult } from "@tanstack/react-query";
import { CampaignCreateDto, CampaignDto } from "@/dtos/campaign.dto";
import { UseFormReturn } from "react-hook-form";
import { CampaignFormValues } from "../_schema/campaign.schema";

export const handleCreateSuccess = async (
  result: CampaignDto,
  form: UseFormReturn<CampaignFormValues>,
  data: CampaignFormValues
): Promise<void> => {
  form.reset({
    name: result.name,
    status: result.status,
    description: result.description,
    valid_period: result.valid_period,
    template_id: data.template_id,
    portal_duration: data.portal_duration,
    campaign_type: data.campaign_type,
    submission_method: data.submission_method,
    require_approval: data.require_approval,
    auto_reminder: data.auto_reminder,
    priority: data.priority,
    instructions: data.instructions,
    reminders: data.reminders,
    escalations: data.escalations,
    vendors: data.vendors,
  });

  await form.trigger();
};

export const handleCreateError = (error: unknown): void => {
  const errorMessage = error instanceof Error ? error.message : "An error occurred";
  alert(errorMessage);
};

export const createCampaign = async (
  createDto: CampaignCreateDto,
  mutation: UseMutationResult<CampaignDto, Error, CampaignCreateDto>,
  form: UseFormReturn<CampaignFormValues>,
  data: CampaignFormValues,
  onSuccess?: () => void
): Promise<void> => {
  try {
    const result = await mutation.mutateAsync(createDto);
    await handleCreateSuccess(result, form, data);
    alert("Campaign created successfully");
    onSuccess?.();
  } catch (error) {
    handleCreateError(error);
  }
};
