"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Building2, CalendarIcon, Clock, DollarSign, FileText, Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { UseFormReturn, useWatch } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { PoFormValues } from "../../_schema/po.schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import LookupVendor from "@/components/lookup/LookupVendor";
import LookupCurrency from "@/components/lookup/LookupCurrency";
import LookupCreditTerm from "@/components/lookup/LookupCreditTerm";
import LookupUserList from "@/components/lookup/LookupUserList";
import { format, startOfDay } from "date-fns";
import { TextareaValidate } from "@/components/ui-custom/TextareaValidate";

interface Props {
  readonly form: UseFormReturn<PoFormValues>;
  readonly currentMode: formType;
  readonly buCode: string;
  readonly dateFormat?: string;
  readonly currencyBase?: string;
}

// Disable past dates (before today)
const disablePastDates = (date: Date) => {
  const today = startOfDay(new Date());
  return date < today;
};

export default function HeadPoForm({ form, currentMode, buCode, dateFormat, currencyBase }: Props) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");

  const isViewMode = currentMode === formType.VIEW;
  const isEditMode = currentMode === formType.EDIT || currentMode === formType.ADD;

  const vendorName = useWatch({ control: form.control, name: "vendor_name" });
  const buyerName = useWatch({ control: form.control, name: "buyer_name" });
  const currencyName = useWatch({ control: form.control, name: "currency_name" });
  const creditTermName = useWatch({ control: form.control, name: "credit_term_name" });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          icon={<Building2 className="h-4 w-4" />}
          name="vendor_id"
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPurchaseOrder("vendor")}</FormLabel>
              <FormControl>
                {isEditMode ? (
                  <LookupVendor
                    value={field.value}
                    onValueChange={field.onChange}
                    onSelectObject={(vendor) => {
                      form.setValue("vendor_name", vendor.name);
                    }}
                    bu_code={buCode}
                    classNames="h-9"
                  />
                ) : (
                  <Input value={vendorName ?? "-"} className="h-9 bg-muted" disabled />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order_date"
          icon={<CalendarIcon className="h-4 w-4" />}
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPurchaseOrder("order_date")}</FormLabel>
              <FormControl>
                {isEditMode ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-9 justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(new Date(field.value), dateFormat || "yyyy-MM-dd")
                          : tPurchaseOrder("select_date")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        disabled={disablePastDates}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Input
                    value={
                      field.value ? format(new Date(field.value), dateFormat || "yyyy-MM-dd") : "-"
                    }
                    className="h-9 bg-muted"
                    disabled
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="delivery_date"
          icon={<CalendarIcon className="h-4 w-4" />}
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPurchaseOrder("delivery_date")}</FormLabel>
              <FormControl>
                {isEditMode ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-9 justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(new Date(field.value), dateFormat || "yyyy-MM-dd")
                          : tPurchaseOrder("select_date")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        disabled={disablePastDates}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Input
                    value={
                      field.value ? format(new Date(field.value), dateFormat || "yyyy-MM-dd") : "-"
                    }
                    className="h-9 bg-muted"
                    disabled
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buyer_id"
          icon={<User className="h-4 w-4" />}
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPurchaseOrder("buyer")}</FormLabel>
              <FormControl>
                {isEditMode ? (
                  <LookupUserList
                    value={field.value}
                    onValueChange={field.onChange}
                    onSelectObject={(user) => {
                      form.setValue("buyer_name", `${user.firstname} ${user.lastname}`.trim());
                    }}
                    classNames="h-9"
                  />
                ) : (
                  <Input value={buyerName ?? "-"} className="h-9 bg-muted" disabled />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          icon={<DollarSign className="h-4 w-4" />}
          name="currency_id"
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPurchaseOrder("currency")}</FormLabel>
              <FormControl>
                {isEditMode ? (
                  <LookupCurrency
                    value={field.value}
                    onValueChange={field.onChange}
                    onSelectObject={(currency) => {
                      form.setValue("currency_name", currency.name);
                      form.setValue("exchange_rate", currency.exchange_rate || 1);
                    }}
                    bu_code={buCode}
                    defaultCode={currencyBase}
                  />
                ) : (
                  <Input value={currencyName ?? "-"} className="h-9 bg-muted text-right" disabled />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exchange_rate"
          icon={<DollarSign className="h-4 w-4" />}
          required
          render={({ field }) => {
            const rate = field.value ?? 1;
            const convertedAmount = 1 / rate;
            const displayValue = `${convertedAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })} ${currencyBase}`;

            return (
              <FormItem>
                <FormLabel>{tPurchaseOrder("exchange_rate")}</FormLabel>
                <FormControl>
                  <Input value={displayValue} className="text-right" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="credit_term_id"
          icon={<Clock className="h-4 w-4" />}
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPurchaseOrder("credit_term")}</FormLabel>
              <FormControl>
                {isEditMode ? (
                  <LookupCreditTerm
                    value={field.value}
                    onValueChange={field.onChange}
                    onSelectObject={(creditTerm) => {
                      form.setValue("credit_term_name", creditTerm.name);
                      form.setValue("credit_term_value", creditTerm.value);
                    }}
                  />
                ) : (
                  <Input value={creditTermName ?? "-"} className="h-9 bg-muted" disabled />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          icon={<Mail className="h-4 w-4" />}
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPurchaseOrder("email")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  value={field.value ?? ""}
                  className={cn("h-9", isViewMode && "bg-muted")}
                  disabled={isViewMode}
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
        icon={<FileText className="h-4 w-4" />}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tPurchaseOrder("description")}</FormLabel>
            <FormControl>
              <TextareaValidate
                {...field}
                value={field.value ?? ""}
                className={cn(isViewMode && "bg-muted")}
                disabled={isViewMode}
                maxLength={256}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
