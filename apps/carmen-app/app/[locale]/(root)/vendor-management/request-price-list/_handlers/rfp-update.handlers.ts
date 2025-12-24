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
    status: result.status || "active", // Default fallback if undefined
    start_date: result.start_date,
    end_date: result.end_date,
    custom_message: result.custom_message,
    info: result.info,
    dimension: result.dimension,
    pricelist_template_id: result.pricelist_template?.id,
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
