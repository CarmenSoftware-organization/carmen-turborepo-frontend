"use client";

import { formType } from "@/dtos/form.dto";
import { CurrencyDto, currencySchema } from "@/dtos/config.dto";
import { useEffect, useMemo } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

interface CurrencyDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly mode: formType;
  readonly currency?: CurrencyDto;
  readonly onSubmit: (data: CurrencyDto) => void;
  readonly isLoading?: boolean;
}

export default function CurrencyDialog({
  open,
  onOpenChange,
  mode,
  currency,
  onSubmit,
  isLoading = false,
}: CurrencyDialogProps) {
  const tCurrency = useTranslations("Currency");
  const tCommon = useTranslations("Common");

  const defaultCurrencyValues = useMemo(
    () => ({
      name: "",
      code: "",
      symbol: "",
      description: "",
      exchange_rate: 0.01,
      is_active: true,
    }),
    []
  );

  const form = useForm<CurrencyDto>({
    resolver: zodResolver(currencySchema),
    defaultValues:
      mode === formType.EDIT && currency
        ? { ...currency }
        : defaultCurrencyValues,
  });

  useEffect(() => {
    if (mode === formType.EDIT && currency) {
      form.reset({ ...currency });
    } else {
      form.reset({ ...defaultCurrencyValues });
    }
  }, [mode, currency, form, defaultCurrencyValues]);

  const handleSubmit = async (data: CurrencyDto) => {
    try {
      const validatedData = currencySchema.parse(data);
      onSubmit(validatedData);
      form.reset(defaultCurrencyValues);
      onOpenChange(false);
    } catch (error) {
      console.error("Validation Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === formType.ADD
              ? tCurrency("add_currency")
              : tCurrency("edit_currency")}
          </DialogTitle>
          <DialogDescription>
            {mode === formType.ADD
              ? tCurrency("add_currency_description")
              : tCurrency("edit_currency_description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCurrency("currency_name")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCurrency("currency_code")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCurrency("currency_symbol")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exchange_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCurrency("currency_exchange_rate")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min={0.01}
                        step="any"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCommon("description")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {tCommon("status")}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600"
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
              >
                {tCommon("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading || form.formState.isSubmitting}
              >
                {tCommon("save")}
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
