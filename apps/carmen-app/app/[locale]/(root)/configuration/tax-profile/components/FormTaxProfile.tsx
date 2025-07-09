"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import FormBoolean from "@/components/form-custom/form-boolean";
import NumberInput from "@/components/form-custom/NumberInput";
import { TaxProfileFormData, taxProfileSchema } from "@/dtos/tax-profile.dto";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

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

  const form = useForm<TaxProfileFormData>({
    resolver: zodResolver(taxProfileSchema),
    defaultValues: {
      name: "",
      tax_rate: 0,
      is_active: true,
    },
  });

  // Reset form when dialog opens/closes or editing profile changes
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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tTaxProfile("name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. VAT 7%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_rate"
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
                    <FormBoolean {...field} label={tCommon("active")} type="switch" />
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
