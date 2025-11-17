import { UseMutationResult } from "@tanstack/react-query";
import { RfpUpdateDto, RfpDetailDto } from "@/dtos/rfp.dto";
import { UseFormReturn } from "react-hook-form";
import { RfpFormValues } from "../_schema/rfp.schema";

export const handleUpdateSuccess = async (
  result: RfpDetailDto,
  form: UseFormReturn<RfpFormValues>
): Promise<void> => {
  form.reset({
    name: result.name,
    status: result.status,
    description: result.description,
    valid_period: result.valid_period,
    template_id: result.template?.id,
    portal_duration: result.settings.portal_duration,
    rfp_type: result.settings.rfp_type,
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

export const updateRfp = async (
  updateDto: RfpUpdateDto,
  mutation: UseMutationResult<RfpDetailDto, Error, RfpUpdateDto>,
  form: UseFormReturn<RfpFormValues>,
  onSuccess?: () => void
): Promise<void> => {
  try {
    const result = await mutation.mutateAsync(updateDto);
    await handleUpdateSuccess(result, form);
    alert("RFP updated successfully");
    onSuccess?.();
  } catch (error) {
    handleUpdateError(error);
  }
};
