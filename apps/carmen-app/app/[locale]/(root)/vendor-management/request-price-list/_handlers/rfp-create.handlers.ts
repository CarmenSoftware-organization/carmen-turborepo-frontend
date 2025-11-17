import { UseMutationResult } from "@tanstack/react-query";
import { RfpCreateDto, RfpDto } from "@/dtos/rfp.dto";
import { UseFormReturn } from "react-hook-form";
import { RfpFormValues } from "../_schema/rfp.schema";

export const handleCreateSuccess = async (
  result: RfpDto,
  form: UseFormReturn<RfpFormValues>,
  data: RfpFormValues
): Promise<void> => {
  form.reset({
    name: result.name,
    status: result.status,
    description: result.description,
    valid_period: result.valid_period,
    template_id: data.template_id,
    portal_duration: data.portal_duration,
    rfp_type: data.rfp_type,
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

export const createRfp = async (
  createDto: RfpCreateDto,
  mutation: UseMutationResult<RfpDto, Error, RfpCreateDto>,
  form: UseFormReturn<RfpFormValues>,
  data: RfpFormValues,
  onSuccess?: () => void
): Promise<void> => {
  try {
    const result = await mutation.mutateAsync(createDto);
    await handleCreateSuccess(result, form, data);
    alert("RFP created successfully");
    onSuccess?.();
  } catch (error) {
    handleCreateError(error);
  }
};
