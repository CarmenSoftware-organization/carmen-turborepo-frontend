"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  CalendarIcon,
  Clock,
  DollarSign,
  FileText,
  Mail,
  NotebookPen,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { PoFormValues } from "../../_schema/po.schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LookupVendor from "@/components/lookup/LookupVendor";
import LookupCurrency from "@/components/lookup/LookupCurrency";
import { DatePicker } from "@/components/ui-custom/date-picker";
import { useAuth } from "@/context/AuthContext";

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    onValueChange={(value, vendor) => {
                      field.onChange(value);
                      if (vendor) {
                        form.setValue("vendor_name", vendor.name);
                      }
                    }}
                    bu_code={buCode}
                    className="h-9"
                  />
                ) : (
                  <Input
                    value={form.watch("vendor_name") ?? "-"}
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
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date?.toISOString())}
                    dateFormat={dateFormat || "yyyy-MM-dd"}
                    className="h-9"
                  />
                ) : (
                  <Input value={field.value ?? "-"} className="h-9 bg-muted" disabled />
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
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => field.onChange(date?.toISOString())}
                    dateFormat={dateFormat || "yyyy-MM-dd"}
                    className="h-9"
                  />
                ) : (
                  <Input value={field.value ?? "-"} className="h-9 bg-muted" disabled />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buyer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <User className="h-4 w-4" />
                {tPurchaseOrder("buyer")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  className={cn("h-9", isViewMode && "bg-muted")}
                  disabled={isViewMode}
                />
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
                    onValueChange={(value, currency) => {
                      field.onChange(value);
                      if (currency) {
                        form.setValue("currency_name", currency.name);
                        form.setValue("exchange_rate", currency.exchange_rate || 1);
                      }
                    }}
                    bu_code={buCode}
                    className="h-9"
                  />
                ) : (
                  <Input
                    value={form.watch("currency_name") ?? "-"}
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
          name="credit_term_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {tPurchaseOrder("credit_term")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
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

      {/* Description & Note */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
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
                  className={cn("min-h-[100px]", isViewMode && "bg-muted")}
                  disabled={isViewMode}
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
              <FormLabel className="flex items-center gap-1.5 text-muted-foreground">
                <NotebookPen className="h-4 w-4" />
                {tPurchaseOrder("note")}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  className={cn("min-h-[100px]", isViewMode && "bg-muted")}
                  disabled={isViewMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
