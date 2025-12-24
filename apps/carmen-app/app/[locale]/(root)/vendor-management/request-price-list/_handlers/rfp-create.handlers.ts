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
    status: result.status || "draft",
    start_date: result.start_date,
    end_date: result.end_date,
    custom_message: result.custom_message,
    info: result.info,
    dimension: result.dimension,
    pricelist_template_id: result.pricelist_template?.id,
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
