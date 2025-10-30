"use client";

import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import {
  DeliveryPointCreateDto,
  DeliveryPointUpdateDto,
  DeliveryPointGetDto,
  createDeliveryPointCreateSchema,
  createDeliveryPointUpdateSchema,
} from "@/dtos/delivery-point.dto";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import FormBoolean from "@/components/form-custom/form-boolean";

interface DeliveryPointDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly mode: formType;
  readonly deliveryPoint?: DeliveryPointGetDto;
  readonly onSubmit: (data: DeliveryPointCreateDto | DeliveryPointUpdateDto) => void;
  readonly isLoading?: boolean;
}

export default function DeliveryPointDialog({
  open,
  onOpenChange,
  mode,
  deliveryPoint,
  onSubmit,
  isLoading = false,
}: DeliveryPointDialogProps) {
  const tCommon = useTranslations("Common");
  const tDeliveryPoint = useTranslations("DeliveryPoint");

  const defaultValues: DeliveryPointCreateDto = {
    name: "",
    is_active: true,
  };

  const schema = useMemo(() => {
    const messages = { nameRequired: tDeliveryPoint("pls_fill_dp_name") };
    return mode === formType.EDIT
      ? createDeliveryPointUpdateSchema(messages)
      : createDeliveryPointCreateSchema(messages);
  }, [mode, tDeliveryPoint]);

  const getFormDefaultValues = useCallback((): DeliveryPointCreateDto | DeliveryPointUpdateDto => {
    if (mode === formType.EDIT && deliveryPoint) {
      return {
        id: deliveryPoint.id,
        name: deliveryPoint.name || "",
        is_active: deliveryPoint.is_active ?? true,
      };
    }
    return defaultValues;
  }, [mode, deliveryPoint]);

  const form = useForm<DeliveryPointCreateDto | DeliveryPointUpdateDto>({
    resolver: zodResolver(schema),
    defaultValues: getFormDefaultValues(),
  });

  useEffect(() => {
    const newDefaultValues = getFormDefaultValues();
    form.reset(newDefaultValues);
  }, [mode, deliveryPoint, open, form, getFormDefaultValues]);

  const handleSubmit = async (formData: DeliveryPointCreateDto | DeliveryPointUpdateDto) => {
    try {
      const validatedData = schema.parse(formData);
      onSubmit(validatedData);
      form.reset(defaultValues);
      onOpenChange(false);
    } catch (error) {
      console.error("Validation Error:", error);
    }
  };

  const handleCancel = useCallback(() => {
    form.reset(getFormDefaultValues());
    onOpenChange(false);
  }, [form, getFormDefaultValues, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === formType.ADD
              ? tDeliveryPoint("add_delivery_point")
              : tDeliveryPoint("edit_delivery_point")}
          </DialogTitle>
          <DialogDescription>
            {mode === formType.ADD
              ? tDeliveryPoint("add_delivery_point_description")
              : tDeliveryPoint("edit_delivery_point_description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon("name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FormBoolean
                      value={field.value}
                      onChange={field.onChange}
                      label={tCommon("status")}
                      type="checkbox"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading || form.formState.isSubmitting}>
                {mode === formType.ADD ? tCommon("add") : tCommon("save")}
                {(isLoading || form.formState.isSubmitting) && (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
