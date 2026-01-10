"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import FormBoolean from "@/components/form-custom/form-boolean";
import NumberInput from "@/components/form-custom/NumberInput";
import { TaxProfileFormData } from "@/dtos/tax-profile.dto";
import { createTaxProfileFormSchema } from "../_schemas/tax-profile-form.schema";
import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import { Percent } from "lucide-react";

interface FormTaxProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaxProfileFormData) => void;
  editingProfile?: TaxProfileFormData | null;
  onCancel: () => void;
}

export const FormTaxProfile = ({
  open,
  onOpenChange,
  onSubmit,
  editingProfile,
  onCancel,
}: FormTaxProfileProps) => {
  const tCommon = useTranslations("Common");
  const tTaxProfile = useTranslations("TaxProfile");

  const taxProfileSchema = useMemo(
    () =>
      createTaxProfileFormSchema({
        nameRequired: tTaxProfile("name_required"),
        taxRateRequired: tTaxProfile("tax_rate_required"),
        taxRateInvalid: tTaxProfile("tax_rate_invalid"),
        taxRateMin: tTaxProfile("tax_rate_min"),
        taxRateMax: tTaxProfile("tax_rate_max"),
      }),
    [tTaxProfile]
  );

  const form = useForm<TaxProfileFormData>({
    resolver: zodResolver(taxProfileSchema),
    defaultValues: {
      name: "",
      tax_rate: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (editingProfile) {
        form.reset({
          name: editingProfile.name,
          tax_rate: editingProfile.tax_rate,
          is_active: editingProfile.is_active,
        });
      } else {
        form.reset({
          name: "",
          tax_rate: 0,
          is_active: true,
        });
      }
    }
  }, [open, editingProfile, form]);

  const handleSubmit = (data: TaxProfileFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingProfile ? tTaxProfile("edit_tax_profile") : tTaxProfile("add_tax_profile")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tTaxProfile("name")}</FormLabel>
                  <FormControl>
                    <InputValidate placeholder="e.g. VAT 7%" {...field} maxLength={100} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_rate"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tTaxProfile("rate")} %</FormLabel>
                  <FormControl>
                    <NumberInput
                      {...field}
                      placeholder="e.g. 7"
                      min={0}
                      max={100}
                      step={1}
                      suffix={<Percent className="w-3 h-3" />}
                    />
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
                    <FormBoolean {...field} label={tCommon("active")} type="checkbox" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                {tCommon("cancel")}
              </Button>
              <Button type="submit">{editingProfile ? tCommon("save") : tCommon("add")}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
