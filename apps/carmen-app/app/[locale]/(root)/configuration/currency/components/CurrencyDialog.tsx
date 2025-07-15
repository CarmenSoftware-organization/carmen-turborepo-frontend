"use client";

import { formType } from "@/dtos/form.dto";
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
import ExchangeRateLookup from "@/components/lookup/ExchangeRateLookup";
import currenciesIso from "@/constants/currency";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import NumberInput from "@/components/form-custom/NumberInput";
import {
  CurrencyGetDto,
  CurrencyCreateDto,
  CurrencyUpdateDto,
  currencyCreateSchema,
  currencyUpdateSchema
} from "@/dtos/currency.dto";

interface CurrencyDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly mode: formType;
  readonly currency?: CurrencyGetDto;
  readonly onSubmit: (data: CurrencyCreateDto | CurrencyUpdateDto) => void;
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

  const { exchangeRates } = useExchangeRate({ baseCurrency: "THB" });

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

  const schema = mode === formType.ADD ? currencyCreateSchema : currencyUpdateSchema;

  const form = useForm<CurrencyCreateDto | CurrencyUpdateDto>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === formType.EDIT && currency
        ? { ...currency }
        : defaultCurrencyValues,
  });

  const watchedCode = form.watch("code");

  useEffect(() => {
    if (mode === formType.EDIT && currency) {
      form.reset({ ...currency });
    } else {
      form.reset({ ...defaultCurrencyValues });
    }
  }, [mode, currency, form, defaultCurrencyValues]);

  useEffect(() => {
    if (!open) {
      form.reset({ ...defaultCurrencyValues });
    }
  }, [open, form, defaultCurrencyValues]);

  useEffect(() => {
    if (watchedCode && mode === formType.ADD) {
      const selectedCurrency = currenciesIso.find(
        (currency) => currency.code === watchedCode
      );

      if (selectedCurrency) {
        const exchangeRate = exchangeRates[selectedCurrency.code] || 0.01;
        form.setValue("name", selectedCurrency.name);
        form.setValue("symbol", selectedCurrency.symbol);
        form.setValue("exchange_rate", exchangeRate);
        form.setValue(
          "description",
          `${selectedCurrency.name} (${selectedCurrency.country})`
        );
      }
    }
  }, [watchedCode, mode, form, exchangeRates]);

  const handleSubmit = async (data: CurrencyCreateDto | CurrencyUpdateDto) => {
    try {
      const validatedData = schema.parse(data);
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCurrency("currency_code")}</FormLabel>
                    <FormControl>
                      <ExchangeRateLookup
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={tCurrency("currency_code")}
                        showExchangeRate={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCurrency("currency_symbol")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        className="bg-muted"
                        placeholder="Currency symbol"
                      />
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
                      <NumberInput
                        {...field}
                        onChange={(e) => field.onChange(e)}
                        min={0.01}
                        step={0.01}
                        disabled
                        classNames="bg-muted"
                        placeholder="Exchange rate"
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
