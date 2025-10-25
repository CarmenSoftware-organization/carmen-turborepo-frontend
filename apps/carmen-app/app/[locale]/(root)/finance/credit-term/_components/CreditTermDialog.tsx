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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createCreditTermSchema,
  CreateCreditTermFormValues,
  CreditTermGetAllDto,
} from "@/dtos/credit-term.dto";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formType } from "@/dtos/form.dto";

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

  const form = useForm<CreateCreditTermFormValues>({
    resolver: zodResolver(createCreditTermSchema),
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
    mode === formType.EDIT ? "Edit Credit Term" : "New Credit Term";
  const dialogDescription =
    mode === formType.EDIT
      ? "Update the credit term details"
      : "Create a new credit term with payment conditions";
  const submitButtonText =
    mode === formType.EDIT ? "Update Credit Term" : "Create Credit Term";

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
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon("name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter credit term name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value (Days)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      placeholder="Enter number of days"
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      placeholder="Enter description"
                      rows={3}
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
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter note" rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this credit term
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
                {isLoading || form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === formType.EDIT ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
