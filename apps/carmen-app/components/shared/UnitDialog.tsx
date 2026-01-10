"use client";

import { createUnitSchema, UnitDto, CreateUnitDto } from "@/dtos/unit.dto";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
import { InputValidate } from "../ui-custom/InputValidate";
import { TextareaValidate } from "../ui-custom/TextareaValidate";

interface UnitDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly mode: formType;
  readonly unit?: UnitDto;
  readonly onSubmit: (data: CreateUnitDto) => void;
  readonly isLoading?: boolean;
}

export default function UnitDialog({
  open,
  onOpenChange,
  mode,
  unit,
  onSubmit,
  isLoading = false,
}: UnitDialogProps) {
  const tCommon = useTranslations("Common");
  const tUnit = useTranslations("Unit");

  const defaultValues: CreateUnitDto = {
    name: "",
    description: "",
    is_active: true,
  };

  const unitSchema = useMemo(
    () =>
      createUnitSchema({
        nameRequired: tUnit("unit_name_required"),
      }),
    [tUnit]
  );

  const getFormDefaultValues = useCallback((): CreateUnitDto => {
    if (mode === formType.EDIT && unit) {
      return {
        name: unit.name || "",
        description: unit.description || "",
        is_active: unit.is_active ?? true,
      };
    }
    return defaultValues;
  }, [mode, unit]);

  const form = useForm<CreateUnitDto>({
    resolver: zodResolver(unitSchema),
    defaultValues: getFormDefaultValues(),
  });

  useEffect(() => {
    const newDefaultValues = getFormDefaultValues();
    form.reset(newDefaultValues);
  }, [mode, unit, open, form, getFormDefaultValues]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formData: CreateUnitDto) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("handleSubmit", formData);
    try {
      const validatedData = unitSchema.parse(formData);
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
          <DialogTitle>{mode === formType.ADD ? tCommon("add") : tCommon("edit")}</DialogTitle>
          <DialogDescription>
            {mode === formType.ADD ? tUnit("add_description") : tUnit("edit_description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => handleSubmit(e, form.getValues())} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon("name")}</FormLabel>
                  <FormControl>
                    <InputValidate {...field} maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon("description")}</FormLabel>
                  <FormControl>
                    <TextareaValidate {...field} maxLength={256} />
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
                      label={tCommon("active")}
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
