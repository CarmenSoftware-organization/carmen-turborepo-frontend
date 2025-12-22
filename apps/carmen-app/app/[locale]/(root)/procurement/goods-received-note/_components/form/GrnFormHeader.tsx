"use client";

import { Control, useWatch } from "react-hook-form";
import {
  Store,
  Coins,
  GitBranch,
  Clock,
  AlignLeft,
  MessageSquare,
  CalendarIcon,
  DollarSign,
  Hash,
} from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formType } from "@/dtos/form.dto";
import { CreateGRNDto } from "@/dtos/grn.dto";
import VendorLookup from "@/components/lookup/VendorLookup";
import { useVendor } from "@/hooks/use-vendor";
import LookupCurrency from "@/components/lookup/LookupCurrency";
import { Label } from "@/components/ui/label";
import { useCreditTermQuery } from "@/hooks/use-credit-term";
import { useAuth } from "@/context/AuthContext";
import CalendarButton from "@/components/form-custom/CalendarButton";
import DateInput from "@/components/form-custom/DateInput";
import { useCurrenciesQuery } from "@/hooks/use-currency";
import LookupCreditTerm from "@/components/lookup/LookupCreditTerm";

interface GrnFormHeaderProps {
  readonly control: Control<CreateGRNDto>;
  readonly mode: formType;
}

export default function GrnFormHeader({ control, mode }: GrnFormHeaderProps) {
  const { token, buCode } = useAuth();
  const { getVendorName } = useVendor(token, buCode);
  const { getCreditTermName } = useCreditTermQuery(token, buCode);
  const { getCurrencyCode, getCurrencyExchangeRate } = useCurrenciesQuery(token, buCode);

  const currencyId = useWatch({
    control,
    name: "currency_id",
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="grn_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  GRN
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value}
                  disabled
                  className="bg-muted"
                  placeholder="GRN Number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="received_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  Date
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <CalendarButton field={field} />
              ) : (
                <DateInput field={field} />
              )}
            </FormItem>
          )}
        />

        {/* Vendor ID */}
        <FormField
          control={control}
          name="vendor_id"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="font-medium">
                <div className="flex items-center gap-2">
                  <Store className="h-3 w-3" />
                  Vendor
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Input value={getVendorName(field.value ?? "")} disabled className="bg-muted" />
              ) : (
                <FormControl>
                  <VendorLookup onValueChange={field.onChange} value={field.value} />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="invoice_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-3 w-3" />
                  Invoice No.
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Input value={field.value} disabled className="bg-muted" />
              ) : (
                <FormControl>
                  <Input {...field} />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="invoice_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  Invoice Date
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <CalendarButton field={field} />
              ) : (
                <DateInput field={field} />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="font-medium">
                <div className="flex items-center gap-2">
                  <AlignLeft className="h-3 w-3" />
                  Description
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={mode === formType.VIEW}
                  className={`${mode === formType.VIEW ? "bg-muted" : ""}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="currency_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                <div className="flex items-center gap-2">
                  <Coins className="h-3 w-3" />
                  Currency
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Input value={getCurrencyCode(field.value ?? "")} disabled className="bg-muted" />
              ) : (
                <FormControl>
                  <LookupCurrency onValueChange={field.onChange} value={field.value} />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label className="font-medium">
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3" />
              Exchange Rate
            </div>
          </Label>
          <Input value={getCurrencyExchangeRate(currencyId ?? "")} disabled className="bg-muted" />
        </div>

        <FormField
          control={control}
          name="credit_term_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Credit Term
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Input value={getCreditTermName(field.value ?? "")} disabled className="bg-muted" />
              ) : (
                <FormControl>
                  <LookupCreditTerm onValueChange={field.onChange} value={field.value} />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="payment_due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  Date
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <CalendarButton field={field} />
              ) : (
                <DateInput field={field} />
              )}
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="note"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="font-medium">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" />
                  Note
                </div>
              </FormLabel>
              <Textarea
                value={field.value}
                disabled={mode === formType.VIEW}
                className={`${mode === formType.VIEW ? "bg-muted" : ""}`}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
