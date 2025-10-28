"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateCreditTermFormValues,
  CreditTermGetAllDto,
} from "@/dtos/credit-term.dto";
import { createCreditTermFormSchema } from "../_schemas/credit-term-form.schema";
import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { formType } from "@/dtos/form.dto";
import NumberInput from "@/components/form-custom/NumberInput";
import FormBoolean from "@/components/form-custom/form-boolean";

interface CreditTermDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: CreateCreditTermFormValues) => void;
  readonly isLoading?: boolean;
  readonly creditTerm?: CreditTermGetAllDto | null;
  readonly mode?: formType;
}

export default function CreditTermDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  creditTerm,
  mode,
}: CreditTermDialogProps) {
  const tCommon = useTranslations("Common");
  const tCreditTerm = useTranslations("CreditTerm");

  const creditTermSchema = useMemo(
    () =>
      createCreditTermFormSchema({
        nameRequired: tCreditTerm("credit_term_required"),
        valueMin: tCreditTerm("credit_term_value_required"),
      }),
    [tCreditTerm]
  );

  const form = useForm<CreateCreditTermFormValues>({
    resolver: zodResolver(creditTermSchema),
    defaultValues: {
      name: "",
      value: 0,
      description: "",
      is_active: true,
      note: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      return;
    }

    if (mode === formType.ADD) {
      form.reset({
        name: "",
        value: 0,
        description: "",
        is_active: true,
        note: "",
      });
    } else if (mode === formType.EDIT && creditTerm) {
      form.reset({
        name: creditTerm.name,
        value: Number(creditTerm.value),
        description: creditTerm.description || "",
        is_active: creditTerm.is_active,
        note: creditTerm.note || "",
      });
    }
  }, [open, mode, creditTerm, form]);

  const handleSubmit = (data: CreateCreditTermFormValues) => {
    onSubmit(data);
  };

  const dialogTitle =
    mode === formType.EDIT ? tCreditTerm("dialog_title_edit") : tCreditTerm("dialog_title_add");

  const dialogDescription =
    mode === formType.EDIT
      ? tCreditTerm("dialog_title_desc_edit")
      : tCreditTerm("dialog_title_desc_add");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="name"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCreditTerm("title")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={tCreditTerm("title")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCreditTerm("days")}</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value}
                      onChange={field.onChange}
                      min={0}
                      placeholder={tCreditTerm("days")}
                    />
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
                    <Textarea
                      {...field}
                      placeholder={tCommon("description")}
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
                  <FormLabel>{tCommon("note")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder={tCommon("note")} />
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
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {tCommon("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading || form.formState.isSubmitting}
              >
                {tCommon("save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
