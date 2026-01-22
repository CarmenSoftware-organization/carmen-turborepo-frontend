"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Building2, CalendarIcon, Clock, DollarSign, FileText, Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { UseFormReturn, useWatch } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { PoFormValues } from "../../_schema/po.schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LookupVendor from "@/components/lookup/LookupVendor";
import LookupCurrency from "@/components/lookup/LookupCurrency";
import LookupCreditTerm from "@/components/lookup/LookupCreditTerm";
import LookupUserList from "@/components/lookup/LookupUserList";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

interface Props {
  readonly form: UseFormReturn<PoFormValues>;
  readonly currentMode: formType;
  readonly buCode: string;
}

export default function HeadPoForm({ form, currentMode, buCode }: Props) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const { dateFormat } = useAuth();

  const isViewMode = currentMode === formType.VIEW;
  const isEditMode = currentMode === formType.EDIT || currentMode === formType.ADD;

  // Use useWatch for display values in view mode (better performance than form.watch)
  const vendorName = useWatch({ control: form.control, name: "vendor_name" });
  const buyerName = useWatch({ control: form.control, name: "buyer_name" });
  const currencyName = useWatch({ control: form.control, name: "currency_name" });
  const creditTermName = useWatch({ control: form.control, name: "credit_term_name" });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Row 1: Vendor & Order Info */}
        <FormField
          control={form.control}
          name="vendor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {tPurchaseOrder("vendor")}
              </FormLabel>
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
                  <Input
                    value={vendorName ?? "-"}
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
          name="order_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                {tPurchaseOrder("order_date")}
              </FormLabel>
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
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                {tPurchaseOrder("delivery_date")}
              </FormLabel>
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
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <User className="h-4 w-4" />
                {tPurchaseOrder("buyer")}
              </FormLabel>
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
                  <Input
                    value={buyerName ?? "-"}
                    className="h-9 bg-muted"
                    disabled
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 2: Currency & Credit Term */}
        <FormField
          control={form.control}
          name="currency_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {tPurchaseOrder("currency")}
              </FormLabel>
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
                    classNames="h-9"
                  />
                ) : (
                  <Input
                    value={currencyName ?? "-"}
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
          name="exchange_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {tPurchaseOrder("exchange_rate")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  value={field.value ?? 1}
                  className={cn("h-9", isViewMode && "bg-muted")}
                  disabled={isViewMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="credit_term_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {tPurchaseOrder("credit_term")}
              </FormLabel>
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
                  <Input
                    value={creditTermName ?? "-"}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {tPurchaseOrder("email")}
              </FormLabel>
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
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
              <FileText className="h-4 w-4" />
              {tPurchaseOrder("description")}
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ""}
                className={cn(isViewMode && "bg-muted")}
                disabled={isViewMode}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
