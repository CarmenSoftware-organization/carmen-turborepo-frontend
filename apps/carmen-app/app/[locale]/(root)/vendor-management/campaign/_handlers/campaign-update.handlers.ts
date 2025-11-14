import { UseMutationResult } from "@tanstack/react-query";
import { CampaignUpdateDto, CampaignDetailDto } from "@/dtos/campaign.dto";
import { UseFormReturn } from "react-hook-form";
import { CampaignFormValues } from "../_schema/campaign.schema";

export const handleUpdateSuccess = async (
  result: CampaignDetailDto,
  form: UseFormReturn<CampaignFormValues>
): Promise<void> => {
  form.reset({
    name: result.name,
    status: result.status,
    description: result.description,
    valid_period: result.valid_period,
    template_id: result.template?.id,
    portal_duration: result.settings.portal_duration,
    campaign_type: result.settings.campaign_type,
    submission_method: result.settings.submission_method,
    require_approval: result.settings.require_approval,
    auto_reminder: result.settings.auto_reminder,
    priority: result.settings.priority,
    instructions: result.settings.instructions,
    reminders: result.settings.reminders,
    escalations: result.settings.escalations,
    vendors: result.vendor?.map((v) => v.id) || [],
  });
};

export const handleUpdateError = (error: unknown): void => {
  const errorMessage = error instanceof Error ? error.message : "An error occurred";
  alert(errorMessage);
};

export const updateCampaign = async (
  updateDto: CampaignUpdateDto,
  mutation: UseMutationResult<CampaignDetailDto, Error, CampaignUpdateDto>,
  form: UseFormReturn<CampaignFormValues>,
  onSuccess?: () => void
): Promise<void> => {
  try {
    const result = await mutation.mutateAsync(updateDto);
    await handleUpdateSuccess(result, form);
    alert("Campaign updated successfully");
    onSuccess?.();
  } catch (error) {
    handleUpdateError(error);
  }
};
