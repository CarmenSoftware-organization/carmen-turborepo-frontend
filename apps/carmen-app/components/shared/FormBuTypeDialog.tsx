"use client";

import { BuTypeFormDto } from "@/dtos/bu-type.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormBoolean from "@/components/form-custom/form-boolean";
import { Button } from "@/components/ui/button";
import { createBuTypeFormSchema } from "@/dtos/bu-type-form.dto";
import { InputValidate } from "../ui-custom/InputValidate";
import { TextareaValidate } from "../ui-custom/TextareaValidate";

interface FormBuTypeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BuTypeFormDto) => void;
  editingProfile?: BuTypeFormDto | null;
  onCancel: () => void;
}

export const FormBuTypeDialog = ({
  open,
  onOpenChange,
  onSubmit,
  editingProfile,
  onCancel,
}: FormBuTypeProps) => {
  const tCommon = useTranslations("Common");
  const tBusinessType = useTranslations("BusinessType");

  const buTypeFormSchema = useMemo(
    () =>
      createBuTypeFormSchema({
        nameRequired: tBusinessType("bu_name_require"),
      }),
    [tBusinessType]
  );

  const form = useForm<BuTypeFormDto>({
    resolver: zodResolver(buTypeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      note: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (editingProfile) {
        form.reset({
          name: editingProfile.name,
          description: editingProfile.description || "",
          note: editingProfile.note || "",
          is_active: editingProfile.is_active,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          note: "",
          is_active: true,
        });
      }
    }
  }, [open, editingProfile, form]);

  const handleSubmit = (data: BuTypeFormDto) => {
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
            {editingProfile
              ? tBusinessType("edit_business_type")
              : tBusinessType("add_business_type")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tBusinessType("name")}</FormLabel>
                  <FormControl>
                    <InputValidate placeholder={tBusinessType("name")} {...field} maxLength={100} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              required
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tBusinessType("description")}</FormLabel>
                  <FormControl>
                    <TextareaValidate
                      {...field}
                      value={field.value || ""}
                      placeholder={tCommon("description")}
                      maxLength={200}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tBusinessType("note")}</FormLabel>
                  <FormControl>
                    <TextareaValidate
                      {...field}
                      value={field.value || ""}
                      placeholder={tCommon("note")}
                      maxLength={200}
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
                    <FormBoolean
                      value={field.value}
                      onChange={field.onChange}
                      label={tCommon("active")}
                      type="checkbox"
                    />
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
